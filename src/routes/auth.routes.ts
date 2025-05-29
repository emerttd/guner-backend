import { Router } from 'express';
import { register, login, getAllUsers } from '../controllers/auth.controller';
import { authenticateToken, isSuperAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', authenticateToken, isSuperAdmin, getAllUsers);

export default router;
