import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        response: { data: { message: 'Network error. Please check your connection.' } },
      });
    }

    if (error.response?.status === 401) {
      try { localStorage.removeItem('token'); } catch (_) {}
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const bookingApi = {
  createPaymentIntent: async (paymentData) => {
    if (!paymentData || !paymentData.amount) throw new Error('Payment amount is required');
    const response = await api.post('/payments/create-intent', paymentData);
    return response.data;
  },

  confirmAndCreateBooking: async (paymentIntentId) => {
    if (!paymentIntentId) throw new Error('Payment intent ID is required');
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      console.error('Error in getMyBookings:', error);
      throw error;
    }
  },

  cancelBooking: async (bookingId) => {
    if (!bookingId) throw new Error('Booking ID is required');
    const response = await api.patch(`/payments/${bookingId}/cancel`);
    return response.data;
  },

  getBookingById: async (bookingId) => {
    if (!bookingId) throw new Error('Booking ID is required');
    const response = await api.get(`/payments/${bookingId}`);
    return response.data;
  },
};

export default api;
