import express from 'express';
import { authController } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;
