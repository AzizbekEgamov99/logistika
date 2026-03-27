"use client";
import React, { useEffect, useState } from 'react';
import { Card, Spin, Empty, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';
import CarHistoryForm from '@/modules/accounting/pages/Cars/components/CarHistoryForm';

// Define the data structure based on the API response
interface CarHistoryData {
  car: {
    id: number;
    name: string;
    number: string;
    year: string;
    engine: string;
    transmission: string;
    power: string;
    capacity: string;
    fuel: string;
    mileage: string;
    holat: string;
    car_number: string;
    kilometer: number;
    photo?: string;
    is_busy: boolean;
  };
  texnic: Array<{
    id: number;
    car_name: string;
    price: number;
    kilometer: number;
    created_at: string;
    car: number;
    service: number;
    currency: number;
  }>;
  bolon: Array<{
    id: number;
    car_name: string;
    type: string;
    price: number;
    kilometr: number;
    count: number;
    created_at: string;
    car: number;
    currency: number;
  }>;
  optol: Array<{
    id: number;
    car_name: string;
    price: number;
    kilometr: number;
    created_at: string;
    car: number;
    currency: number;
  }>;
  total_usd: number;
  details_expense_usd: {
    bolon: number;
    optol: number;
    texnic: number;
  };
  rays_history: Array<{
    id: number;
    created_at: string;
  }>;
  rays_count: number;
}

// Transform the API data to match the expected MaintenanceData format
const transformData = (data: CarHistoryData) => {
  return {
    car: {
      ...data.car,
      // Convert string fields to numbers as expected by MaintenanceData
      year: parseInt(data.car.year) || 0,
      mileage: parseInt(data.car.mileage) || 0,
      capacity: parseInt(data.car.capacity) || 0
    },
    optollar: data.optol.map(item => ({
      id: item.id,
      price: item.price,
      kilometr: item.kilometr,
      created_at: item.created_at,
      car: item.car
    })),
    balonlar: data.bolon.map(item => ({
      id: item.id,
      car: data.car.name,
      type: item.type,
      price: item.price,
      kilometr: item.kilometr,
      count: item.count,
      created_at: item.created_at
    })),
    texniklar: data.texnic.map(item => ({
      id: item.id,
      price: item.price,
      kilometer: item.kilometer,
      created_at: item.created_at,
      car: item.car,
      service: {
        id: 1, // Using a default value as service details may not be available
        name: 'Service'
      }
    })),
    total_expense: data.total_usd,
    details_expense: {
      chiqimlik: 0, // Default value
      optol: data.details_expense_usd.optol,
      balon: data.details_expense_usd.bolon,
      service: data.details_expense_usd.texnic
    }
  };
};

const CarHistoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const carId = params.id;
  
  const [carData, setCarData] = useState<CarHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCarData = async () => {
      if (!carId) return;
      
      setLoading(true);
      try {
        // Fetch car history data
        const response = await axiosInstance.get(`/history/${carId}/car-history/`);
        setCarData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching car data:', err);
        setError('Ma&apos;lumotlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  if (loading && isClient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-container">
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Ma&apos;lumotlar yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (error && isClient) {
    return (
      <Card variant="outlined">
        <Empty 
          description={error} 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
            Ortga qaytish
          </Button>
        </div>
      </Card>
    );
  }

  // Only render the main content when we're on the client
  // or show a minimal placeholder for the server
  if (!isClient) {
    return <div style={{ padding: '24px' }}></div>;
  }

  return (
    <div style={{ padding: '24px' }} suppressHydrationWarning>
      <Card variant="outlined">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: '24px' }}
        >
          Ortga qaytish
        </Button>
        
        {carData ? (
          <CarHistoryForm carId={Number(carId)} data={transformData(carData)} />
        ) : (
          <Empty description="Ma&apos;lumotlar topilmadi" />
        )}
      </Card>
    </div>
  );
};

export default CarHistoryPage; 