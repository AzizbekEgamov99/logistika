import { User } from './types';

// Extend window object to add our custom property
declare global {
  interface Window {
    __tokenRefreshInterval?: NodeJS.Timeout;
  }
}

// Debug log for session tracking
const debug = (message: string, ...params: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH] ${message}`, ...params);
  }
};

// Session duration in milliseconds (3 days)
const SESSION_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

// Parse JWT token to get user data
export const parseToken = (token: string): { user: User | null; exp: number | null } => {
  try {
    // JWT token format: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    return {
      user: payload.user || null,
      exp: payload.exp || null,
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return { user: null, exp: null };
  }
};

// Check if token is expired, using our custom expiration if available
export const isTokenExpired = (): boolean => {
  // First check our custom expiration time from localStorage
  if (typeof window !== 'undefined') {
    const customExpiry = localStorage.getItem('token_expires');
    if (customExpiry) {
      // Compare with current time
      try {
        const expiryTime = parseInt(customExpiry, 10);
        const now = Date.now();
        const isExpired = now >= expiryTime;
        
        // Log token status
        if (isExpired) {
          debug('Token expired', { 
            expiryTime: new Date(expiryTime).toLocaleString(),
            now: new Date(now).toLocaleString(),
            timeLeft: 'Expired'
          });
        } else {
          const timeLeft = Math.floor((expiryTime - now) / (60 * 1000)); // minutes
          debug('Token valid', { 
            expiryTime: new Date(expiryTime).toLocaleString(),
            now: new Date(now).toLocaleString(),
            timeLeft: `${timeLeft} minutes`
          });
        }
        
        return isExpired;
      } catch (e) {
        console.error('Error parsing token expiry:', e);
      }
    }
  }
  
  // IMPORTANT: Always prioritize our custom expiration over JWT
  // Ignore JWT expiration as we're managing it ourselves
  return false;
};

// Function to refresh token expiration time - call this periodically
export const refreshTokenExpiration = (): void => {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    // Reset expiration to 3 days from now
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + SESSION_DURATION); // 3 days
    
    const expiryTime = expiresAt.getTime().toString();
    localStorage.setItem('token_expires', expiryTime);
    
    // Update cookie
    document.cookie = `auth-token=${token}; path=/; max-age=${SESSION_DURATION / 1000}; SameSite=Lax`;
    
    // Set additional backup to prevent sudden logouts
    sessionStorage.setItem('last_activity', Date.now().toString());
    
    debug('Token refreshed', {
      newExpiry: new Date(parseInt(expiryTime)).toLocaleString(),
      maxAge: `${SESSION_DURATION / (1000 * 60 * 60)} hours`
    });
  } catch (e) {
    console.error('Error refreshing token:', e);
  }
};

// Auto refresh token when browser tab becomes active or user returns
export const setupTokenRefresh = (): void => {
  if (typeof window === 'undefined') return;
  
  debug('Setting up token refresh system');
  
  // Create a common event handler
  const handleUserActivity = () => {
    const now = Date.now();
    const lastActivity = parseInt(sessionStorage.getItem('last_activity') || '0');
    
    // Only refresh if at least 5 minutes have passed since last refresh
    // This prevents excessive refreshing
    if (now - lastActivity > 5 * 60 * 1000) {
      debug('Refreshing token due to user activity');
      refreshTokenExpiration();
    }
  };
  
  // Refresh token on visibility change (when user returns to the app)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      debug('Document became visible, refreshing token');
      refreshTokenExpiration();
    }
  });
  
  // Refresh token on app focus
  window.addEventListener('focus', () => {
    debug('Window focused, refreshing token');
    refreshTokenExpiration();
  });
  
  // Setup activity monitoring
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(eventName => {
    document.addEventListener(eventName, handleUserActivity, { passive: true });
  });
  
  // Also refresh periodically (every 15 minutes)
  const refreshInterval = setInterval(() => {
    debug('Periodic token refresh (15-minute interval)');
    refreshTokenExpiration();
  }, 15 * 60 * 1000);
  
  // Initial refresh
  refreshTokenExpiration();
  
  // Store the interval ID so it can be cleaned up if needed
  window.__tokenRefreshInterval = refreshInterval;
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (token) {
    // Check if we should refresh based on last activity
    const lastActivity = parseInt(sessionStorage.getItem('last_activity') || '0');
    const now = Date.now();
    
    // If more than 5 minutes have passed since last refresh
    if (now - lastActivity > 5 * 60 * 1000) {
      debug('Token accessed, refreshing expiration');
      refreshTokenExpiration();
    }
    
    return token;
  }
  return null;
};

// Get token from cookie (fallback)
export const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('auth-token=')) {
      const token = cookie.substring('auth-token='.length, cookie.length);
      debug('Retrieved token from cookie');
      return token;
    }
  }
  return null;
};

// Save token to both localStorage and cookie
export const saveToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('token', token);
  
  // Set custom expiry
  const expiresAt = new Date();
  expiresAt.setTime(expiresAt.getTime() + SESSION_DURATION);
  localStorage.setItem('token_expires', expiresAt.getTime().toString());
  
  // Set cookie with extended lifetime
  document.cookie = `auth-token=${token}; path=/; max-age=${SESSION_DURATION / 1000}; SameSite=Lax`;
  
  // Set backup activity tracker
  sessionStorage.setItem('last_activity', Date.now().toString());
  
  debug('Token saved with expiry', {
    expires: expiresAt.toLocaleString(),
    duration: `${SESSION_DURATION / (1000 * 60 * 60)} hours`
  });
};

// Remove token from both localStorage and cookie
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('token_expires');
  sessionStorage.removeItem('last_activity');
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Clear any refresh intervals
  if (window.__tokenRefreshInterval) {
    clearInterval(window.__tokenRefreshInterval);
  }
  
  debug('Token removed and sessions cleared');
}; 