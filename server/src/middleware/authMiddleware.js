import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import { constants } from '../utils/constants.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: constants.AUTH_REQUIRED });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: constants.INVALID_TOKEN });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    logger.warn(`Unauthorized admin access attempt by user: ${req.user.id}`);
    return res.status(403).json({ message: constants.ADMIN_ACCESS_REQUIRED });
  }
  next();
};
