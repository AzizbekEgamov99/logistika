import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginCredentials, User } from './types';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
        prepareHeaders: (headers) => {
            // Backend JSON parser ishlashi uchun Content-Type ni aniq yuboramiz.
            headers.set('Content-Type', 'application/json');
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<{ user: User; token: string }, LoginCredentials>({
            query: (credentials) => ({
                url: 'auth/login/',
                method: 'POST',
                // Backend "login" maydonini kutishi mumkin, shuning uchun username bilan birga login ham yuboramiz.
                // Bu serializer odatda extra maydonlarni inobatga olmaydi, shuning uchun xavfsiz.
                body: {
                    username: credentials.username,
                    login: credentials.username,
                    password: credentials.password,
                },
            }),
            transformResponse: (response: any) => {
                const { access, user } = response;
                return {
                    token: access,
                    user: {
                        ...user,
                        // Ensure the status is in the expected format
                        status: user.status.toLowerCase()
                    }
                };
            }
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => 'auth/me/',
        }),
    })
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;