import { Router } from 'express';
import { authController } from '../controllers'

const router = Router();

router.post('/register', authController.registerUser); 
router.post('/login', authController.loginUser); 

export default router;