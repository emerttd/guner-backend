import { Router } from 'express';
import { createAdmin, getAllUsers, deleteUser } from '../controllers/user.controller';
import { authenticateToken, isSuperAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, isSuperAdmin, getAllUsers);
router.post('/', authenticateToken, isSuperAdmin, createAdmin);
router.delete('/:userId', authenticateToken, isSuperAdmin, deleteUser);

export default router;
