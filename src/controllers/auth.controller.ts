import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, email, password, role, branchId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      role,
      branchId,
    });

    await user.save();

    res.status(201).json({ message: 'Kayıt başarılı' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Şifre yanlış' });
      return;
    }

    const token = jwt.sign({ id: userDoc._id, role: userDoc.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const user = userDoc.toObject();

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı.', error: error.message });
  }
};
