import { Request, Response } from 'express';
import OrderModel from '../models/Order';
import { AuthenticatedRequest } from '../types';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation';


export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const createdBy = req.user?.userId;

    if (!createdBy) {
      res.status(401).json({ message: 'Yetkisiz' });
      return;
    }

    // status: 'beklemede' ve createdBy backend'de zorunlu
    const data = createOrderSchema.parse({ ...req.body, status: 'beklemede', createdBy });

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

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    await OrderModel.findByIdAndDelete(req.params.orderId);
    res.status(200).json({ message: 'Sipariş silindi.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Sipariş silinemedi.', error: err.message });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = updateOrderStatusSchema.parse(req.body);
    const { orderId } = req.params;

    const updated = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Sipariş bulunamadı.' });
      return;
    }

    let statusMessage = 'Sipariş durumu güncellendi.';
    if (status === 'hazırlanıyor') statusMessage = 'Sipariş hazırlanıyor.';
    else if (status === 'hazır') statusMessage = 'Sipariş hazır.';

    res.status(200).json({ message: statusMessage, order: updated });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ message: 'Geçersiz veri.', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Sipariş güncellenemedi.', error: err.message });
    }
  }
};


export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderModel.find()
      .populate('branchId') // ✅ alan adı düzeltildi
      .populate('createdBy', 'name'); // 👤 opsiyonel, kullanıcı ismi için
    res.status(200).json(orders);
  } catch (error: any) {
    console.error('❌ Sipariş listeleme hatası:', error);
    res.status(500).json({ message: 'Siparişler alınamadı.', error: error.message });
  }
};


export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updated = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Sipariş bulunamadı.' });
      return;
    }

    res.status(200).json({ message: 'Sipariş durumu güncellendi.', order: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Durum güncellenemedi.', error: error.message });
  }
};

export const deleteCompletedOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await OrderModel.deleteMany({ status: 'hazır' });
    res.status(200).json({ message: 'Hazır siparişler silindi.', deletedCount: result.deletedCount });
  } catch (err: any) {
    res.status(500).json({ message: 'Silme işlemi başarısız.', error: err.message });
  }
};

