import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: { email: string; password: string; username: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Face Recognition API calls
export const faceAPI = {
  recognize: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  saveSketch: async (sketchData: any) => {
    const response = await api.post('/save-sketch', sketchData);
    return response.data;
  },
};

// Criminal Database API calls
export const criminalAPI = {
  addCriminal: async (criminalData: FormData) => {
    const response = await api.post('/criminals/add', criminalData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getCriminals: async (params?: { search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/criminals/list', { params });
    return response.data;
  },
  
  deleteCriminal: async (id: string) => {
    const response = await api.delete(`/criminals/${id}`);
    return response.data;
  },
};

// User Profile API calls
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },
};

export default api;