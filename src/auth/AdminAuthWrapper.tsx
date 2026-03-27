'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === '/auth/login') {
      router.push('/admin/dashboard');
    }

    // If authenticated but not an admin, redirect to home
    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router, user?.role]);

  // Show nothing while checking authentication
  if (!isAuthenticated && pathname !== '/auth/login') {
    return null;
  }

  return <>{children}</>;
} 