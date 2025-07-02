// src/controllers/dashboard.controller.ts

import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Branch from '../models/Branch';

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const readyOrders = await Order.countDocuments({ status: 'hazır' });
    const inProgressOrders = await Order.countDocuments({ status: 'hazırlanıyor' });
    const pendingOrders = await Order.countDocuments({ status: 'beklemede' });
    const cancelledOrders = await Order.countDocuments({ status: 'iptal edildi' });

    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const superAdmins = await User.countDocuments({ role: 'super_admin' });

    const totalBranches = await Branch.countDocuments();

    res.status(200).json({
      orders: {
        total: totalOrders,
        ready: readyOrders,
        inProgress: inProgressOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders
      },
      users: {
        total: totalUsers,
        admins,
        superAdmins,
        workers: await User.countDocuments({ role: 'worker' })
      },
      branches: {
        total: totalBranches
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Dashboard verileri alınamadı.', error: err.message });
  }
};