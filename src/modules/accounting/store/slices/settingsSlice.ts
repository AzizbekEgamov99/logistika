import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    theme: 'light' | 'dark';
    primaryColor: string;
    layout: 'vertical' | 'horizontal';
    sidebarCollapsed: boolean;
    navbarFixed: boolean;
}

const initialState: SettingsState = {
    theme: 'light',
    primaryColor: '#1890ff',
    layout: 'vertical',
    sidebarCollapsed: false,
    navbarFixed: true,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setPrimaryColor: (state, action: PayloadAction<string>) => {
            state.primaryColor = action.payload;
        },
        setLayout: (state, action: PayloadAction<'vertical' | 'horizontal'>) => {
            state.layout = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        toggleNavbarFixed: (state) => {
            state.navbarFixed = !state.navbarFixed;
        },
    },

});

export const {
    setTheme,
    setPrimaryColor,
    toggleSidebar,
    toggleNavbarFixed
} = settingsSlice.actions;


export default settingsSlice.reducer; 