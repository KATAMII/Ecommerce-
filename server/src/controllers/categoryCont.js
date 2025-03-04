import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Create category (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    logger.info(`Category created: ${category.id}`);
    res.status(201).json(category);
  } catch (error) {
    logger.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
});

export default router;
