'use client';

import React from 'react';
import OptimizedDashboard from '../../components/layout/OptimizedDashboard';
import dynamic from 'next/dynamic';

// Dynamically import the heavy component
const AdminManagement = dynamic(
  () => import('./components/AdminManagement'),
  { 
    loading: () => <div className="loading-component">Administratorlar yuklanmoqda...</div>,
    ssr: false
  }
);

const Admins: React.FC = () => {
  return (
    <OptimizedDashboard title="Administratorlar boshqaruvi">
      <AdminManagement />
    </OptimizedDashboard>
  );
};

export default Admins; 