import React from 'react';
import { Card } from 'antd';
import { PopularRoutesTable } from '../../../components/tables/PopularRoutesTable';
import { TripData } from '../types';

interface PopularRoutesProps {
  trips: TripData[];
  loading: boolean;
}

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ trips, loading }) => {
  // Calculate popular routes from trips data
  const getPopularRoutes = () => {
    if (!trips || trips.length === 0) {
      return [];
    }
    
    const routeMap = {};
    
    trips.forEach(trip => {
      const from = trip.startLocation || 'Unknown';
      const to = trip.endLocation || 'Unknown';
      const routeKey = `${from}-${to}`;
      
      if (!routeMap[routeKey]) {
        routeMap[routeKey] = {
          from,
          to,
          count: 0,
          revenue: 0
        };
      }
      
      routeMap[routeKey].count += 1;
      routeMap[routeKey].revenue += (trip.price || 0);
    });
    
    return Object.values(routeMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <Card 
      className="section-card" 
      title="Mashhur yo'nalishlar" 
      style={{ marginTop: 16 }}
    >
      <PopularRoutesTable 
        data={getPopularRoutes()} 
        loading={loading} 
      />
    </Card>
  );
}; 