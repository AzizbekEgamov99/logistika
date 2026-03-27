"use client";

import React from 'react';
import VehicleHistoryPage from '../../../../../../modules/ceo/pages/Fleet/components/vehicleHistoryPageOptimized';

export default function CarHistoryPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <VehicleHistoryPage id={id} />;
}
