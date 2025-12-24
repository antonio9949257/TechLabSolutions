import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  // Fetch initial notifications
  useEffect(() => {
    if (token && user) {
      const fetchNotifications = async () => {
        try {
          const response = await authenticatedFetch('/notifications');
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
          } else {
            console.error('Failed to fetch notifications');
          }
        } catch (err) {
          console.error('Network error fetching notifications:', err);
        }
      };
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token, user]);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket && user) {
      socket.on('notifications', (newNotifications) => {
        // This event is for initial unread notifications on login
        // We should merge them with existing ones or replace if it's a full list
        setNotifications((prevNotifications) => {
          const existingIds = new Set(prevNotifications.map(n => n._id));
          const filteredNew = newNotifications.filter(n => !existingIds.has(n._id));
          const updatedList = [...filteredNew, ...prevNotifications];
          setUnreadCount(updatedList.filter(n => !n.read).length);
          return updatedList;
        });
      });

      socket.on('newNotification', (newNotification) => {
        // This event is for single new notifications
        setNotifications((prevNotifications) => {
          const updatedList = [newNotification, ...prevNotifications];
          setUnreadCount(updatedList.filter(n => !n.read).length);
          return updatedList;
        });
      });

      return () => {
        socket.off('notifications');
        socket.off('newNotification');
      };
    }
  }, [socket, user]);

  const markAsRead = async (id) => {
    try {
      const response = await authenticatedFetch(`/notifications/${id}/read`, { method: 'PUT' });
      if (response.ok) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = prevNotifications.map((n) =>
            n._id === id ? { ...n, read: true } : n
          );
          setUnreadCount(updatedNotifications.filter(n => !n.read).length);
          return updatedNotifications;
        });
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Network error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await authenticatedFetch('/notifications/read-all', { method: 'PUT' });
      if (response.ok) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = prevNotifications.map((n) => ({ ...n, read: true }));
          setUnreadCount(0);
          return updatedNotifications;
        });
      } else {
        console.error('Failed to mark all notifications as read');
      }
    } catch (err) {
      console.error('Network error marking all notifications as read:', err);
    }
  };

  const toggleTray = () => {
    setIsTrayOpen(!isTrayOpen);
  };

  const closeTray = () => {
    setIsTrayOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isTrayOpen,
        toggleTray,
        closeTray,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
