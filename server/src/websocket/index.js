import { logger } from '../utils/logger.js';
import jwt from 'jsonwebtoken';

export const setupWebSocket = (io, prisma) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('authenticate', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        connectedUsers.set(socket.id, decoded);
        logger.info(`User authenticated: ${decoded.email}`);
      } catch (error) {
        logger.error('Authentication error:', error);
      }
    });

    socket.on('filter-products', async (filters) => {
      try {
        const { category, minPrice, maxPrice, search } = filters;
        
        const where = {
          AND: [
            category ? { category } : {},
            {
              price: {
                gte: minPrice || 0,
                lte: maxPrice || Number.MAX_SAFE_INTEGER
              }
            },
            search ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            } : {}
          ]
        };

        const products = await prisma.product.findMany({ where });
        socket.emit('filtered-products', products);
        logger.info(`Products filtered for ${socket.id}`, { filters });
      } catch (error) {
        logger.error('Error filtering products:', error);
        socket.emit('error', { message: 'Error filtering products' });
      }
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // Function to broadcast notifications to all connected clients
  const broadcastNotification = (notification) => {
    io.emit('notification', notification);
    logger.info('Notification broadcast:', notification);
  };

  // Function to send notification to specific user
  const sendNotificationToUser = (userId, notification) => {
    const userSocket = Array.from(connectedUsers.entries())
      .find(([_, user]) => user.id === userId);
    
    if (userSocket) {
      io.to(userSocket[0]).emit('notification', notification);
      logger.info(`Notification sent to user ${userId}:`, notification);
    }
  };

  // Function to notify admins
  const notifyAdmins = (notification) => {
    Array.from(connectedUsers.entries())
      .filter(([_, user]) => user.role === 'ADMIN')
      .forEach(([socketId]) => {
        io.to(socketId).emit('notification', notification);
      });
    logger.info('Admin notification sent:', notification);
  };

  return {
    broadcastNotification,
    sendNotificationToUser,
    notifyAdmins
  };
};
