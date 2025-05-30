import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

export const isWorker = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'worker') {
    return res.status(403).json({ message: 'Bu işlem sadece worker rolüne sahip kullanıcılar içindir.' });
  }
  next();
};
