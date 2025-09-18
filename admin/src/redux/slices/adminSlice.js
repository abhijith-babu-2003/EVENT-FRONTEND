import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/admin';

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await adminApi.loginAdmin(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'admin/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (adminApi.checkAuth()) {
        const admin = await adminApi.getCurrentAdmin();
        return { admin, accessToken: localStorage.getItem('token') };
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to initialize auth');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    loginAdminSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('token', action.payload.accessToken);
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthForLogin: (state) => {
      state.isAuthenticated = false; // Allow login page to stay
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.accessToken);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.admin = action.payload.admin;
          state.token = action.payload.accessToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  },
});

export const { loginAdminSuccess, logout, clearError, resetAuthForLogin } = adminSlice.actions;
export const selectAdminAuth = (state) => state.admin.isAuthenticated;
export const selectAdminError = (state) => state.admin.error;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdmin = (state) => state.admin.admin;
export default adminSlice.reducer;