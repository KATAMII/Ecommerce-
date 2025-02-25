import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth.jsx';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return { socket };
};
