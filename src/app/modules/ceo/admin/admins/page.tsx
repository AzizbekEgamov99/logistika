"use client"

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import with loading state
const AdminsAdmin = dynamic(
  () => import("../../../../../modules/ceo/pages/Admin/Admins"),
  { 
    loading: () => <div className="loading-state">Yuklanmoqda...</div>,
    ssr: false 
  }
);

export default function AdminsAdminPage() {
  return (
    <Suspense fallback={<div className="loading-state">Yuklanmoqda...</div>}>
      <AdminsAdmin />
    </Suspense>
  );
}

// Add global styles
const styles = `
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 18px;
    color: #1890ff;
  }
`;

// @ts-ignore
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
} 