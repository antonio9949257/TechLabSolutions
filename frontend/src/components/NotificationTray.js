import React from 'react';
import { XCircle } from 'react-bootstrap-icons';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationTray = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900 backdrop-blur-sm bg-opacity-70 shadow-lg z-notification transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-semibold text-text-primary">Notificaciones</h3>
        <button onClick={onClose} className="text-secondary hover:text-primary">
          <XCircle className="w-7 h-7" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {notifications.length === 0 ? (
          <p className="text-text-primary">No tienes notificaciones.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`mb-4 p-3 rounded-lg ${
                  notification.read ? 'bg-gray-700' : 'bg-blue-900'
                } hover:bg-gray-800 transition-colors duration-200`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold text-text-primary">{notification.message}</p>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-sm text-blue-300 hover:text-blue-100"
                    >
                      Marcar como leída
                    </button>
                  )}
                </div>
                {notification.link && (
                  <Link to={notification.link} onClick={onClose} className="text-blue-400 hover:underline text-sm mt-1 block">
                    Ver detalles
                  </Link>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-4 border-t">
          <button
            onClick={markAllAsRead}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Marcar todas como leídas
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationTray;
