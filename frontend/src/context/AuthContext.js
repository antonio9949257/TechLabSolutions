// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); // Store user object
  const [showLoginModal, setShowLoginModal] = useState(false); // State for Login Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State for Register Modal
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // If user object is not set, or token changed, you might want to re-fetch/decode user info
      // For now, we assume user object is set during login
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Clear user data on logout
      setUser(null);
    }
  }, [token, navigate]);

  const login = (userData) => { // Accept userData object
    setToken(userData.token);
    setUser(userData); // Store the entire user data
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const openLoginModal = () => {
    setShowRegisterModal(false); // Close register if open
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false); // Close login if open
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, showLoginModal, closeLoginModal, openLoginModal, showRegisterModal, closeRegisterModal, openRegisterModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};