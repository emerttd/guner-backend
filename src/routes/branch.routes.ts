import { Router } from 'express';
import {
  createBranch,
  deleteBranch,
  updateBranch,
  getAllBranches,
} from '../controllers/branch.controller';
import { authenticateToken, isSuperAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, isSuperAdmin, createBranch);
router.delete('/:branchId', authenticateToken, isSuperAdmin, deleteBranch);
router.put('/:branchId', authenticateToken, isSuperAdmin, updateBranch);
router.get('/', authenticateToken, getAllBranches);

export default router;
