import { logger } from '../utils/logger.js';

export const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ message: 'Product description is required' });
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  if (!category || category.trim().length === 0) {
    return res.status(400).json({ message: 'Product category is required' });
  }

  logger.info('Product validation passed');
  next();
};
