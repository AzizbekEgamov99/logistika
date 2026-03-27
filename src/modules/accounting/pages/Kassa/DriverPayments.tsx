import React, { useEffect, useState } from 'react';
import { Table, Card, message, Typography, Tag, Space, Button, Divider, Spin } from 'antd';
import { CarOutlined, UserOutlined, DollarOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { formatMoney } from '@/utils/format';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Title, Text } = Typography;

interface ClientPayment {
  client: string;
  amount_in_usd: number;
  amount_original: number;
  currency: string;
}

interface DriverPaymentData {
  rays_id: number;
  driver: string;
  driver_id: number;
  clients: ClientPayment[];
  total_rays_usd?: number;
}

const DriverPayments: React.FC = () => {
  const [driverPayments, setDriverPayments] = useState<DriverPaymentData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDriverPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/casa/via-driver-summary/');
      const paymentsWithDriverId = response.data.map((payment: any) => ({
        ...payment,
        driver_id: payment.driver_id || 0
      }));
      setDriverPayments(paymentsWithDriverId);
    } catch (error) {
      console.error('Error fetching driver payments summary:', error);
      message.error('Haydovchilardagi pullar ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverPayments();
  }, []);

  const expandRow = (record: DriverPaymentData) => {
    return (
      <Card title="Mijozlar ma'lumotlari" bordered={false}>
        <Table
          columns={[
            {
              title: 'Mijoz',
              dataIndex: 'client',
              key: 'client',
              render: (client: string) => (
                <Space>
                  <UserOutlined />
                  <Text>{client}</Text>
                </Space>
              )
            },
            {
              title: 'Summa (USD)',
              dataIndex: 'amount_in_usd',
              key: 'amount_in_usd',
              render: (amount: number) => (
                <Text strong style={{ color: '#1890ff' }}>
                  {formatMoney(amount)} USD
                </Text>
              )
            },
            {
              title: 'Asl summa',
              key: 'original_amount',
              render: (_, record: ClientPayment) => (
                <Space>
                  <Text>{formatMoney(record.amount_original)}</Text>
                  <Tag color="blue">{record.currency}</Tag>
                </Space>
              )
            }
          ]}
          dataSource={record.clients}
          pagination={false}
          rowKey={(clientRecord, index) => `client-${record.rays_id}-${index}`}
        />
        
        <Divider />
      </Card>
    );
  };

  const columns = [
    {
      title: 'Reys ID',
      dataIndex: 'rays_id',
      key: 'rays_id',
      render: (id: number) => (
        <Button type="link" style={{ padding: 0 }}>
          <Tag color="blue">#{id}</Tag>
        </Button>
      )
    },
    {
      title: 'Haydovchi',
      dataIndex: 'driver',
      key: 'driver',
      render: (driver: string, record: DriverPaymentData) => (
          <Button type="link" style={{ padding: 0 }}>
            <Space>
              <CarOutlined />
              <Text strong>{driver}</Text>
            </Space>
          </Button>
      )
    },
    {
      title: 'Mijozlar soni',
      key: 'client_count',
      render: (_, record: DriverPaymentData) => (
        <Tag color="green">{record.clients.length} ta</Tag>
      )
    },
    {
      title: 'Jami summa (USD)',
      key: 'total_amount',
      render: (_, record: DriverPaymentData) => {
        const total = record.clients.reduce(
          (sum, client) => sum + client.amount_in_usd, 0
        );
        return (
          <Text strong style={{ color: '#1890ff' }}>
            {formatMoney(total)} USD
          </Text>
        );
      }
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record: DriverPaymentData) => (
        <Space>
          <Link href={`/modules/accounting/drivers/history/${record.driver_id}`} passHref>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
            >
              Haydovchi profili
            </Button>
          </Link>
          <Link href={`/modules/accounting/freight/${record.rays_id}`} passHref>
            <Button
              type="default"
              size="small"
              icon={<ArrowRightOutlined />}
            >
              Reys tafsilotlari
            </Button>
          </Link>
        </Space>
      )
    }
  ];

  return (
    <Card>
      <Title level={4} style={{ marginBottom: '24px' }}>
        <DollarOutlined /> Haydovchilardagi pullar
      </Title>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={driverPayments}
          loading={loading}
          rowKey={(record) => `rays-${record.rays_id}`}
          expandable={{
            expandedRowRender: expandRow,
            expandRowByClick: true
          }}
          pagination={{
            total: driverPayments.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta reys`
          }}
        />
      )}
    </Card>
  );
};

export default DriverPayments; 