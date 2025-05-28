import express from 'express';
import { createBranch, getAllBranches } from '../controllers/branch.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createBranch);
router.get('/', authenticateToken, getAllBranches);

export default router;
