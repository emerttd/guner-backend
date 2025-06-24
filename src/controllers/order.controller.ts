// src/controllers/order.controller.ts
import express from 'express';
import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../types';
import OrderModel from '../models/Order';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation';

export const createOrder = async (
  req: AuthenticatedRequest & { body: { name: string; quantity: number; branchId?: string } },
  res: Response
): Promise<void> => {
  try {
    const createdBy = req.user?.userId;
    const userRole = req.user?.role;
    const userBranchId = req.user?.branchId;

    if (!createdBy) {
      res.status(401).json({ message: 'Yetkisiz' });
      return;
    }

    if (!req.body) {
      res.status(400).json({ message: 'Eksik istek gövdesi.' });
      return;
    }

    // branchId zorunluysa kontrol et
    if (
      (userRole !== 'worker' && !req.body.branchId) ||
      !req.body.name ||
      typeof req.body.quantity !== 'number'
    ) {
      res.status(400).json({ message: 'Eksik veya hatalı alanlar.' });
      return;
    }

    const rawData = {
      name: req.body.name,
      quantity: req.body.quantity,
      status: 'beklemede',
      createdBy,
      branchId: userRole === 'worker' ? userBranchId : req.body.branchId,
    };

    const data = createOrderSchema.parse(rawData);

    const newOrder = await OrderModel.create(data);
    res.status(201).json(newOrder);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ message: 'Geçersiz veri.', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Sipariş oluşturulamadı.', error: err.message });
    }
  }
};

export const deleteOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userBranchId = req.user?.branchId;

    if (userRole === 'admin') {
      res.status(403).json({ message: 'Admin kullanıcı sipariş silemez.' });
      return;
    }

    const order = await OrderModel.findById(req.params.orderId);

    if (!order) {
      res.status(404).json({ message: 'Sipariş bulunamadı.' });
      return;
    }

    if (userRole === 'worker' && order.branchId.toString() !== userBranchId) {
      res.status(403).json({ message: 'Worker yalnızca kendi şubesindeki siparişi silebilir.' });
      return;
    }

    await OrderModel.findByIdAndDelete(req.params.orderId);
    res.status(200).json({ message: 'Sipariş silindi.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Sipariş silinemedi.', error: err.message });
  }
};

export const updateOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userBranchId = req.user?.branchId;

    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Sipariş bulunamadı.' });
      return;
    }

    if (userRole === 'worker') {
      if (order.branchId.toString() !== userBranchId) {
        res.status(403).json({ message: 'Worker yalnızca kendi şubesindeki siparişi güncelleyebilir.' });
        return;
      }
      if (req.body && 'status' in req.body) {
        res.status(403).json({ message: 'Worker sipariş durumunu değiştiremez.' });
        return;
      }
    }

    if (req.body && 'status' in req.body) {
      updateOrderStatusSchema.parse({ status: req.body.status });
    }

    const updateData = (req.body && typeof req.body === 'object') ? req.body : {};
    const updated = await OrderModel.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Sipariş bulunamadı.' });
      return;
    }

    res.status(200).json({ message: 'Sipariş güncellendi.', order: updated });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ message: 'Geçersiz veri.', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Sipariş güncellenemedi.', error: err.message });
    }
  }
};

export const getAllOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userBranchId = req.user?.branchId;

    const query: any = {};

    if (userRole === 'worker') {
      query.branchId = userBranchId;
    }

    const orders = await OrderModel.find(query)
      .populate('branchId')
      .populate('createdBy', 'name');

    res.status(200).json(orders);
  } catch (error: any) {
    console.error('❌ Sipariş listeleme hatası:', error);
    res.status(500).json({ message: 'Siparişler alınamadı.', error: error.message });
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role;

    const { orderId } = req.params;
    const { status } = updateOrderStatusSchema.parse(req.body);

    const order = await OrderModel.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Sipariş bulunamadı.' });
      return;
    }

    if (userRole === 'worker') {
      res.status(403).json({ message: 'Worker sipariş durumunu değiştiremez.' });
      return;
    }

    const updated = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    res.status(200).json({ message: 'Sipariş durumu güncellendi.', order: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Durum güncellenemedi.', error: error.message });
  }
};

export const deleteCompletedOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'super_admin') {
      res.status(403).json({ message: 'Bu işlem sadece super admin tarafından yapılabilir.' });
      return;
    }

    const result = await OrderModel.deleteMany({ status: 'hazır' });

    res.status(200).json({ message: `${result.deletedCount} hazır siparişler silindi.` });
  } catch (error: any) {
    res.status(500).json({ message: 'Hazır siparişler silinemedi.', error: error.message });
  }
};
