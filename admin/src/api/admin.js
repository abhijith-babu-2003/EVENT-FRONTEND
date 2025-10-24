import axios from 'axios';


const API_URL = `${import.meta.env.VITE_BASE_URL}/admin`;


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(
          `${API_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = response.data;
        localStorage.setItem('admin_token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const loginAdmin = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    console.log('loginAdmin response:', response.data); // Debug
    if (response.data.accessToken) {
      localStorage.setItem('admin_token', response.data.accessToken);
      return {
        admin: response.data.admin || {}, // Ensure admin object is included
        accessToken: response.data.accessToken,
      };
    }
    throw new Error('No access token received');
  } catch (error) {
    console.error('loginAdmin error:', error); // Debug
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

const logoutAdmin = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    localStorage.removeItem('admin_token');
  }
};

const checkAuth = () => {
  const token = localStorage.getItem('admin_token');
  return !!token;
};

const getCurrentAdmin = async () => {
  try {
    const response = await api.get('/me');
    console.log('getCurrentAdmin response:', response.data); // Debug
    return response.data;
  } catch (error) {
    console.error('getCurrentAdmin error:', error); // Debug
    throw new Error(error.response?.data?.message || 'Failed to get admin info');
  }
};

export const adminApi = {
  loginAdmin,
  logoutAdmin,
  checkAuth,
  getCurrentAdmin,
};