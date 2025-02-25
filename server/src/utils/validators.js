import { body, validationResult } from 'express-validator';
import { constants } from './constants.js';

export const validateRegistration = [
  body('email').isEmail().withMessage(constants.INVALID_EMAIL),
  body('password').isLength({ min: 6 }).withMessage(constants.PASSWORD_LENGTH),
  body('name').notEmpty().withMessage(constants.NAME_REQUIRED),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().withMessage(constants.INVALID_EMAIL),
  body('password').notEmpty().withMessage(constants.PASSWORD_REQUIRED),
  handleValidationErrors
];

export const validateProduct = [
  body('name').notEmpty().withMessage(constants.PRODUCT_NAME_REQUIRED),
  body('price').isFloat({ min: 0 }).withMessage(constants.INVALID_PRICE),
  body('category').notEmpty().withMessage(constants.CATEGORY_REQUIRED),
  handleValidationErrors
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
