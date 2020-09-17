import { Router } from 'express';
import { roomsController } from '../controllers'

const router = Router();

router.post('/temporary', roomsController.test);
router.post('/temporary/:room/admin/:admin', roomsController.createTemporaryRoom);

export default router;