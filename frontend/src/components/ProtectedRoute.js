// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User authenticated but does not have the required role, redirect to home or an unauthorized page
    return <Navigate to="/" replace />; // Or a specific /unauthorized page
  }

  // User is authenticated and has the required role (if any)
  return <Outlet />;
};

export default ProtectedRoute;
