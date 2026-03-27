"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Button, Spin, Descriptions, Tabs, Space, Tag, Statistic, Progress, Avatar, Table } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, UserOutlined, CarOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { driverApi } from '../../api/driver/driverApi';
import { tripApi } from '../../api/trip/tripApi';
import { DriverData } from '../../types/driver';
import { TripData } from '../../types/trip';

import { baseURL, formatImageUrl } from '../../../../api/axiosInstance';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DriverDetail = () => {
  const params = useParams();
  const router = useRouter();
  const driverId = Number(params?.id);
  
  const [driver, setDriver] = useState<DriverData | null>(null);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [driverStats, setDriverStats] = useState<any>(null);
  
  useEffect(() => {
    const fetchDriverData = async () => {
      if (!driverId) return;
      
      try {
        setLoading(true);
        // Fetch driver details
        const driverData = await driverApi.getDriverById(driverId);
        setDriver(driverData);
        
        // Fetch driver trips
        const tripsResponse = await tripApi.getAllTrips({ driverId });
        setTrips(tripsResponse.data);
        
        // Fetch driver statistics
        try {
          setStatsLoading(true);
          const statsData = await driverApi.getDriverStatistics(driverId);
          setDriverStats(statsData);
        } catch (error) {
          console.error('Error fetching driver statistics:', error);
        } finally {
          setStatsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching driver details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriverData();
  }, [driverId]);
  
  const handleDelete = async () => {
    if (!driver?.id) return;
    
    try {
      await driverApi.deleteDriver(driver.id);
      router.push('/modules/ceo/drivers');
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };
  
  const handleEdit = () => {
    router.push(`/modules/ceo/drivers/edit/${driverId}`);
  };
  
  const handleBack = () => {
    router.push('/modules/ceo/drivers');
  };
  
  if (loading) {
    return (
      <DashboardLayout title="Haydovchi ma'lumotlari" subtitle="Yuklanmoqda...">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!driver) {
    return (
      <DashboardLayout title="Haydovchi topilmadi" subtitle="Ma'lumot mavjud emas">
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>Haydovchi ma'lumotlari topilmadi</Title>
            <Button type="primary" onClick={handleBack}>
              Orqaga qaytish
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }
  
  // Calculate driver metrics
  const metrics = {
    totalTrips: trips.length,
    completedTrips: trips.filter(trip => trip.status === 'completed').length,
    canceledTrips: trips.filter(trip => trip.status === 'canceled').length,
    totalRevenue: trips.reduce((sum, trip) => sum + (trip.cost || 0), 0),
    completionRate: trips.length > 0 ? 
      (trips.filter(trip => trip.status === 'completed').length / trips.length) * 100 : 0
  };
  
  const tripColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Sana',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ')
    },
    {
      title: 'Marshrut',
      key: 'route',
      render: (_: any, record: TripData) => (
        <span>{record.pickup_location} → {record.delivery_location}</span>
      )
    },
    {
      title: 'Masofa',
      dataIndex: 'distance',
      key: 'distance',
      render: (distance: number) => `${distance} km`
    },
    {
      title: 'Narxi',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `${cost.toLocaleString()} $`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'completed' ? 'success' : 
          status === 'canceled' ? 'error' : 
          status === 'in_progress' ? 'processing' : 
          'default'
        }>
          {status === 'completed' ? 'Yakunlangan' : 
           status === 'canceled' ? 'Bekor qilingan' : 
           status === 'in_progress' ? 'Jarayonda' : 
           status === 'pending' ? 'Kutilmoqda' : status}
        </Tag>
      )
    }
  ];
  
  return (
    <DashboardLayout 
      title={`${driver.first_name} ${driver.last_name}`} 
      subtitle="Haydovchi ma'lumotlari"
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Orqaga
          </Button>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Tahrirlash
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
            O'chirish
          </Button>
        </Space>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                style={{ 
                  marginBottom: 16,
                  backgroundColor: '#1890ff',
                }}
              >
                {driver.first_name?.charAt(0)}
              </Avatar>
              <Title level={4}>{driver.first_name} {driver.last_name}</Title>
              <Tag color={
                driver.status === 'active' ? 'success' : 
                driver.status === 'inactive' ? 'default' : 
                driver.status === 'on_trip' ? 'processing' : 'default'
              }>
                {driver.status === 'active' ? 'Faol' : 
                 driver.status === 'inactive' ? 'Nofaol' : 
                 driver.status === 'on_trip' ? 'Reysda' : driver.status}
              </Tag>
            </div>
            
            <Descriptions title="Asosiy ma'lumotlar" column={1} layout="vertical" bordered>
              <Descriptions.Item label="ID">{driver.id}</Descriptions.Item>
              <Descriptions.Item label="Telefon">{driver.phone_number || driver.phone || 'Mavjud emas'}</Descriptions.Item>
              <Descriptions.Item label="Litsenziya">{driver.license_number}</Descriptions.Item>
              <Descriptions.Item label="Litsenziya muddati">
                {new Date(driver.license_expiry).toLocaleDateString('uz-UZ')}
              </Descriptions.Item>
              {driver.email && (
                <Descriptions.Item label="Email">{driver.email}</Descriptions.Item>
              )}
              {driver.city && (
                <Descriptions.Item label="Shahar">{driver.city}</Descriptions.Item>
              )}
              {driver.address && (
                <Descriptions.Item label="Manzil">{driver.address}</Descriptions.Item>
              )}
              <Descriptions.Item label="Ishga kirgan sana">
                {new Date(driver.joining_date).toLocaleDateString('uz-UZ')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card>
            <Tabs defaultActiveKey="statistics">
              <TabPane tab="Statistika" key="statistics">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic 
                        title="Jami qatnovlar" 
                        value={driverStats?.total_trips || metrics.totalTrips} 
                        prefix={<CarOutlined />} 
                        loading={statsLoading}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic 
                        title="Jami daromad" 
                        value={(driverStats?.total_earnings || metrics.totalRevenue).toLocaleString()} 
                        prefix={<DollarOutlined />} 
                        suffix="$"
                        loading={statsLoading}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic 
                        title="Bajarilgan qatnovlar" 
                        value={driverStats?.completed_trips || metrics.completedTrips} 
                        prefix={<CheckCircleOutlined />} 
                        loading={statsLoading}
                      />
                    </Card>
                  </Col>
                </Row>
                
                <Card title="So'nggi qatnovlar" style={{ marginTop: 24 }}>
                  <Table 
                    dataSource={trips.slice(0, 5)} 
                    columns={tripColumns}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="Barcha qatnovlar" key="trips">
                <Table 
                  dataSource={trips} 
                  columns={tripColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default DriverDetail; 