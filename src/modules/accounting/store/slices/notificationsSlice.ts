import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}

interface NotificationsState {
    items: Notification[];
    unreadCount: number;
}

const initialState: NotificationsState = {
    items: [],
    unreadCount: 0,
};

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'createdAt'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                read: false,
                createdAt: new Date().toISOString(),
            };
            state.items.unshift(notification);
            state.unreadCount += 1;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.items.find(item => item.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount -= 1;
            }
        },
        clearAll: (state) => {
            state.items = [];
            state.unreadCount = 0;
        },
    },
});

export const { addNotification, markAsRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer; 