import { z } from 'zod';

export const createOrderSchema = z.object({
  name: z.string().min(1, 'Sipariş adı gerekli.'),
  quantity: z.number().positive('Miktar pozitif sayı olmalı.'), // can be float kanziço... calm downnn.
  status: z.enum(['beklemede', 'hazırlanıyor', 'hazır']),
  branch: z.string().min(1, 'Şube ID gerekli.'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['hazırlanıyor', 'hazır']),
});
