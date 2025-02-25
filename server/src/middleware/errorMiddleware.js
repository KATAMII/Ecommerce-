import { logger } from '../utils/logger.js';
import { constants } from '../utils/constants.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: constants.AUTH_REQUIRED });
  }

  return res.status(500).json({ message: constants.SERVER_ERROR });
};
