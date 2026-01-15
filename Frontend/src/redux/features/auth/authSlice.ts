import { createSlice } from '@reduxjs/toolkit';
import type{ PayloadAction } from '@reduxjs/toolkit';


type UserRole = 'super_admin' | 'organisation_admin' | 'user';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginPayload {
  user: User;
  token: string;
}

const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state: AuthState) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state: AuthState, action: PayloadAction<LoginPayload>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken'); // if separate
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;