'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Row, Col, Typography, Badge, Empty, Statistic, Timeline } from 'antd';
import { useRouter } from 'next/navigation';
import { 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  CarOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  DollarOutlined
} from '@ant-design/icons';
import axiosInstance from '../../../../../api/axiosInstance';

const { Title, Text } = Typography;

const ClientHistoryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Ma'lumotlarni yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        // URL dan ID ni olish
        const currentUrl = window.location.pathname;
        const urlParts = currentUrl.split('/');
        const clientId = urlParts[urlParts.length - 2];
        
        if (!clientId) {
          setLoading(false);
          return;
        }
        
        console.log('Fetching client history for ID:', clientId);
        // Ma'lumotlarni olish
        const response = await axiosInstance.get(`/history/${clientId}/client-history/`);
        console.log('API response:', response.data);
        setData(response.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sanani formatlash
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch  {
      return dateString;
    }
  };
  
  // Pul birligini formatlash
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('uz-UZ', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' ' + currency;
  };
  
  // Yuklanish holati
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  // Ma'lumot topilmadi
  if (!data || !data.client) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty
          description="Ma&apos;lumot topilmadi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button 
          onClick={() => router.push('/modules/accounting/clients')} 
          type="primary"
          style={{ marginTop: 16 }}
        >
          Mijozlar ro&apos;yxatiga qaytish
        </Button>
      </div>
    );
  }
  
  const { client, rays_history, rays_count, total_paid } = data;
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        background: 'linear-gradient(to right, #1890ff, #69c0ff)',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white'
      }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            Mijoz tarixi
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            {client.first_name} {client.last_name} - {client.company || 'Yakka tartibdagi mijoz'}
          </Text>
        </div>
        <Button 
          onClick={() => router.push('/modules/accounting/clients')} 
          icon={<ArrowLeftOutlined />}
          type="primary"
          ghost
          style={{ borderColor: 'white', color: 'white' }}
        >
          Mijozlar ro&apos;yxatiga
        </Button>
      </div>
      
      {/* Statistika */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" style={{ background: '#f6ffed', borderRadius: '8px' }}>
            <Statistic
              title="Reyslar soni"
              value={rays_count}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" style={{ background: '#fff2e8', borderRadius: '8px' }}>
            <Statistic
              title="USD to&apos;lovlari"
              value={total_paid?.USD || 0}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" style={{ background: '#e6f7ff', borderRadius: '8px' }}>
            <Statistic
              title="UZS to&apos;lovlari"
              value={total_paid?.UZS || 0}
              prefix={<DollarOutlined />}
              suffix="UZS"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" style={{ background: '#f9f0ff', borderRadius: '8px' }}>
            <Statistic
              title="RUB to&apos;lovlari"
              value={total_paid?.RUB || 0}
              prefix={<DollarOutlined />}
              suffix="RUB"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]}>
        {/* Mijoz ma'lumotlari */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} /> 
                <span>Mijoz ma&apos;lumotlari</span>
              </div>
            }
            variant="outlined"
            style={{ height: '100%' }}
            className="client-info-card"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <PhoneOutlined style={{ fontSize: '18px', color: '#1890ff', marginRight: '12px' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>Telefon raqami</Text>
                    <Text strong>{client.number}</Text>
                  </div>
                </div>
              </Col>
              
              <Col span={24}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <EnvironmentOutlined style={{ fontSize: '18px', color: '#1890ff', marginRight: '12px' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>Shahar</Text>
                    <Text strong>{client.city}</Text>
                  </div>
                </div>
              </Col>
              
              {client.company && (
                <Col span={24}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    <BankOutlined style={{ fontSize: '18px', color: '#1890ff', marginRight: '12px' }} />
                    <div>
                      <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>Kompaniya</Text>
                      <Text strong>{client.company}</Text>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
        
        {/* To'lovlar statistikasi */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DollarOutlined style={{ marginRight: 8, color: '#1890ff' }} /> 
                <span>To&apos;lovlar statistikasi</span>
              </div>
            }
            variant="outlined"
            style={{ height: '100%' }}
          >
            <div style={{ 
              background: '#f0f7ff', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <Text type="secondary">Umumiy to&apos;lovlar (USD hisobida)</Text>
                <div>
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {formatCurrency(data.total_paid_usd || 0, 'USD')}
                  </Text>
                </div>
              </div>
              <DollarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            </div>
            
            <div>
              <Title level={5}>Valyutalar bo&apos;yicha to&apos;lovlar</Title>
              
              {/* USD To'lovlar */}
              {total_paid?.USD > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>USD</Text>
                    <Text>{formatCurrency(total_paid.USD, 'USD')}</Text>
                  </div>
                </div>
              )}
              
              {/* UZS To'lovlar */}
              {total_paid?.UZS > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>UZS</Text>
                    <Text>{formatCurrency(total_paid.UZS, 'UZS')}</Text>
                  </div>
                </div>
              )}
              
              {/* RUB To'lovlar */}
              {total_paid?.RUB > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>RUB</Text>
                    <Text>{formatCurrency(total_paid.RUB, 'RUB')}</Text>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
        
        {/* Reyslar tarixi */}
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} /> 
                <span>Reyslar tarixi</span>
              </div>
            }
            extra={<Badge count={rays_count} style={{ backgroundColor: '#52c41a' }} />}
            variant="outlined"
          >
            {rays_history && rays_history.length > 0 ? (
              <Timeline
                mode="left"
                items={rays_history.map(ray => ({
                  children: (
                    <Card 
                      size="small" 
                      variant="outlined"
                      style={{ 
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        borderLeft: '2px solid #1890ff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>Reys #{ray.id}</Text>
                        <Text type="secondary">{formatDate(ray.created_at)}</Text>
                      </div>
                    </Card>
                  ),
                  dot: <CarOutlined style={{ fontSize: '16px' }} />,
                }))}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Reyslar tarixi mavjud emas"
              />
            )}
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .client-info-card .ant-card-head-title {
          font-weight: 600;
        }
        .ant-timeline-item-tail {
          border-left: 2px solid #e8e8e8;
        }
        .ant-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          border-radius: 8px;
        }
        .ant-card-head {
          border-bottom: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default ClientHistoryPage; 
