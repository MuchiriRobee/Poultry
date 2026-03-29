import { Router } from 'express';
import { FarmController } from '../controllers/farm.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new FarmController();

router.post('/', authMiddleware, controller.create);
router.get('/dashboard-stats', authMiddleware, controller.getDashboardStats);
// NEW: Get all farms for the authenticated user
router.get('/', authMiddleware, controller.getUserFarms);


export default router;