import { createSlice } from '@reduxjs/toolkit';
import type{ PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';
export type Language = 'en' | 'ar';

interface SettingsState {
  theme: ThemeMode;
  language: Language;
}

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme) return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialLang = (): Language => {
  return (localStorage.getItem('language') as Language) || 'en';
};

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: getInitialLang(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      document.documentElement.dir = action.payload === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = action.payload;
      localStorage.setItem('language', action.payload);
    },
  },
});

export const { toggleTheme, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;