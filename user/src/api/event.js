import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/events`; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});


api.interceptors.request.use(
  (config) => {
    
    if (config.method !== 'get') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        response: {
          data: { message: 'Network error. Please check your connection.' }
        }
      });
    }

  
    if (error.response?.status === 401) {
     
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        
      }
    }

    return Promise.reject(error);
  }
);

export const eventApi = {

  getAllEvents: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error.response?.data || { message: 'Failed to fetch events' };
    }
  },

  
  getEventById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error.response?.data || { message: `Failed to fetch event ${id}` };
    }
  }
};
