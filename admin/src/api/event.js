import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
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
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        response: {
          data: { message: 'Network error. Please check your connection.' },
        },
      });
    }

    // Handle unauthorized: clear admin token and redirect
    if (error.response?.status === 401) {
      try { localStorage.removeItem('admin_token'); } catch (_) {}
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const createEventFormData = (eventData) => {
  const formData = new FormData();

  formData.append('eventName', eventData.eventName || '');
  formData.append('artistName', eventData.artistName || '');
  formData.append('date', eventData.date || '');
  formData.append('time', eventData.time || '');
  formData.append('budget', eventData.budget ? eventData.budget.toString() : '0');
  formData.append('location', eventData.location || ''); 
 
  if (eventData.seats && Array.isArray(eventData.seats)) {
    formData.append('seats', JSON.stringify(eventData.seats));
  }
  
  
  if (eventData.image && eventData.image instanceof File) {
    formData.append('image', eventData.image);
  }
  
  return formData;
};

export const eventApi = {

  getAllEvents: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Get all events error:', error);
      throw error;
    }
  },

  
  getEventById: async (id) => {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get event by ID error:', error);
      throw error;
    }
  },

 
  createEvent: async (eventData) => {
    try {
      if (!eventData) {
        throw new Error('Event data is required');
      }
      
      const formData = createEventFormData(eventData);
      const response = await api.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }
      if (!eventData) {
        throw new Error('Event data is required');
      }
      
      const formData = createEventFormData(eventData);
      const response = await api.put(`/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  },


  updateEventStatus: async (id, status) => {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }
      if (!status) {
        throw new Error('Status is required');
      }
      
      const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }
      
      const response = await api.patch(`/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update event status error:', error);
      throw error;
    }
  },

  // Get events by date range
  getEventsByDateRange: async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }
      
      const response = await api.get(`/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Get events by date range error:', error);
      throw error;
    }
  }
};