import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { login, register, getMe } from '../../../src/controllers/authController';
import prisma from '../../../src/utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock prisma
jest.mock('../../../src/utils/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Auth Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      await register(req, res, next);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return error if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
        })
      );
    });

    it('should return error with incorrect credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });
});
