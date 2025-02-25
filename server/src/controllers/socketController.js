import { Product } from '../models/Product.js';
import { logger } from '../utils/logger.js';

export class SocketController {
  constructor(io) {
    this.io = io;
  }

  handleConnection(socket) {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('filter-products', this.handleFilterProducts.bind(this, socket));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  async handleFilterProducts(socket, filters) {
    try {
      const products = await Product.findAll(filters);
      socket.emit('filtered-products', products);
    } catch (error) {
      logger.error('Error filtering products:', error);
      socket.emit('error', { message: 'Error filtering products' });
    }
  }

  handleDisconnect(socket) {
    logger.info(`Client disconnected: ${socket.id}`);
  }
}
