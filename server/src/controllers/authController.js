import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authController = (prisma) => ({
  async register(req, res) {
    try {
      const { email, password, name, role } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || 'USER'
        }
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      logger.info(`User registered: ${user.id}`);
      res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      logger.info(`User logged in: ${user.id}`);
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  }
});
