import { SocketController } from '../controllers/socketController.js';

export const setupSocketRoutes = (io) => {
  const socketController = new SocketController(io);

  io.on('connection', (socket) => {
    socketController.handleConnection(socket);
  });
};
