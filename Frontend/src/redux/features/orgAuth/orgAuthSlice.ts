import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Updated OrgUser interface to match new API response
export interface OrgUser {
  org_user_id: string;
  name: string;
  email: string;
  org_id: string;
  branch_id?: string;
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  access_token?: string;
  refresh_token?: string;
}

interface OrgAuthState {
  user: OrgUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface OrgLoginPayload {
  user: OrgUser;
  token: string;
}

// Helper function to check if user is admin or manager
export const isOrgAdmin = (user: OrgUser | null): boolean => {
  return user?.designation === 'Admin' || user?.designation === 'Manager';
};

// Helper function to check if user is cashier
export const isCashier = (user: OrgUser | null): boolean => {
  return user?.designation === 'Cashier';
};

const token = localStorage.getItem('orgToken');
const storedUser = localStorage.getItem('orgUser');

const initialState: OrgAuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const orgAuthSlice = createSlice({
  name: 'orgAuth',
  initialState,
  reducers: {
    orgLoginStart: (state: OrgAuthState) => {
      state.loading = true;
      state.error = null;
    },
    orgLoginSuccess: (state: OrgAuthState, action: PayloadAction<OrgLoginPayload>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('orgUser', JSON.stringify(action.payload.user));
    },
    orgLoginFailure: (state: OrgAuthState, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    orgLogout: (state: OrgAuthState) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('orgToken');
      localStorage.removeItem('orgUser');
      localStorage.removeItem('orgRefreshToken');
    },
  },
});

export const { orgLoginStart, orgLoginSuccess, orgLoginFailure, orgLogout } = orgAuthSlice.actions;
export default orgAuthSlice.reducer;
