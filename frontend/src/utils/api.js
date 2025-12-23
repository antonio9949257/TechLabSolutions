// frontend/src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
console.log('API_BASE_URL:', API_BASE_URL);

// Fetch for public endpoints (no auth token needed)
export const publicFetch = async (endpoint, options = {}) => {
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Add this line
  });

  return response;
};


export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    // 'Content-Type': 'application/json', // REMOVE THIS LINE
    ...options.headers,
  };

  // Conditionally add Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Add this line
  });

  return response;
};
