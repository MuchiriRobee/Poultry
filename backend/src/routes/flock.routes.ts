import { Router } from 'express';
import { FlockController } from '../controllers/flock.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new FlockController();

router.post('/', authMiddleware, controller.create);
router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

export default router;