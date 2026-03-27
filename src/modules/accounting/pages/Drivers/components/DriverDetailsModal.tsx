import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Tabs, Table, Avatar, Tag, Empty, Space, Spin, Typography, Card, Divider, Row, Col } from 'antd';
import { UserOutlined, CarOutlined, CheckCircleOutlined, ClockCircleOutlined, PhoneOutlined, EnvironmentOutlined, ShoppingOutlined, TeamOutlined, WalletOutlined } from '@ant-design/icons';
import { DriverType } from '../../../types/driver';
import { RaysResponseType } from '../../../types/freight';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useTrips } from '../../../hooks/useTrips';
import axiosInstance from '@/api/axiosInstance';
import DriverSalaryManager from './DriverSalaryManager';
import '../styles/DriverSalaryManager.css';
import { getDriverPhotoUrl } from '../photoUtils';

const { TabPane } = Tabs;
const { Text, Title } = Typography;

interface DriverDetailsModalProps {
  visible: boolean;
  driver: DriverType | null;
  onClose: () => void;
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

interface DriverHistoryResponse {
  history: DriverHistory[];
}

const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  visible,
  driver,
  onClose
}) => {
  const { data: allTrips, isLoading } = useTrips();
  const [driverTrips, setDriverTrips] = useState<RaysResponseType[]>([]);
  const [driverHistory, setDriverHistory] = useState<DriverHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (driver && allTrips) {
      const filteredTrips = allTrips.filter(trip => trip.driver === driver.id);
      setDriverTrips(filteredTrips);
    }
  }, [driver, allTrips]);
  useEffect(() => {
    const fetchDriverHistory = async () => {
      if (driver && visible) {
        try {
          setHistoryLoading(true);
          const response = await axiosInstance.get<DriverHistoryResponse>(`/customusers/${driver.id}/driver-history/`);
          setDriverHistory(response.data.history || []);
        } catch (error) {
          console.error('Error fetching driver history:', error);
        } finally {
          setHistoryLoading(false);
        }
      }
    };

    fetchDriverHistory();
  }, [driver, visible]);

  // Status badge color mapping
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

  // Status text mapping
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

  // Trip status indicator
  const getTripStatusTag = (isCompleted: boolean) => {
    return isCompleted ? 
      <Tag color="green" icon={<CheckCircleOutlined />}>Yakunlangan</Tag> : 
      <Tag color="blue" icon={<ClockCircleOutlined />}>Jarayonda</Tag>;
  };

  // Trip columns for the table
  const tripColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Qayerdan',
      dataIndex: 'from1',
      key: 'from1',
    },
    {
      title: 'Qayerga',
      dataIndex: 'to_go',
      key: 'to_go',
    },
    {
      title: 'Masofa',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (km: number) => `${km} km`,
    },
    {
      title: 'Narxi',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} UZS`,
    },
    {
      title: 'Holati',
      dataIndex: 'is_completed',
      key: 'status',
      render: (isCompleted: boolean) => getTripStatusTag(isCompleted),
    },
  ];

  // History columns for the table
  const historyColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Mashina',
      dataIndex: 'car',
      key: 'car',
      render: (car: any) => (
        <Tag icon={<CarOutlined />} color="blue">{car.name} ({car.number})</Tag>
      ),
    },
    {
      title: 'Yo\'nalish',
      key: 'route',
      render: (_: any, record: DriverHistory) => {
        const from = record.products?.[0]?.from_location || '-';
        const to = record.products?.[0]?.to_location || '-';
        return (
          <Space>
            <EnvironmentOutlined /> {from} → {to}
          </Space>
        );
      },
    },
    {
      title: 'Masofa',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (km: number) => `${km} km`,
    },
    {
      title: 'Umumiy narx',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong>{formatCurrency(price)}</Text>
      ),
    },
    {
      title: 'Haydovchi uchun',
      dataIndex: 'dr_price',
      key: 'dr_price',
      render: (price: number) => formatCurrency(price),
    },
  ];

  // Render details of a history item
  const renderHistoryDetails = (record: DriverHistory) => {
    return (
      <div style={{ padding: '16px' }}>
        <Divider orientation="left">Yo`nalish va mahsulot ma`lumotlari</Divider>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space>
              <EnvironmentOutlined />
              <Text strong>Yo`nalish:</Text>
              <Text>{record.products?.[0]?.from_location || '-'} → {record.products?.[0]?.to_location || '-'}</Text>
            </Space>
          </Col>
        </Row>
        
        <Title level={5} style={{ marginTop: '16px' }}>
          <ShoppingOutlined /> Mahsulotlar
        </Title>
        
        <Table
          dataSource={record.products || []}
          columns={[
            {
              title: 'Nomi',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Narx',
              dataIndex: 'price',
              key: 'price',
              render: (price: number) => formatCurrency(price),
            },
            {
              title: 'Soni',
              dataIndex: 'count',
              key: 'count',
            },
          ]}
          pagination={false}
          size="small"
          bordered
          rowKey="name"
        />
        
        <Divider orientation="left">Moliyaviy ma`lumotlar</Divider>
        
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Umumiy narx">
            <Text strong>{formatCurrency(record.price)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Haydovchi uchun">
            {formatCurrency(record.dr_price)}
          </Descriptions.Item>
          <Descriptions.Item label="Xarajatlar uchun">
            {formatCurrency(record.dp_price)}
          </Descriptions.Item>
          <Descriptions.Item label="Xarajatlar haqida">
            {record.dp_information || '-'}
          </Descriptions.Item>
        </Descriptions>
        
        <Divider orientation="left">Mijoz ma`lumotlari</Divider>
        
        {record.client && record.client.length > 0 ? (
          record.client.map(client => (
            <Card 
              key={client.id}
              title={<><TeamOutlined /> {client.first_name} {client.last_name}</>}
              size="small"
              style={{ marginBottom: '8px' }}
            >
              <p><PhoneOutlined /> {client.number}</p>
            </Card>
          ))
        ) : (
          <Empty description="Mijoz ma'lumotlari mavjud emas" />
        )}
      </div>
    );
  };

  return (
    <Modal
      title={`Haydovchi ma'lumotlari: ${driver?.fullname || ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {driver && (
        <Tabs defaultActiveKey="info">
          <TabPane tab="Umumiy ma'lumot" key="info">
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <Avatar 
                src={getDriverPhotoUrl(driver.photo) || undefined} 
                size={64}
                icon={!driver.photo && <UserOutlined />}
                style={{ backgroundColor: driver.photo ? 'transparent' : '#1890ff' }}
              >
                {!driver.photo && driver.fullname?.charAt(0)}
              </Avatar>
              <div style={{ marginLeft: 16 }}>
                <h2 style={{ margin: '0 0 4px 0' }}>{driver.fullname}</h2>
                <Tag color={getStatusColor(driver.status)}>
                  {getStatusText(driver.status)}
                </Tag>
              </div>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="Telefon raqami">
                <Space>
                  <PhoneOutlined />
                  {driver.phone_number}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Foydalanuvchi nomi">
                {driver.username}
              </Descriptions.Item>
              <Descriptions.Item label="Qo'shilgan sana">
                {formatDate(driver.date)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(driver.status)}>
                  {getStatusText(driver.status)}
                </Tag>
              </Descriptions.Item>

              {driver.passport_series && (
                <Descriptions.Item label="Passport seriyasi">
                  {driver.passport_series} {driver.passport_number}
                </Descriptions.Item>
              )}

              {driver.passport_issued_by && (
                <Descriptions.Item label="Kim tomonidan berilgan">
                  {driver.passport_issued_by}
                </Descriptions.Item>
              )}

              {driver.passport_issued_date && (
                <Descriptions.Item label="Berilgan sana">
                  {formatDate(driver.passport_issued_date)}
                </Descriptions.Item>
              )}

              {driver.passport_birth_date && (
                <Descriptions.Item label="Tug'ilgan sana">
                  {formatDate(driver.passport_birth_date)}
                </Descriptions.Item>
              )}
            </Descriptions>
          </TabPane>

          <TabPane tab="Reyslar" key="trips">
            <div style={{ minHeight: 300 }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16 }}>Ma`lumotlar yuklanmoqda...</div>
                </div>
              ) : driverTrips.length > 0 ? (
                <Table
                  dataSource={driverTrips}
                  columns={tripColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  size="middle"
                />
              ) : (
                <Empty 
                  description="Haydovchi uchun reyslar topilmadi" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </TabPane>

          <TabPane tab="Tarix" key="history">
            <div style={{ minHeight: 300 }}>
              {historyLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16 }}>Tarix ma`lumotlari yuklanmoqda...</div>
                </div>
              ) : driverHistory.length > 0 ? (
                <Table
                  dataSource={driverHistory}
                  columns={historyColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  size="middle"
                  expandable={{
                    expandedRowRender: renderHistoryDetails,
                    expandRowByClick: true,
                  }}
                />
              ) : (
                <Empty 
                  description="Haydovchi uchun tarix ma'lumotlari topilmadi" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <WalletOutlined /> To`lovlar
              </span>
            } 
            key="salaries"
          >
            <div style={{ minHeight: 400 }}>
              <DriverSalaryManager driverId={driver.id} />
            </div>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default DriverDetailsModal; 