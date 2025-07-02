import { z } from 'zod';

export const createOrderSchema = z.object({
  name: z.string().min(1, 'Sipariş adı gerekli.'),
  quantity: z.number().positive('Miktar pozitif sayı olmalı.'),
  status: z.enum(['beklemede', 'hazırlanıyor', 'hazır', 'iptal edildi']),
  branchId: z.string().min(1, 'Şube ID gerekli.'), // ✅ güncellendi
  createdBy: z.string().min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['hazırlanıyor', 'hazır', 'iptal edildi']),
});
