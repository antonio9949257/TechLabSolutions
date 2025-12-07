// frontend/src/utils/api.js
const API_BASE_URL = 'http://localhost:5000/api'; // Base URL para tu API de backend

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
  });

  return response;
};
