import { Request, Response } from 'express';
import Order from '../models/Order';

// ✅ Sipariş oluştur
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, quantity, status, branchId } = req.body;
    const createdBy = (req as any).user.id;

    const order = await Order.create({
      name,
      quantity,
      status,
      branchId,
      createdBy,
    });

    res.status(201).json({ message: 'Sipariş oluşturuldu', order });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

// ✅ Siparişleri listele
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('branchId').populate('createdBy');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

// ✅ Sipariş güncelle
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
      return;
    }
    res.json({ message: 'Sipariş güncellendi', order: updated });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

// ✅ Sipariş sil
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
      return;
    }
    res.json({ message: 'Sipariş silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};
