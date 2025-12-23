import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');

    console.log('AuthCallback: token from URL', token);
    console.log('AuthCallback: userId from URL', userId);

    if (token && userId) {
      // Temporarily store token to make authenticated fetch
      localStorage.setItem('token', token);

      const fetchUserProfile = async () => {
        try {
          const response = await authenticatedFetch('/profile/me'); // Fetch full profile
          if (response.ok) {
            const userData = await response.json();
            console.log('AuthCallback: Fetched user data', userData);
            login({ ...userData, token }); // Login with full user data and token
            console.log('AuthCallback: Login function called');
            navigate('/'); // Redirect to home page after successful login
          } else {
            const errorData = await response.json();
            console.error('AuthCallback: Error fetching user profile:', errorData.message);
            navigate('/login'); // Redirect to login on error
          }
        } catch (error) {
          console.error('AuthCallback: Network error fetching user profile:', error);
          navigate('/login'); // Redirect to login on network error
        }
      };

      fetchUserProfile();

    } else {
      console.error('AuthCallback: Token or userId missing from callback');
      navigate('/login'); // Redirect to login if data is missing
    }
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;
