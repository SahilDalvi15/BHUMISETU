import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

let socket = null;

export const useSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user && !socket) {
      socket = io('http://localhost:5000'); // Connect to our Express server

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to Real-Time Engine');
        
        // Join the role-based room immediately so we get role-targeted notifications
        socket.emit('join_role', user.role);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from Real-Time Engine');
      });
    }

    // Cleanup on unmount if needed, though for a global dashboard we might just keep it alive
    return () => {
      if (socket && !user) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user]);

  return { socket, isConnected };
};
