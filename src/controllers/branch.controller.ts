import { Request, Response } from 'express';
import Branch from '../models/Branch';

// Şube oluştur
export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location } = req.body;
    const branch = await Branch.create({ name, location });
    res.status(201).json({ message: 'Şube oluşturuldu', branch });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

// Tüm şubeleri getir
export const getAllBranches = async (_req: Request, res: Response): Promise<void> => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};
