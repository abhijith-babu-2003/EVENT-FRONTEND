import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/payments`; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});


// Request interceptor to add auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error?.response?.status === 401) {
      console.warn('Authentication failed, redirecting to login');
      localStorage.removeItem('token');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        const redirectPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(redirectPath)}`;
      }
    }
    
    // Log error details for debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        request: originalRequest
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error.response?.data || error.message || 'An error occurred');
  }
);

export const paymentApi = {
  createIntent: async ({ amount, currency = 'inr', metadata = {} }) => {
    const res = await api.post('/create-intent', { amount, currency, metadata });
    return res.data; 
  },
  confirmBooking: async (paymentIntentId) => {
    const res = await api.post('/confirm', { paymentIntentId });
    return res.data; 
  },

  getMyBookings: async () => {
    const res = await api.get('/my-bookings');
    return res.data; 
  },

  cancelBooking: async (bookingId) => {
    if (!bookingId) throw new Error('Booking ID is required');
    const res = await api.patch(`/${bookingId}/cancel`);
    return res.data; 
  },
};
