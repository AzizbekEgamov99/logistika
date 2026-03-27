import React from 'react';
import { Card, Empty } from 'antd';

interface VehicleLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface VehicleMapProps {
  vehicles: VehicleLocation[];
  loading?: boolean;
}

const VehicleMap: React.FC<VehicleMapProps> = ({ vehicles, loading = false }) => {
  return (
    <Card 
      title="Transport joylashuvi" 
      className="vehicle-map-card"
      loading={loading}
    >
      {vehicles.length > 0 ? (
        <div className="map-container" style={{ height: '500px', background: '#f0f2f5' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            padding: '20px'
          }}>
            <p>Xarita komponenti bu yerda joylashtiriladi. Haqiqiy ilovada Google Maps, Leaflet yoki boshqa xarita xizmatidan foydalaniladi.</p>
          </div>
        </div>
      ) : (
        <Empty description="Transport joylashuvi ma'lumotlari mavjud emas" />
      )}
    </Card>
  );
};

export default VehicleMap; 