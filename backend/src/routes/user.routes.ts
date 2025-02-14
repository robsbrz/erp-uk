import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.use(authMiddleware);

// Add user routes here

export default router;
