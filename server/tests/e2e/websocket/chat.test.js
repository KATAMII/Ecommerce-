import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { io as Client } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupWebSocket } from '../../../src/websocket';
import prisma from '../../../src/utils/prisma';

describe('WebSocket Chat Tests', () => {
  let io;
  let serverSocket;
  let clientSocket;
  let httpServer;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    setupWebSocket(io, prisma);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    httpServer.close();
  });

  it('should receive message acknowledgment', (done) => {
    const testMessage = {
      content: 'Hello World',
      userId: '123',
      roomId: '456'
    };

    clientSocket.emit('sendMessage', testMessage, (response) => {
      expect(response.status).toBe('success');
      done();
    });
  });

  it('should broadcast message to room', (done) => {
    const testMessage = {
      content: 'Hello Room',
      userId: '123',
      roomId: '456'
    };

    clientSocket.on('newMessage', (message) => {
      expect(message.content).toBe(testMessage.content);
      done();
    });

    clientSocket.emit('joinRoom', testMessage.roomId, () => {
      clientSocket.emit('sendMessage', testMessage);
    });
  });

  it('should handle user typing events', (done) => {
    const roomId = '456';

    clientSocket.on('userTyping', (data) => {
      expect(data.userId).toBe('123');
      expect(data.roomId).toBe(roomId);
      done();
    });

    clientSocket.emit('typing', { userId: '123', roomId });
  });
});
