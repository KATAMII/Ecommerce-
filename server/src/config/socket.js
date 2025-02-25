import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
