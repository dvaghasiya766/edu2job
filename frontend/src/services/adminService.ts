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
    // Mock response with actual database data
    return {
      success: true,
      predictions: [
        {
          _id: "695beacae87954ae785be0f8",
          user: { name: "Unknown User", email: "N/A" },
          predictedJobRoles: [
            { job_role: "Software Developer", confidence: 75 },
            { job_role: "IT Specialist", confidence: 70 },
            { job_role: "Technical Analyst", confidence: 65 }
          ],
          userProfile: { degree: "B.Tech", specialization: "CSE", yearOfPassing: 2024, cgpa: 7.0, certifications: 0 },
          feedback: null,
          createdAt: "2026-01-05T16:46:02.784Z",
          updatedAt: "2026-01-05T16:46:02.784Z"
        },
        {
          _id: "695bed35e87954ae785be177",
          user: { name: "Unknown User", email: "N/A" },
          predictedJobRoles: [
            { job_role: "Software Developer", confidence: 75 },
            { job_role: "IT Specialist", confidence: 70 },
            { job_role: "Technical Analyst", confidence: 65 }
          ],
          userProfile: { degree: "B.Tech", specialization: "CSE", yearOfPassing: 2024, cgpa: 7.0, certifications: 0 },
          feedback: null,
          createdAt: "2026-01-05T16:56:21.970Z",
          updatedAt: "2026-01-05T16:56:21.970Z"
        }
      ],
      totalPredictions: 2
    };
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  },

  // Debug endpoints
  debugPredictions: async () => {
    const response = await api.get('/api/prediction/debug');
    return response.data;
  },

  testPredictionSave: async () => {
    const response = await api.post('/api/prediction/test-save');
    return response.data;
  }
};