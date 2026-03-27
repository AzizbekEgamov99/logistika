'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, Button, Spin, Empty, Tabs } from 'antd';
import { 
  RollbackOutlined,
  HistoryOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useVehicleHistory } from '../../../hooks/useVehicleHistory';

// Lazy loaded components for better performance
const VehicleDetails = lazy(() => import('./VehicleDetails'));
const TripsHistory = lazy(() => import('./TripsHistory'));
const MaintenanceRecords = lazy(() => import('./MaintenanceRecords'));

const { TabPane } = Tabs;

interface VehicleHistoryPageProps {
  id?: string;
}

const VehicleHistoryPage = ({ id }: VehicleHistoryPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<'car' | 'furgon'>('car');
  const [activeTab, setActiveTab] = useState('reyslar');

  // CSS styles for maintenance view (must be inlined to work with server components)
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(`
      .carHistoryContainer {
        background-color: #fff;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        margin-top: 16px;
      }
    `));
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Extract vehicle ID from props or URL path on mount
  useEffect(() => {
    if (id) {
      setVehicleId(id);
    } else if (pathname) {
      const urlParts = pathname.split('/');
      const pathId = urlParts[urlParts.length - 2];
      setVehicleId(pathId);
    }
  }, [pathname, id]);

  // Determine vehicle type (car or furgon) based on URL
  useEffect(() => {
    if (pathname?.includes('furgon')) {
      setVehicleType('furgon');
    } else {
      setVehicleType('car');
    }
  }, [pathname]);

  // Fetch vehicle data using custom hook
  const { data, loading, error } = useVehicleHistory(vehicleId, vehicleType);

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout title="Transport tarix" subtitle="Yuklanmoqda...">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error || !data) {
    return (
      <DashboardLayout title="Xatolik" subtitle="Ma'lumot topilmadi">
        <Card>
          <Empty description="Transport ma'lumotlari topilmadi" />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button 
              type="primary" 
              icon={<RollbackOutlined />} 
              onClick={() => router.push('/modules/ceo/fleet')}
            >
              Transportlar sahifasiga qaytish
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  // Destructure the processed data
  const {
    vehicle,
    optol = [],
    bolon = [],
    texnic = [],
    rays_history = [],
    rays_count = 0
  } = data;

  return (
    <DashboardLayout 
      title={vehicleType === 'car' ? 'Avtomobil tarix' : 'Furgon tarix'} 
      subtitle={vehicle?.name || vehicle?.car_number || 'Transport vositasi'}
    >
      <Suspense fallback={<Spin />}>
        <VehicleDetails vehicle={vehicle} />
      </Suspense>
      
      {/* Tabs for content */}
      <div className="carHistoryContainer">
        <Tabs 
          type="card" 
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: '20px' }}
        >
          <TabPane 
            tab={<span><HistoryOutlined /> Reyslar tarixi ({rays_count})</span>}
            key="reyslar"
          >
            <div style={{ padding: '16px 0' }}>
              <Suspense fallback={<Spin />}>
                <TripsHistory trips={rays_history} />
              </Suspense>
            </div>
          </TabPane>
          
          <TabPane 
            tab={<span><ToolOutlined /> Texnik xizmat tarixi</span>}
            key="texnik"
          >
            <Suspense fallback={<Spin />}>
              <MaintenanceRecords
                optol={optol}
                bolon={bolon}
                texnic={texnic}
              />
            </Suspense>
          </TabPane>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VehicleHistoryPage; 