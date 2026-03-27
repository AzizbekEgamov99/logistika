"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Dynamically import pages to reduce initial load time
const Dashboard = dynamic(() => import('./pages/Dashboard'));
const Clients = dynamic(() => import('./pages/Clients'));
const ClientDetail = dynamic(() => import('./pages/Clients/ClientDetail'));
const Drivers = dynamic(() => import('./pages/Drivers'));
const Fleet = dynamic(() => import('./pages/Fleet'));
const Trips = dynamic(() => import('./pages/Trips'));
const Finance = dynamic(() => import('./pages/Finance'));
const ClientAnalytics = dynamic(() => import('./pages/Clients/components/ClientAnalytics'));

const CEOModule: React.FC = () => {
  const pathname = usePathname();
  const pathParts = pathname?.split('/') || [];
  const lastPart = pathParts.pop() || '';
  const secondLastPart = pathParts.pop() || '';

  // Render appropriate component based on the route
  const renderComponent = () => {
    // Handle client detail pages where URL is /modules/ceo/clients/{id}
    if (secondLastPart === 'clients' && /^\d+$/.test(lastPart)) {
      return <ClientDetail />;
    }
    
    // Other routes
    if (lastPart === 'ceo' || lastPart === '') {
      return <Dashboard />;
    }
    
    if (lastPart === 'clients') {
      return <Clients />;
    }
    
    if (lastPart === 'drivers') {
      return <Drivers />;
    }
    
    if (lastPart === 'fleet') {
      return <Fleet />;
    }
    
    if (lastPart === 'trips') {
      return <Trips />;
    }
    
    if (lastPart === 'finance') {
      return <Finance />;
    }
    
    return <Dashboard />;
  };

  return renderComponent();
};

export default CEOModule; 