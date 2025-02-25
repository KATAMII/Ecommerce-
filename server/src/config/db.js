import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
