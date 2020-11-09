import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import checkJwt from '../middlewares/checkJwt';

const router = Router();
// login route
router.post('/login', AuthController.login);

// change password
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
