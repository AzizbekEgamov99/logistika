"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CEOIndex() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/modules/ceo/dashboard');
  }, [router]);
  
  return null;
}

export { default as Dashboard } from './Dashboard/Dashboard';
export { default as Finance } from './Finance/Finance';
export { default as Fleet } from './Fleet/Fleet';
export { default as Trips } from './Trips/Trips';
export { default as Drivers } from './Drivers/Drivers';
export { default as Clients } from './Clients/Clients';
// export { default as ClientAnalytics } from './ClientAnalytics/ClientAnalytics'; 