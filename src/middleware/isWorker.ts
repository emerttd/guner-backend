import { Request, Response, NextFunction } from 'express';

export const isWorker = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'worker') {
    return res.status(403).json({ message: 'Bu işlem sadece worker rolüne sahip kullanıcılar içindir.' });
  }
  next();
};
