import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize Socket.io connection
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const fallbackBackendUrl = apiBaseUrl.replace(/\/api\/?$/, '');
    const socketUrl = (import.meta.env.VITE_BACKEND_URL || fallbackBackendUrl).trim();
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Add notification handler
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    // Admin events
    socket.on('payroll:created', (data) => {
      addNotification({
        id: Math.random(),
        type: 'payroll:created',
        title: 'Payroll Generated',
        data,
        timestamp: new Date(),
      });
    });

    socket.on('payroll:updated', (data) => {
      addNotification({
        id: Math.random(),
        type: 'payroll:updated',
        title: 'Payroll Updated',
        data,
        timestamp: new Date(),
      });
    });

    socket.on('payroll:statusUpdated', (data) => {
      addNotification({
        id: Math.random(),
        type: 'payroll:statusUpdated',
        title: 'Payment Status Updated',
        data,
        timestamp: new Date(),
      });
    });

    socket.on('employee:created', (data) => {
      addNotification({
        id: Math.random(),
        type: 'employee:created',
        title: 'New Employee Added',
        data,
        timestamp: new Date(),
      });
    });

    socket.on('employee:updated', (data) => {
      addNotification({
        id: Math.random(),
        type: 'employee:updated',
        title: 'Employee Updated',
        data,
        timestamp: new Date(),
      });
    });

    socket.on('payroll:notified', (data) => {
      addNotification({
        id: Math.random(),
        type: 'payroll:notified',
        title: data.message,
        data,
        timestamp: new Date(),
      });
    });

    return () => {
      socket.off('payroll:created');
      socket.off('payroll:updated');
      socket.off('payroll:statusUpdated');
      socket.off('employee:created');
      socket.off('employee:updated');
      socket.off('payroll:notified');
    };
  }, [socket, addNotification]);

  const value = {
    socket,
    isConnected,
    notifications,
    addNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
