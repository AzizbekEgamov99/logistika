"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the car history page component to avoid warnings in SSR
const CarHistoryPage = dynamic(
  () => import('@/app/modules/accounting/drivers/history/[id]/car-history'),
  { ssr: false }
);

export default function CarHistoryPageWrapper() {
  return <CarHistoryPage />;
} 