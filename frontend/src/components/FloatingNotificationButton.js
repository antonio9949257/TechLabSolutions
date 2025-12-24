import React from 'react';
import { BellFill } from 'react-bootstrap-icons';
import { useNotifications } from '../context/NotificationContext';
import './FloatingNotificationButton.css';

const FloatingNotificationButton = () => {
  const { unreadCount, toggleTray } = useNotifications();

  return (
    <button onClick={toggleTray} className="floating-notification-button">
      <BellFill className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="notification-count">{unreadCount}</span>
      )}
    </button>
  );
};

export default FloatingNotificationButton;
