import { Request, Response } from 'express';
import OrderModel from '../models/Order';
import { AuthenticatedRequest } from '../types';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrder = await OrderModel.create(req.body);
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(500).json({ message: 'Sipariş oluşturulamadı.', error: err.message });
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
    const updated = await OrderModel.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Sipariş güncellenemedi.', error: err.message });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderModel.find().populate('branch');
    res.status(200).json(orders);
  } catch (error: any) {
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
