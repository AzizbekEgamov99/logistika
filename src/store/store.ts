import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/auth/authSlice';
import { authApi } from '@/auth/authApi';
import settingsReducer from '@/modules/accounting/store/slices/settingsSlice';
import notificationsReducer from '@/modules/accounting/store/slices/notificationsSlice';
import accountingReducer from '@/modules/accounting/store/slices/accountingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        settings: settingsReducer,
        notifications: notificationsReducer,
        accounting: accountingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;