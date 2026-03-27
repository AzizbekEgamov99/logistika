"use client";
import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Avatar, Tag, Empty, Space, Spin, Descriptions, Divider, Row, Col, Button, Breadcrumb } from 'antd';
import { 
  UserOutlined, 
  CarOutlined, 
  EnvironmentOutlined, 
  ShoppingOutlined, 
  TeamOutlined, 
  PhoneOutlined, 
  ArrowLeftOutlined,
  DollarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';
import { formatCurrency } from '@/modules/accounting/utils/formatters';
import Link from 'next/link';

const { Text, Title } = Typography;

interface DriverInfo {
  id: number;
  fullname: string;
  username: string;
  phone_number: string;
  photo: string | null;
  status: string;
  date: string;
  is_busy: boolean;
  rays_count: number;
  total_rays_usd: number;
  passport_series?: string | null;
  passport_number?: string | null;
}

interface DriverHistory {
  id: number;
  country: {
    id: number;
    name: string;
  };
  driver: {
    fullname: string;
    phone_number: string;
  };
  car: {
    name: string;
    number: string;
  };
  fourgon: {
    name: string;
    number: string;
  };
  client: {
    id: number;
    first_name: string;
    last_name: string;
    number: string;
    products: {
      name: string;
      price: number;
      count: number;
      from_location: string;
      to_location: string;
    }[];
  }[];
  price: number;
  dr_price: number;
  dp_price: number;
  kilometer: number;
  dp_information: string;
  created_at: string;
  count: number;
  products: {
    name: string;
    price: number;
    count: number;
    from_location: string;
    to_location: string;
  }[];
  expenses: any[];
}

const DriverHistoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id;
  
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [driverHistory, setDriverHistory] = useState<DriverHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const pathSegments = window.location.pathname.split('/');
      if (pathSegments.includes('car-history')) {
        return;
      }

      // Continue with driver history fetch
      fetchDriverData();
    }
  }, [driverId, isClient]);

  const fetchDriverData = async () => {
    if (!driverId) return;
    
    setLoading(true);
    try {
      // Fetch driver details
      const driverResponse = await axiosInstance.get(`/customusers/${driverId}/`);
      setDriver(driverResponse.data);
      
      // Fetch driver history
      const historyResponse = await axiosInstance.get(`/customusers/${driverId}/driver-history/`);
      setDriverHistory(historyResponse.data.history || []);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching driver data:', err);
      setError('Ma&apos;lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Get status color for display
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'error',
      onRoute: 'processing',
      onVacation: 'warning',
      driver: 'success',
      owner: 'blue',
      manager: 'purple',
    }
    return colors[status] || 'default'
  }
  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      active: 'Faol',
      inactive: 'Faol emas',
      onRoute: 'Yo`lda',
      onVacation: 'Ta`tilda',
      driver: 'Haydovchi',
      owner: 'Egasi',
      manager: 'Menejer',
    }
    return texts[status] || status
  }

  // Table columns for history - enhance with better styling and more info
  const historyColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: number) => (
        <span style={{ fontWeight: 500 }}>#{id}</span>
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (date: string) => formatDate(date),
      sorter: (a: DriverHistory, b: DriverHistory) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Mashina',
      dataIndex: 'car',
      key: 'car',
      render: (car: any) => {
        if (!car) {
          return <Tag color="default">No car data</Tag>;
        }
        return <Tag icon={<CarOutlined />} color="blue">{car.name} ({car.number})</Tag>;
      },
    },
    {
      title: 'Furgon',
      dataIndex: 'fourgon',
      key: 'fourgon',
      render: (fourgon: any) => {
        if (!fourgon) {
          return <Tag color="default">No fourgon data</Tag>;
        }
        return <Tag color="purple">{fourgon.name} ({fourgon.number})</Tag>;
      },
    },
    {
      title: 'Masofa',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (km: number) => `${km.toLocaleString()} km`,
      sorter: (a: DriverHistory, b: DriverHistory) => a.kilometer - b.kilometer,
    },
    {
      title: 'Umumiy narx',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong style={{ color: '#52c41a' }}>{formatCurrency(price)}</Text>
      ),
      sorter: (a: DriverHistory, b: DriverHistory) => a.price - b.price,
    },
    {
      title: 'Haydovchi uchun',
      dataIndex: 'dr_price',
      key: 'dr_price',
      render: (price: number) => (
        <Text style={{ color: '#1890ff' }}>{formatCurrency(price)}</Text>
      ),
      sorter: (a: DriverHistory, b: DriverHistory) => a.dr_price - b.dr_price,
    },
  ];

  // Expandable content for the history table
  const renderHistoryDetails = (record: DriverHistory) => {
    // Check if we have a valid record
    if (!record) {
      return <Empty description="No details available" />;
    }

    return (
      <div style={{ padding: '16px', background: '#fafafa' }}>
        <Divider orientation="left">Yo`nalish va mahsulot ma`lumotlari</Divider>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card size="small" variant="outlined">
              <Space>
                <EnvironmentOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />
                <Text strong>Yo`nalish:</Text>
                <Text>{record.products?.[0]?.from_location || '-'} → {record.products?.[0]?.to_location || '-'}</Text>
                <Divider type="vertical" />
                <CarOutlined style={{ color: '#1890ff' }} />
                <Text strong>Masofa:</Text>
                <Text>{record.kilometer?.toLocaleString() || 0} km</Text>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Title level={5} style={{ marginTop: '16px' }}>
          <ShoppingOutlined /> Mahsulotlar
        </Title>
        
        {Array.isArray(record.products) && record.products.length > 0 ? (
          <Table
            dataSource={Array.isArray(record.products) ? record.products : []}
            columns={[
              {
                title: 'Nomi',
                dataIndex: 'name',
                key: 'name',
                render: (name: string) => name || '-',
              },
              {
                title: 'Narx',
                dataIndex: 'price',
                key: 'price',
                render: (price: number) => price ? formatCurrency(price) : '-',
              },
              {
                title: 'Soni',
                dataIndex: 'count',
                key: 'count',
                render: (count: number) => count ? count.toLocaleString() : '0',
              },
              {
                title: 'Jami',
                key: 'total',
                render: (_, record) => {
                  const price = record.price || 0;
                  const count = record.count || 0;
                  return formatCurrency(price * count);
                },
              },
            ]}
            rowKey={(record) => `product-${record.id || Math.random().toString(36).substr(2, 9)}`}
            pagination={false}
            size="small"
            bordered
          />
        ) : (
          <Empty description="No products data available" />
        )}
        
        <Divider orientation="left">Moliyaviy ma`lumotlar</Divider>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Pul ma'lumotlari" size="small" variant="outlined">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Umumiy narx">
                  <Text strong style={{ color: '#52c41a' }}>{formatCurrency(record.price)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Haydovchi uchun">
                  <Text style={{ color: '#1890ff' }}>{formatCurrency(record.dr_price)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Xarajatlar uchun">
                  <Text style={{ color: '#ff4d4f' }}>{formatCurrency(record.dp_price)}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Qo'shimcha ma'lumotlar" size="small" variant="outlined">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Xarajatlar haqida">
                  {record.dp_information || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Yuk soni">
                  {record.count || 0}
                </Descriptions.Item>
                {record.country?.name && (
                  <Descriptions.Item label="Davlat">
                    {record.country.name}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        </Row>
        
        <Divider orientation="left">Mijoz ma`lumotlari</Divider>
        
        {Array.isArray(record.client) && record.client.length > 0 ? (
          <Row gutter={[16, 16]}>
            {record.client.map((client, index) => {
              if (!client) return null;
              return (
                <Col xs={24} sm={12} md={8} key={`client-${client.id || index}`}>
                  <Card 
                    title={
                      <><TeamOutlined /> {client.first_name || ''} {client.last_name || ''}</>
                    }
                    size="small"
                    variant="outlined"
                    style={{ height: '100%' }}
                  >
                    <p><PhoneOutlined /> {client.number || 'No phone number'}</p>
                    {Array.isArray(client.products) && client.products.length > 0 && (
                      <>
                        <Divider style={{ margin: '12px 0' }} />
                        <p><ShoppingOutlined /> {client.products.length} ta mahsulot</p>
                      </>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Empty description="Mijoz ma'lumotlari mavjud emas" />
        )}
      </div>
    );
  };

  // Calculate total earned
  const totalEarned = driverHistory.reduce((sum, record) => sum + (record.dr_price || 0), 0);
  
  // Calculate total kilometers
  const totalKilometers = driverHistory.reduce((sum, record) => sum + (record.kilometer || 0), 0);
  
  // Calculate total trips
  const totalTrips = driverHistory.length;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Mavjud emas';
    
    // Only execute date formatting on the client to avoid hydration mismatch
    if (!isClient) {
      return dateString; // Return the raw string on server
    }
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  if (loading && isClient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-container">
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Ma'lumotlar yuklanmoqda...</div>
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
      <Breadcrumb 
        items={[
          { title: <Link href="/modules/accounting/drivers">Haydovchilar</Link> },
          { title: driver?.fullname || 'Haydovchi tarixi' }
        ]}
        style={{ marginBottom: '16px' }}
      />
      
      <Card variant="outlined">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: '24px' }}
        >
          Ortga qaytish
        </Button>
        
        {driver && (
          <>
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Card variant="borderless" style={{ background: '#f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={driver.photo} 
                      size={80}
                      icon={!driver.photo && <UserOutlined />}
                      style={{ backgroundColor: driver.photo ? 'transparent' : '#1890ff' }}
                    >
                      {!driver.photo && driver.fullname?.charAt(0)}
                    </Avatar>
                    <div style={{ marginLeft: 16 }}>
                      <h2 style={{ margin: '0 0 4px 0' }}>{driver.fullname}</h2>
                      <Space>
                        <Tag color={getStatusColor(driver.status)}>
                          {getStatusText(driver.status)}
                        </Tag>
                        <Tag color={driver.is_busy ? 'processing' : 'success'}>
                          {driver.is_busy ? 'Band' : 'Bo\'sh'}
                        </Tag>
                      </Space>
                      <div style={{ marginTop: 8 }}>
                        <PhoneOutlined style={{ marginRight: '8px' }} />
                        {driver.phone_number}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Card variant="outlined" style={{ height: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <DollarOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                        <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginBottom: '4px' }}>Jami daromad</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                          {formatCurrency(totalEarned)}
                        </div>
                        {driver.total_rays_usd > 0 && (
                          <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginTop: '4px' }}>
                            ${driver.total_rays_usd.toLocaleString()} USD
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card variant="outlined" style={{ height: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <CarOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                        <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginBottom: '4px' }}>Jami masofa</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                          {totalKilometers.toLocaleString()} km
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card variant="outlined" style={{ height: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <TeamOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }} />
                        <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginBottom: '4px' }}>Jami reyslar</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                          {totalTrips}
                          {driver.rays_count > 0 && driver.rays_count !== totalTrips && (
                            <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginTop: '4px' }}>
                              Umumiy: {driver.rays_count}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            
            {driver.passport_number && (
              <Card title="Pasport ma'lumotlari" size="small" style={{ marginBottom: 24 }} variant="outlined">
                <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="small">
                  {driver.passport_series && (
                    <Descriptions.Item label="Pasport seriyasi">
                      {driver.passport_series}
                    </Descriptions.Item>
                  )}
                  {driver.passport_number && (
                    <Descriptions.Item label="Pasport raqami">
                      {driver.passport_number}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}
          </>
        )}

        <Title level={4}>Haydovchi tarixi</Title>
        
        {driverHistory.length > 0 ? (
          <Table
            dataSource={driverHistory}
            columns={historyColumns}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta`,
            }}
            expandable={{
              expandedRowRender: renderHistoryDetails,
              expandRowByClick: true,
              expandIcon: ({ expanded, onExpand, record }) => 
                expanded ? (
                  <Button type="text" onClick={e => onExpand(record, e)} icon={<EyeOutlined />} />
                ) : (
                  <Button type="text" onClick={e => onExpand(record, e)} icon={<EyeOutlined />} />
                )
            }}
            size="middle"
            bordered={false}
            scroll={{ x: 1000 }}
          />
        ) : (
          <Empty description="Haydovchi uchun tarix ma'lumotlari topilmadi" />
        )}
      </Card>
    </div>
  );
};

export default DriverHistoryPage; 