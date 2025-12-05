// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); // Store user object

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
  }, [token]);

  const login = (userData) => { // Accept userData object
    setToken(userData.token);
    setUser(userData); // Store the entire user data
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};