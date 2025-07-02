import { Router } from 'express';
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  deleteCompletedOrders,
  deleteCancelledOrders
} from '../controllers/order.controller';
import { authenticateToken, isSuperAdmin, isAdmin } from '../middleware/authMiddleware';
import { isWorker } from '../middleware/isWorker';

const router = Router();


// Super admin + admin erişimi
router.get('/', authenticateToken, getAllOrders);

// Worker + admin + super_admin sipariş oluşturabilir
router.post('/', authenticateToken, createOrder);

// Worker dahil herkes güncelleyebilir, ama status yetkisi controller'da kontrol edilecek
router.put('/:orderId', authenticateToken, updateOrder);

// Sadece admin ve super_admin siparişi silebilir (opsiyonel olarak worker da izin alabilir)
router.delete('/:orderId', authenticateToken, deleteOrder);

// Durum güncelleme sadece admin ve super_admin → worker engellenecek
router.put('/status/:orderId', authenticateToken, updateOrderStatus);

// Sadece super admin: hazır siparişleri topluca siler
// Sadece super admin: iptal edilmiş siparişleri topluca siler
router.delete('/cleanup/completed', authenticateToken, isSuperAdmin, deleteCompletedOrders);
router.delete('/cleanup/cancelled', authenticateToken, isSuperAdmin, deleteCancelledOrders);

export default router;
