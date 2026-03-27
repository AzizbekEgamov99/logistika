"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Spin, Row, Col, Typography, Tag, Statistic, Timeline, Badge, Empty, 
   Table, Avatar, Space, Descriptions, Progress, Tabs
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  CarOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileDoneOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import axiosInstance from '@/api/axiosInstance';
import dayjs from 'dayjs';

const { Title, Text} = Typography;
const { TabPane } = Tabs;

interface ClientData {
  client: {
    id: number;
    first_name: string;
    last_name: string;
    city: string;
    number: string;
    company: string | null;
  };
  rays_history: {
    id: number;
    created_at: string;
  }[];
  rays_count: number;
  total_paid: {
    USD: number;
    UZS: number;
    RUB: number;
  };
  total_paid_usd: number;
}

const ClientHistoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id;
  
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!clientId) {
          setError("Client ID not found");
          setLoading(false);
          return;
        }
        
        const response = await axiosInstance.get(`/history/${clientId}/client-history/`);
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format('DD.MM.YYYY HH:mm');
    } catch {
      return dateString;
    }
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('uz-UZ', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' ' + currency;
  };

  // Calculate the percentage each currency contributes to the total
  const calculatePercentage = (amount: number, currency: string) => {
    if (!data) return 0;
    
    // Convert to USD for percentage calculation
    let valueInUsd = 0;
    if (currency === 'USD') {
      valueInUsd = amount;
    } else if (currency === 'UZS') {
      valueInUsd = amount / 12270; // Approximate conversion rate
    } else if (currency === 'RUB') {
      valueInUsd = amount / 92; // Approximate conversion rate
    }
    
    const total = data.total_paid_usd || 1; // Avoid division by zero
    return Math.min(Math.round((valueInUsd / total) * 100), 100);
  };
  
  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        gap: '16px'
      }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
        <Text type="secondary">Ma&apos;lumotlar yuklanmoqda...</Text>
      </div>
    );
  }
  
  if (error || !data || !data.client) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty
          description={error || "Ma'lumot topilmadi"}
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
    <div className="client-history-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with navigation */}
      <div className="page-header" style={{ 
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
            Mijoz Tarixi
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
      
      {/* Summary statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#f6ffed', borderRadius: '8px' }}>
            <Statistic
              title="Reyslar soni"
              value={rays_count}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#fff2e8', borderRadius: '8px' }}>
            <Statistic
              title="USD to'lovlari"
              value={total_paid.USD}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#e6f7ff', borderRadius: '8px' }}>
            <Statistic
              title="UZS to'lovlari"
              value={total_paid.UZS}
              prefix={<DollarOutlined />}
              suffix="UZS"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#f9f0ff', borderRadius: '8px' }}>
            <Statistic
              title="RUB to'lovlari"
              value={total_paid.RUB}
              prefix={<DollarOutlined />}
              suffix="RUB"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]}>
        {/* Client details */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TeamOutlined style={{ color: '#1890ff' }} />
                <span>Mijoz ma&apos;lumotlari</span>
              </Space>
            }
            variant="borderless"
            style={{ height: '100%', borderRadius: '8px' }}
            className="client-info-card"
          >
            <div className="client-header" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '24px'
            }}>
              <Avatar 
                icon={<UserOutlined />} 
                size={64} 
                style={{ 
                  backgroundColor: '#1890ff',
                  marginRight: '16px'
                }}
              >
                {client.first_name.charAt(0)}{client.last_name.charAt(0)}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: '0 0 4px 0' }}>
                  {client.first_name} {client.last_name}
                </Title>
                {client.company && (
                  <Text type="secondary">{client.company}</Text>
                )}
              </div>
            </div>

            <Descriptions layout="vertical" column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item 
                label={<><PhoneOutlined /> Telefon</>}
                labelStyle={{ fontWeight: 'bold' }}
              >
                {client.number}
              </Descriptions.Item>
              <Descriptions.Item 
                label={<><EnvironmentOutlined /> Shahar</>}
                labelStyle={{ fontWeight: 'bold' }}
              >
                {client.city}
              </Descriptions.Item>
              <Descriptions.Item 
                label={<><CarOutlined /> Reyslar soni</>}
                labelStyle={{ fontWeight: 'bold' }}
                span={2}
              >
                <Tag color="green" style={{ fontSize: '14px', padding: '4px 8px' }}>
                  {rays_count} reys
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        {/* Payment statistics */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <DollarOutlined style={{ color: '#1890ff' }} />
                <span>To&apos;lovlar statistikasi</span>
              </Space>
            }
            variant="borderless"
            style={{ height: '100%', borderRadius: '8px' }}
          >
            <div className="total-section" style={{ 
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

            <div className="currency-breakdown">
              <Title level={5}>Valyutalar bo&apos;yicha taqsimot</Title>
              
              {/* USD Breakdown */}
              {total_paid.USD > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>USD</Text>
                    <Text>{formatCurrency(total_paid.USD, 'USD')}</Text>
                  </div>
                  <Progress 
                    percent={calculatePercentage(total_paid.USD, 'USD')} 
                    status="active" 
                    strokeColor="#52c41a"
                    showInfo={false}
                    style={{ marginBottom: '4px' }}
                  />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {calculatePercentage(total_paid.USD, 'USD')}% of total payments
                  </Text>
                </div>
              )}
              
              {/* UZS Breakdown */}
              {total_paid.UZS > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>UZS</Text>
                    <Text>{formatCurrency(total_paid.UZS, 'UZS')}</Text>
                  </div>
                  <Progress 
                    percent={calculatePercentage(total_paid.UZS, 'UZS')} 
                    status="active" 
                    strokeColor="#1890ff"
                    showInfo={false}
                    style={{ marginBottom: '4px' }}
                  />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {calculatePercentage(total_paid.UZS, 'UZS')}% of total payments
                  </Text>
                </div>
              )}
              
              {/* RUB Breakdown */}
              {total_paid.RUB > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>RUB</Text>
                    <Text>{formatCurrency(total_paid.RUB, 'RUB')}</Text>
                  </div>
                  <Progress 
                    percent={calculatePercentage(total_paid.RUB, 'RUB')} 
                    status="active" 
                    strokeColor="#722ed1"
                    showInfo={false}
                    style={{ marginBottom: '4px' }}
                  />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {calculatePercentage(total_paid.RUB, 'RUB')}% of total payments
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
        
        {/* Trip history */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <HistoryOutlined style={{ color: '#1890ff' }} />
                <span>Reyslar tarixi</span>
              </Space>
            }
            extra={
              <Badge count={rays_count} style={{ backgroundColor: '#52c41a' }} />
            }
            variant="borderless"
            style={{ borderRadius: '8px' }}
            className="trip-history-card"
          >
            {rays_history && rays_history.length > 0 ? (
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                tabBarStyle={{ marginBottom: '24px' }}
              >
                <TabPane 
                  tab={<span><HistoryOutlined /> Vaqt jadval</span>} 
                  key="1"
                >
                  <Timeline
                    mode="left"
                    items={rays_history.map(ray => ({
                      dot: <CarOutlined style={{ fontSize: '16px' }} />,
                      color: 'blue',
                      children: (
                        <Card 
                          size="small" 
                          variant="borderless"
                          style={{ 
                            marginBottom: '8px', 
                            background: '#f0f7ff',
                            borderRadius: '8px',
                            borderLeft: '2px solid #1890ff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space direction="vertical" size={0}>
                              <Text strong>Reys #{ray.id}</Text>
                              <Text type="secondary">
                                <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                {formatDate(ray.created_at)}
                              </Text>
                            </Space>
                            <Link href={`/modules/accounting/trips/${ray.id}`}>
                              <Button size="small" type="primary">
                                Batafsil
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      )
                    }))}
                  />
                </TabPane>
                <TabPane 
                  tab={<span><FileDoneOutlined /> Jadval ko`rinishi</span>} 
                  key="2"
                >
                  <Table
                    dataSource={rays_history}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    columns={[
                      {
                        title: 'Reys ID',
                        dataIndex: 'id',
                        key: 'id',
                        render: id => <Tag color="blue">#{id}</Tag>
                      },
                      {
                        title: 'Sana',
                        dataIndex: 'created_at',
                        key: 'created_at',
                        render: date => (
                          <Space>
                            <CalendarOutlined />
                            <Text>{formatDate(date)}</Text>
                          </Space>
                        )
                      },
                      {
                        title: 'Amallar',
                        key: 'actions',
                        render: (_, record) => (
                          <Link href={`/modules/accounting/trips/${record.id}`}>
                            <Button type="primary" size="small">
                              Batafsil
                            </Button>
                          </Link>
                        )
                      }
                    ]}
                  />
                </TabPane>
              </Tabs>
            ) : (
              <Empty 
                description="Reyslar tarixi mavjud emas" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>
      
      <style jsx global>{`
        .client-info-card .ant-descriptions-item-label {
          font-weight: bold;
          color: #666;
        }
        .trip-history-card .ant-timeline-item-tail {
          border-left: 2px solid #e8e8e8;
        }
        .trip-history-card .ant-timeline-item {
          padding-bottom: 24px;
        }
        .trip-history-card .ant-card-body {
          padding: 16px;
        }
        @media (max-width: 576px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .page-header button {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientHistoryPage; 