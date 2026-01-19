import axios from 'axios';

let backendURL = import.meta.env.VITE_BACKEND_URL;


console.log("backend url",backendURL);

const api = axios.create({
  baseURL: `${backendURL}/api/v1`, // make sure /api is appended
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get upload URL
export const getUploadUrl = (path: string) => {
  if (!path) return '';
  return `${backendURL}/uploads/${path}`;
};

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In your api.js - update the response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.response?.data?.message,
      });

      // Only redirect for actual authentication failures, not permission issues
      if (error.response?.data?.message?.includes('token') || 
          error.response?.data?.message?.includes('login') ||
          error.response?.data?.message?.includes('Authentication')) {
        
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      // For other 401 errors, let the component handle them
    }

    return Promise.reject(error);
  }
);

export default api;