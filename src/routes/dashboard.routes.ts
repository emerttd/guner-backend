import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { authenticateToken, isSuperAdmin } from '../middleware/authMiddleware';

const router = Router();
router.get('/summary', authenticateToken, isSuperAdmin, getDashboardSummary);

export default router;
