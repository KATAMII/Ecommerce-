import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const productController = (prisma) => ({
  async getAllProducts(req, res) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      });
      res.json(products);
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  },

  async createProduct(req, res) {
    try {
      const { name, description, price, categoryId } = req.body;
      if (!name || !description || !price || !categoryId) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      let imageUrl = null;
      if (req.file) {
        try {
          imageUrl = await uploadToCloudinary(req.file);
        } finally {
          await fs.unlink(req.file.path); // Ensure file is deleted after upload attempt
        }
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          category: { 
            connect: { id: categoryId } 
          },
          imageUrl,
          user: {
            connect: { id: req.user.id }
          }
        },
        include: {
          category: true,
          user: true
        }
      });

      logger.info(`Product created: ${product.name} by user: ${req.user.id}`);
      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId } = req.body;

      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      let imageUrl = existingProduct.imageUrl;
      if (req.file) {
        try {
          imageUrl = await uploadToCloudinary(req.file);
        } finally {
          await fs.unlink(req.file.path);
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price ? parseFloat(price) : existingProduct.price,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          imageUrl,
          updatedAt: new Date()
        },
        include: { category: true }
      });

      logger.info(`Product updated: ${product.name} by user: ${req.user.id}`);
      res.json(product);
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.imageUrl) {
        const publicIdMatch = product.imageUrl.match(/\/([^/]+)\.\w+$/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      await prisma.product.delete({ where: { id } });

      logger.info(`Product deleted: ${id} by user: ${req.user.id}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  }
});
