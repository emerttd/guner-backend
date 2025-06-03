// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';

// ✅ Yeni kullanıcı (admin veya super_admin) oluştur
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, email, password, role, branchId } = req.body;

    // E-posta kontrolü
    const existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
      return;
    }

    // Geçerli rol kontrolü
    if (!['admin', 'super_admin', 'worker'].includes(role)) {
      res.status(400).json({ message: 'Geçersiz rol.' });
      return;
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      surname,
      email,
      password: hashedPassword,
      role,
      branchId,
    });

    res.status(201).json({ message: 'Kullanıcı oluşturuldu.', user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: 'Kullanıcı oluşturulamadı.', error: err.message });
  }
};

// ✅ Tüm kullanıcıları listele
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find().populate('branchId');
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı.', error: err.message });
  }
};

// ✅ Kullanıcı sil
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await UserModel.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'Kullanıcı silindi.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Kullanıcı silinemedi.', error: err.message });
  }
};