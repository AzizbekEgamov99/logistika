"use client"

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Trips component with no SSR
const TripsPage = dynamic(
  () => import('../../../../modules/ceo/pages/Trips'),
  { ssr: false }
);

export default function Trips() {
  return <TripsPage />;
} 