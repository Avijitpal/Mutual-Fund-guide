import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Generate an isolated Axios instance configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically injects your saved JWT token into every single outgoing request header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Map endpoint routes out as organized, clean functional objects
export const fundAPI = {
  getAll: (params) => api.get('/funds', { params }),
  seed: () => api.post('/funds/seed'),
  getById: (id) => api.get(`/funds/${id}`),          // <--- Ensure this is present
  getHistory: (id) => api.get(`/funds/${id}/history`)
};

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export default api;