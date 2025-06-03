import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';
import UserModel from '../models/User';
import mongoose from 'mongoose';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Token gerekli.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'Geçersiz token.' });
      return;
    }

    (req as unknown as AuthenticatedRequest).user = {
      userId: (user._id as mongoose.Types.ObjectId).toHexString(),
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Geçersiz token.' });
  }
};

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as unknown as AuthenticatedRequest).user;
  if (user?.role !== 'super_admin') {
    res.status(403).json({ message: 'Bu işlem için yetkiniz yok (super_admin gerekli).' });
    return;
  }
  next();
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as unknown as AuthenticatedRequest).user;
  if (user?.role !== 'admin') {
    res.status(403).json({ message: 'Bu işlem için yetkiniz yok (admin gerekli).' });
    return;
  }
  next();
};

export const isAdminOrSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as unknown as AuthenticatedRequest).user;
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    res.status(403).json({ message: 'Bu işlem için admin ya da super_admin yetkisi gerekli.' });
    return;
  }
  next();
};
