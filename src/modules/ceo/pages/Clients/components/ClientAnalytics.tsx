"use client"

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Spin, Button, Empty, Alert, Descriptions } from 'antd';
import { DollarOutlined, CarOutlined, CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, HistoryOutlined, WalletOutlined, BarChartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../../../api/axiosInstance';

const { Title, Text } = Typography;

interface ClientAnalyticsProps {
  clientId: number;
}

interface Trip {
  id: number;
  created_at: string;
  price?: number;
  status?: string;
}

interface ClientDebt {
  client_id: number;
  fullname: string;
  client_company: string;
  expected_usd: number;
  paid_usd: number;
  remaining_usd: number;
}

interface ClientHistoryData {
  client: {
    id: number;
    first_name: string;
    last_name: string;
    number: string;
    city: string;
    company?: string;
  };
  rays_history: Trip[];
  rays_count: number;
  total_paid?: {
    USD?: number;
    UZS?: number;
    RUB?: number;
  };
  total_paid_usd?: number;
}

const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ clientId }) => {
  const [historyData, setHistoryData] = useState<ClientHistoryData | null>(null);
  const [debtData, setDebtData] = useState<ClientDebt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch client history
        const historyResponse = await axiosInstance.get(`/history/${clientId}/client-history/`);

        // Fetch client debt data
        const debtsResponse = await axiosInstance.get(`/casa/all-debts/`);
        const clientDebt = debtsResponse.data.find((item: ClientDebt) =>
          item.client_id === clientId
        ) || null;

        setHistoryData(historyResponse.data);
        setDebtData(clientDebt);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError("Mijoz ma'lumotlarini yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  if (loading) {
    return (
      <div className="centered-content">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (!historyData) {
    return (
      <Empty
        description="Mijoz ma'lumotlari topilmadi"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  // Format date utility function
  const formatDate = (dateString: string) => {
    if (!dateString) return "Sana ma'lum emas";

    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch {
      return "Noto'g'ri sana";
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "0";
    return amount.toLocaleString();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    },
  ];

  return (
    <div className="client-analytics">
      <Title level={4}>Mijoz statistikasi va tarixi</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Jami qatnovlar"
              value={historyData.rays_count || 0}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="To'langan summa (USD)"
              value={formatCurrency(historyData.total_paid_usd || 0)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Kutilgan to'lov (USD)"
              value={formatCurrency(debtData?.expected_usd || 0)}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Qolgan to'lov (USD)"
              value={formatCurrency(debtData?.remaining_usd || 0)}
              prefix={<BarChartOutlined />}
              valueStyle={{
                color: (debtData?.remaining_usd || 0) > 0 ? '#cf1322' : '#3f8600'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Currency Details Card */}
      {historyData.total_paid && (
        <Card title="To'lovlar tafsiloti" style={{ marginTop: 24 }}>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
            {historyData.total_paid.USD !== undefined && (
              <Descriptions.Item label="USD">
                <Text strong>{formatCurrency(historyData.total_paid.USD)}</Text>
              </Descriptions.Item>
            )}
            {historyData.total_paid.UZS !== undefined && (
              <Descriptions.Item label="UZS">
                <Text strong>{formatCurrency(historyData.total_paid.UZS)}</Text>
              </Descriptions.Item>
            )}
            {historyData.total_paid.RUB !== undefined && (
              <Descriptions.Item label="RUB">
                <Text strong>{formatCurrency(historyData.total_paid.RUB)}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HistoryOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span>Reyslar tarixi</span>
          </div>
        }
        style={{ marginTop: 24 }}
      >
        {historyData.rays_history && historyData.rays_history.length > 0 ? (
          <Table
            dataSource={historyData.rays_history}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Empty description="Reyslar tarixi topilmadi" />
        )}
      </Card>

      {/* Payment guidance if there's remaining balance */}
      {debtData && debtData.remaining_usd > 0 && (
        <Alert
          message="To'lov eslatmasi"
          description={`${debtData.fullname} uchun ${formatCurrency(debtData.remaining_usd)} USD miqdorida to'lov kutilmoqda.`}
          type="warning"
          showIcon
          style={{ marginTop: 24 }}
        />
      )}

      <style jsx global>{`
        .centered-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }
        
        .client-analytics .ant-card {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default ClientAnalytics; 