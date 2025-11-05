import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketOptions {
  path?: string;
}

export const useSocket = (options: SocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const socketInstance = io({
      path: options.path || '/api/socketio',
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [options.path]);

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
  };
};