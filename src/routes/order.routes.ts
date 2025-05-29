import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  updateOrder,
  getAllOrders,
  updateOrderStatus,
  deleteCompletedOrders,
} from '../controllers/order.controller';
import {
  authenticateToken,
  isSuperAdmin,
  isAdminOrSuperAdmin,
} from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, isSuperAdmin, createOrder);
router.delete('/:orderId', authenticateToken, isSuperAdmin, deleteOrder);
router.delete('/cleanup/completed', authenticateToken, isSuperAdmin, deleteCompletedOrders);
router.put('/:orderId', authenticateToken, isSuperAdmin, updateOrder);
router.get('/', authenticateToken, isAdminOrSuperAdmin, getAllOrders);
router.patch('/:orderId/status', authenticateToken, isAdminOrSuperAdmin, updateOrderStatus);

export default router;
