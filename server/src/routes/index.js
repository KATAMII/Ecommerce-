import multer from 'multer';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { productController } from '../controllers/productController.js';
import { authController } from '../controllers/authController.js';

const upload = multer({ dest: 'uploads/' });

export const configureRoutes = (app, prisma) => {
  const products = productController(prisma);
  const auth = authController(prisma);

  // Auth routes
  app.post('/api/auth/register', auth.register);
  app.post('/api/auth/login', auth.login);

  // Product routes
  app.get('/api/products', products.getAllProducts);
  app.post('/api/products', authenticate, authorizeAdmin, upload.single('image'), products.createProduct);
  app.put('/api/products/:id', authenticate, authorizeAdmin, upload.single('image'), products.updateProduct);
  app.delete('/api/products/:id', authenticate, authorizeAdmin, products.deleteProduct);
};
