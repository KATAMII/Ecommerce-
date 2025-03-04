import express from 'express';
import multer from 'multer';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import { productController } from '../controllers/productController.js';
import { authController } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../utils/validators.js';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

const products = productController(prisma);
const auth = authController(prisma);

// Auth routes
router.post('/api/auth/register', validateRegistration, auth.register);
router.post('/api/auth/login', validateLogin, auth.login);

// Product routes
router.get('/api/products', products.getAllProducts);
router.post('/api/products', authenticate, authorizeAdmin, upload.single('image'), products.createProduct);
router.put('/api/products/:id', authenticate, authorizeAdmin, upload.single('image'), products.updateProduct);
router.delete('/api/products/:id', authenticate, authorizeAdmin, products.deleteProduct);

export default router;
