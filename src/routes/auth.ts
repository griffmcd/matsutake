import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import checkJwt from '../middlewares/checkJwt';

const router = Router();
// login user - POST /api/auth/login
router.post('/login', AuthController.login);

// change password - POST /api/auth/change-password
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
