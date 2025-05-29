import { Request, Response } from 'express';
import BranchModel from '../models/Branch';

export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const newBranch = await BranchModel.create(req.body);
    res.status(201).json(newBranch);
  } catch (err: any) {
    res.status(500).json({ message: 'Şube oluşturulamadı.', error: err.message });
  }
};

export const deleteBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    await BranchModel.findByIdAndDelete(req.params.branchId);
    res.status(200).json({ message: 'Şube silindi.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Şube silinemedi.', error: err.message });
  }
};

export const updateBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await BranchModel.findByIdAndUpdate(req.params.branchId, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Şube güncellenemedi.', error: err.message });
  }
};

export const getAllBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches = await BranchModel.find();
    res.status(200).json(branches);
  } catch (error: any) {
    res.status(500).json({ message: 'Şubeler alınamadı.', error: error.message });
  }
};
