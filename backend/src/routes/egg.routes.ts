import { Router } from 'express';
import { EggController } from '../controllers/egg.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new EggController();

router.post('/', authMiddleware, controller.create);
router.get('/flock/:flockId', authMiddleware, controller.getByFlock);
router.get('/', authMiddleware, controller.getByFarm);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

export default router;