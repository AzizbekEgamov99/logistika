import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

const initialState: SettingsState = {
  theme: 'light',
  sidebarCollapsed: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed } = settingsSlice.actions;

export default settingsSlice.reducer;