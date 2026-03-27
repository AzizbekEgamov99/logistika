'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // If roles are specified and user doesn't have required role
    if (allowedRoles.length > 0 && (!user?.status || !allowedRoles.includes(user.status))) {
      // Redirect based on user role
      switch(user?.status) {
        case 'ceo':
          router.push('/modules/ceo');
          break;
        case 'bugalter':
          router.push('/modules/accounting');
          break;
        case 'driver':
          router.push('/modules/driver');
          break;
        default:
          // If role is not recognized, redirect to login
          router.push('/auth/login');
      }
    }
  }, [isAuthenticated, user, router, allowedRoles]);
  
  // Show loading spinner while checking authentication
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Authenticating...</span>
        </div>
      </div>
    );
  }
  
  // If roles are specified and user doesn't have required role, show loading
  if (allowedRoles.length > 0 && (!user?.status || !allowedRoles.includes(user.status))) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Redirecting...</span>
        </div>
      </div>
    );
  }
  
  // If authentication and authorization checks pass, render children
  return <>{children}</>;
} 