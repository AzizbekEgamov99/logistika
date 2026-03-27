import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './types';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{user: User, token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            // Clear auth token from cookies
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;