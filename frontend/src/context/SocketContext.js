import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (token && user) {
      // Connect to Socket.IO server with auth token
      socketRef.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
        auth: {
          token: token,
        },
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to Socket.IO server');
        // Emit userOnline event with userId
        socketRef.current.emit('userOnline', user._id);
      });

      socketRef.current.on('updateUserStatus', ({ userId, status }) => {
        console.log(`User ${userId} is ${status}`);
        setOnlineUsers((prevOnlineUsers) => {
          if (status === 'online') {
            return [...new Set([...prevOnlineUsers, userId])]; // Add if not already present
          } else {
            return prevOnlineUsers.filter((id) => id !== userId); // Remove if present
          }
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
        setOnlineUsers([]); // Clear online users on disconnect
      });

      // Clean up on component unmount or token/user change
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else {
      // Disconnect if no token or user
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setOnlineUsers([]);
    }
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ onlineUsers, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
