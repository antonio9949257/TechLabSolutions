import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { authenticatedFetch } from '../utils/api';
import { XCircle } from 'react-bootstrap-icons';
import { useSocket } from '../context/SocketContext'; // Import useSocket

const UserListSidebar = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const { onlineUsers } = useSocket(); // Get onlineUsers from SocketContext

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await authenticatedFetch('/users');
          const data = await response.json();
          if (response.ok) {
            setUsers(data);
          } else {
            setError(data.message || 'Failed to fetch users');
          }
        } catch (err) {
          setError('Network error');
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  const handleUserClick = (userId) => {
    onClose(); // Close the sidebar
    navigate(`/users/${userId}`); // Navigate to the user's profile
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 backdrop-blur-sm bg-opacity-70 shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-semibold text-text-primary">Users</h3>
        <button onClick={onClose} className="text-secondary hover:text-primary">
          <XCircle className="w-7 h-7" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <li
                key={user._id}
                className="flex items-center mb-4 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                onClick={() => handleUserClick(user._id)}
              >
                <img
                  src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-bold text-text-primary">{user.name}</p>
                  <div className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    <p className={`text-sm ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserListSidebar;
