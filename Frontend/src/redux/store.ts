import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import orgAuthReducer from './features/orgAuth/orgAuthSlice';
import settingsReducer from './features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orgAuth: orgAuthReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;