"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Button, Spin, Descriptions, Tabs, Space, Alert, Avatar, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { clientApi } from '../../api/client/clientApi';
import { ClientData } from '../../types/client';
import ClientAnalytics from './components/ClientAnalytics';
import { motion } from 'framer-motion';
import axiosInstance from '../../../../api/axiosInstance';

const { Title, Text } = Typography;

// Client debt interface
interface ClientDebt {
  client_id: number;
  fullname: string;
  client_company: string;
  expected_usd: number;
  paid_usd: number;
  remaining_usd: number;
}

const ClientDetail = () => {
  const params = useParams();
  const router = useRouter();
  const clientId = Number(params?.id);
  
  const [client, setClient] = useState<ClientData | null>(null);
  const [clientDebt, setClientDebt] = useState<ClientDebt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch client data
        const clientData = await clientApi.getClientById(clientId);
        setClient(clientData);
        
        // Fetch client debt data
        const debtsResponse = await axiosInstance.get('/casa/all-debts/');
        const debt = debtsResponse.data.find((item: ClientDebt) => 
          item.client_id === clientId
        ) || null;
        setClientDebt(debt);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setError('Mijoz ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [clientId]);
  
  const handleDelete = async () => {
    if (!client?.id) return;
    
    try {
      await clientApi.deleteClient(client.id);
      router.push('/modules/ceo/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Mijozni o\'chirishda xatolik yuz berdi');
    }
  };
  
  const handleEdit = () => {
    router.push(`/modules/ceo/clients/edit/${clientId}`);
  };
  
  const handleBack = () => {
    router.push('/modules/ceo/clients');
  };
  
  if (loading) {
    return (
      <DashboardLayout title="Mijoz ma'lumotlari" subtitle="Yuklanmoqda...">
        <div className="centered-content">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout title="Xatolik" subtitle="Ma'lumot yuklashda xatolik">
        <Alert
          message="Xatolik yuz berdi"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={handleBack}>
              Orqaga qaytish
            </Button>
          }
        />
      </DashboardLayout>
    );
  }
  
  if (!client) {
    return (
      <DashboardLayout title="Mijoz topilmadi" subtitle="Ma'lumot mavjud emas">
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>Mijoz ma`lumotlari topilmadi</Title>
            <Button type="primary" onClick={handleBack}>
              Orqaga qaytish
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }
  
  // Format currency utility function
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "0";
    return amount.toLocaleString();
  };
  
  return (
    <DashboardLayout 
      title={`${client.first_name} ${client.last_name}`} 
      subtitle="Mijoz ma'lumotlari"
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Orqaga
          </Button>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Tahrirlash
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
            O`chirish
          </Button>
        </Space>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="client-header">
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div className="client-title">
                  <Title level={3}>
                    {client.first_name} {client.last_name}
                  </Title>
                  {client.company && (
                    <Text type="secondary">{client.company}</Text>
                  )}
                </div>
              </div>
              
              {clientDebt && clientDebt.remaining_usd > 0 && (
                <Alert
                  message="Qarzdorlik mavjud"
                  description={`${formatCurrency(clientDebt.remaining_usd)} USD miqdorida to'lov amalga oshirilishi kerak.`}
                  type="warning"
                  showIcon
                  style={{ margin: '16px 0' }}
                />
              )}
              
              <Descriptions 
                title="Asosiy ma'lumotlar" 
                column={1} 
                layout="vertical" 
                bordered
                style={{ marginTop: 16 }}
              >
                <Descriptions.Item 
                  label={<div><UserOutlined /> ID</div>}
                >{client.id}</Descriptions.Item>
                <Descriptions.Item 
                  label={<div><PhoneOutlined /> Telefon</div>}
                >{client.number || 'Mavjud emas'}</Descriptions.Item>
                <Descriptions.Item 
                  label={<div><HomeOutlined /> Shahar</div>}
                >{client.city || 'Mavjud emas'}</Descriptions.Item>
                {client.company && (
                  <Descriptions.Item 
                    label={<div><ShopOutlined /> Kompaniya</div>}
                  >{client.company}</Descriptions.Item>
                )}
                {client.email && (
                  <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
                )}
                <Descriptions.Item label="Ro'yxatdan o'tgan sana">
                  {client.created_at ? 
                    new Date(client.created_at).toLocaleDateString('uz-UZ') : 
                    'Sana mavjud emas'
                  }
                </Descriptions.Item>
              </Descriptions>
              
              {clientDebt && (
                <Card 
                  title="To'lov ma'lumotlari" 
                  style={{ marginTop: 24 }}
                  type="inner"
                >
                  <div className="payment-stat-item">
                    <Text>Kutilgan summa:</Text>
                    <Text strong>${formatCurrency(clientDebt.expected_usd)}</Text>
                  </div>
                  <div className="payment-stat-item">
                    <Text>To'langan summa:</Text>
                    <Text 
                      strong 
                      style={{ color: '#3f8600' }}
                    >${formatCurrency(clientDebt.paid_usd)}</Text>
                  </div>
                  <div className="payment-stat-item">
                    <Text>Qolgan summa:</Text>
                    <Text 
                      strong 
                      style={{ 
                        color: clientDebt.remaining_usd > 0 ? '#cf1322' : '#3f8600'
                      }}
                    >${formatCurrency(clientDebt.remaining_usd)}</Text>
                  </div>
                  <div className="payment-status">
                    <Tag 
                      color={clientDebt.remaining_usd > 0 ? 'red' : 'green'}
                      style={{ margin: '12px 0 0', fontSize: '14px', padding: '4px 8px' }}
                    >
                      {clientDebt.remaining_usd > 0 ? 'To\'lov kutilmoqda' : 'To\'lov to\'liq amalga oshirilgan'}
                    </Tag>
                  </div>
                </Card>
              )}
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <Tabs 
                defaultActiveKey="analytics"
                items={[
                  {
                    key: "analytics",
                    label: "Statistika va tarix",
                    children: <ClientAnalytics clientId={client.id} />
                  }
                ]}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      <style jsx global>{`
        .centered-content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
        }
        
        .client-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .client-title {
          margin-left: 16px;
        }
        
        .client-title h3 {
          margin-bottom: 4px;
        }
        
        .payment-stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .payment-stat-item:last-child {
          border-bottom: none;
        }
        
        .payment-status {
          text-align: center;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ClientDetail; 