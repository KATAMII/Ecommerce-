import express from 'express';
import { PrismaClient } from '@prisma/client';
import { productController } from '../controllers/productController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();
const controller = productController(prisma);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Routes
router.get('/', controller.getAllProducts);

router.post('/', 
  authenticate, 
  authorizeAdmin, 
  upload.single('image'),
  handleMulterError,
  controller.createProduct
);

router.put('/:id', 
  authenticate, 
  authorizeAdmin, 
  upload.single('image'),
  handleMulterError,
  controller.updateProduct
);

router.delete('/:id', 
  authenticate, 
  authorizeAdmin, 
  controller.deleteProduct
);

export default router;
