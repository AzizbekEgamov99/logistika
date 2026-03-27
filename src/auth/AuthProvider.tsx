'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { getToken, getTokenFromCookie, setupTokenRefresh, refreshTokenExpiration, isTokenExpired } from './authUtils';
import { setUser, logout } from './authSlice';
import axiosInstance from '@/api/axiosInstance';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Debug log for auth events
  const debug = (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AuthProvider] ${message}`);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      debug('Initializing authentication');
      
      // Try to get token from localStorage first, then from cookie
      const token = getToken() || getTokenFromCookie();
      
      if (!token) {
        debug('No token found');
        setLoading(false);
        return;
      }
      
      try {
        // Always refresh token expiration on app start
        refreshTokenExpiration();
        
        // Fetch current user info
        debug('Fetching user data');
        const response = await axiosInstance.get('/auth/me/');
        
        if (response.data) {
          debug('User data retrieved successfully');
          // Set user in Redux store
          dispatch(setUser({
            user: response.data,
            token
          }));
          
          // Initialize token refresh system to keep sessions alive
          setupTokenRefresh();
        }
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error('Error fetching user data:', error);
        }
        
        // Handle authentication errors (401)
        if (error.response?.status === 401) {
          debug('Authentication failed (401), logging out');
          dispatch(logout());
          
          // Clear credentials for extra safety
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('token_expires');
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        } else {
          debug('Non-auth error occurred during init');
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    
    // Setup periodic health checks
    const healthCheck = () => {
      debug('Running auth health check');
      
      const token = getToken();
      if (!token) return;
      
      if (!isTokenExpired()) {
        debug('Token valid, refreshing expiration');
        refreshTokenExpiration();
      }
      
      // Periodically validate with backend (once every 2 hours)
      // Note: We use Math.random() to stagger requests across clients
      if (Math.random() < 0.1) { // 10% chance each time, to avoid every client hitting at once
        axiosInstance.get('/auth/me/')
          .then(() => debug('Backend validation successful'))
          .catch(error => {
            debug(`Backend validation error: ${error.message}`);
            // Only logout for definite token errors
            if (error.response?.status === 401 && 
                (error.response?.data?.code === 'token_not_valid' || 
                 error.response?.data?.detail?.includes('token not valid'))) {
              dispatch(logout());
            }
          });
      }
    };
    
    // Run health check every 15 minutes
    const healthCheckInterval = setInterval(healthCheck, 15 * 60 * 1000);
    
    // Also run health check when tab becomes visible
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        debug('Document became visible, running health check');
        healthCheck();
      }
    };
    
    document.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      clearInterval(healthCheckInterval);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Tizimga kirish...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 