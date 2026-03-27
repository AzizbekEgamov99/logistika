'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Spin } from 'antd';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect based on user role
    if (user) {
      switch (user.status.toLowerCase()) {
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
  }, [isAuthenticated, user, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Spin size="large" />
        <span style={{ color: '#666' }}>Yo'naltirilmoqda...</span>
      </div>
    </div>
  );
}