import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  getAllPredictions: async () => {
    const response = await api.get('/api/admin/predictions');
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  }
};