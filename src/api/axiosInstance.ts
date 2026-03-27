import axios from "axios";
import { getToken, removeToken, refreshTokenExpiration } from "@/auth/authUtils";

export const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

export const formatImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    
    const base = baseURL.endsWith('/') ? baseURL : baseURL + '/';

    if (url.startsWith('http')) {
        // If it's a full URL with 127.0.0.1 or localhost, 
        // replace the local part with the correct baseURL
        if (url.includes('127.0.0.1') || url.includes('localhost')) {
            // Regex to match protocol://host:port/ or protocol://host/
            const localRegex = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//;
            if (localRegex.test(url)) {
                return url.replace(localRegex, base);
            }
        }
        return url;
    }
    
    return `${base}${url.startsWith('/') ? url.substring(1) : url}`;
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor to add token to each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;

            // Refresh token expiration whenever a request is made
            refreshTokenExpiration();
        }

    // FormData bilan ishlaganda Content-Type ni majburan qo'ymaymiz,
    // aks holda boundary'lar buziladi va backend faylni qabul qilolmaydi.
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete (config.headers as any)['Content-Type'];
        delete (config.headers as any)['content-type'];
      }
    }

    if (process.env.NODE_ENV === 'development') {
            console.log('Request:', config.method?.toUpperCase(), config.url);

            if (config.data instanceof FormData) {
                console.log('FormData entries:', [...config.data.entries()].map(e => `${e[0]}: ${typeof e[1] === 'object' ? 'File/Object' : e[1]}`));
            } else {
                console.log('Request data:', config.data);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Response:', response.status, response.data);
        }

        // Refresh token on successful API calls
        refreshTokenExpiration();

        return response;
    },
    (error) => {
        if (process.env.NODE_ENV === 'development') {
            // Don't log 401s as errors since they are handled gracefully
            if (error.response?.status !== 401) {
                console.error('Response Error:', error.response?.status, error.response?.data);
            } else {
                console.warn('Auth Error (401): Session expired or invalid');
            }
        }

        // Important: ONLY redirect to login if the URL is NOT already /auth/login or /login
        // AND the error is a 401 with a token_not_valid message
        if (error.response?.status === 401) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

            // Check if we're not already on a login page
            if (!currentPath.includes('/login') && !currentPath.includes('/auth/login')) {
                const errorData = error.response?.data;
                const shouldRedirect = !errorData || 
                                     Object.keys(errorData).length === 0 ||
                                     errorData.code === 'token_not_valid' ||
                                     errorData.detail === 'Given token not valid for any token type';

                if (shouldRedirect) {
                    console.log('Authentication failed (401), clearing session and redirecting to login');
                    removeToken();

                    const redirectInProgress = sessionStorage.getItem('redirect_in_progress');
                    if (!redirectInProgress) {
                        sessionStorage.setItem('redirect_in_progress', 'true');
                        window.location.href = '/auth/login';

                        setTimeout(() => {
                            sessionStorage.removeItem('redirect_in_progress');
                        }, 5000);
                    }
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
