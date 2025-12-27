import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PeopleFill } from 'react-bootstrap-icons';
import './FloatingUserListButton.css';

const FloatingUserListButton = ({ onClick }) => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <button onClick={onClick} className="floating-userlist-button">
      <PeopleFill className="w-6 h-6" />
    </button>
  );
};

export default FloatingUserListButton;
