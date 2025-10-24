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

// Attach Authorization header from localStorage token if present
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

// Redirect to login on 401 and clear token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      try { window.location.href = '/login'; } catch (_) {}
    }
    return Promise.reject(error?.response?.data || error);
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
