'use client';

import { Login } from '@/auth/Login';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to appropriate page
    if (isAuthenticated && user) {
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
          break;
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <Login />
  );
} 