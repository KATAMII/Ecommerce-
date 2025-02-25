import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

export const loadEnv = () => {
  const result = dotenv.config();
  
  if (result.error) {
    logger.error('Error loading .env file:', result.error);
    process.exit(1);
  }

  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      logger.error(`Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }
};
