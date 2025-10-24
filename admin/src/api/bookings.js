import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
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
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        response: {
          data: { message: 'Network error. Please check your connection.' }
        }
      });
    }
    
    // Handle 401 errors: clear admin token and redirect to login (no refresh flow)
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('admin_token');
      } catch (_) {}
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Booking API methods
export const bookingApi = {
  /**
   * Create a payment intent for booking
{{ ... }}
  createPaymentIntent: async (paymentData) => {
    try {
      if (!paymentData || !paymentData.amount) {
        throw new Error('Payment amount is required');
      }
      
      const response = await api.post('/payments/create-intent', paymentData);
      return response.data;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  },

  /**
   * Confirm payment and create booking
   */
  confirmAndCreateBooking: async (paymentIntentId) => {
    try {
      if (!paymentIntentId) {
        throw new Error('Payment intent ID is required');
      }
      
      const response = await api.post('/payments/confirm', { paymentIntentId });
      return response.data;
    } catch (error) {
      console.error('Confirm and create booking error:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for the current user
   */
  // For admin, this returns all bookings
  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Get my bookings error:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   */
  // Admin cancel
  cancelBooking: async (bookingId) => {
    try {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  /**
   * Get a specific booking by ID
   */
  // Optional: If needed for admin in future
  getBookingById: async (bookingId) => {
    try {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      throw error;
    }
  },
};

export default api;