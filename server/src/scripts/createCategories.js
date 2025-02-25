import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Beauty',
  'Food'
];

async function createCategories() {
  try {
    for (const categoryName of categories) {
      await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      });
      logger.info(`Category created/updated: ${categoryName}`);
    }
    logger.info('All categories created successfully');
  } catch (error) {
    logger.error('Error creating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
