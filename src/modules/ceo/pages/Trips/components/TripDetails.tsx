import React from 'react';
import { Drawer, Descriptions, Tag, Row, Col, Divider, Statistic, Tabs, Card, Space, Typography, Avatar } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Text, Title } = Typography;

interface TripData {
  id: number;
  driverName: string;
  driverId: number;
  clientName: string;
  clientId: number;
  vehicleId: number;
  vehicleNumber: string;
  vehicleType: 'Truck' | 'Furgon';
  startLocation: string;
  endLocation: string;
  startDate: Date;
  endDate: Date | null;
  distance: number;
  price: number;
  expense: number;
  profit: number;
  status: 'completed' | 'in_progress' | 'scheduled' | 'cancelled';
  cargo: string;
  cargoWeight: number;
  notes: string | null;
  country?: string;
  rawData?: any; // Original API data
}

interface TripDetailsProps {
  trip: TripData | null;
  visible: boolean;
  onClose: () => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ 
  trip, 
  visible, 
  onClose 
}) => {
  if (!trip) return null;

  // Function to get status tag
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Yakunlangan
          </Tag>
        );
      case 'in_progress':
        return (
          <Tag color="processing" icon={<LoadingOutlined />}>
            Jarayonda
          </Tag>
        );
      case 'scheduled':
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Rejalashtirilgan
          </Tag>
        );
      case 'cancelled':
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Bekor qilingan
          </Tag>
        );
      default:
        return <Tag>Noma'lum</Tag>;
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} $`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Mavjud emas';
    return new Date(date).toLocaleString('uz-UZ');
  };

  return (
    <Drawer
      title={
        <Space size="middle">
          <CarOutlined /> 
          <span>Reys #{trip.id} batafsil ma'lumoti</span>
        </Space>
      }
      placement="right"
      width={680}
      onClose={onClose}
      open={visible}
    >
      <Tabs defaultActiveKey="general">
        <TabPane tab="Asosiy ma'lumotlar" key="general">
          <Card style={{ marginBottom: 16 }}>
            <Descriptions bordered column={1} size="small" layout="vertical">
              <Descriptions.Item label="Holati">
                {getStatusTag(trip.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Transport vositasi">
                <Space>
                  <CarOutlined />
                  <Text strong>{trip.vehicleNumber}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Turi">
                <Tag color="blue">{trip.vehicleType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Sana">
                <Space direction="vertical">
                  <Space>
                    <CalendarOutlined />
                    <Text>Boshlangan: {formatDate(trip.startDate)}</Text>
                  </Space>
                  {trip.endDate && (
                    <Space>
                      <CalendarOutlined />
                      <Text>Yakunlangan: {formatDate(trip.endDate)}</Text>
                    </Space>
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Yo'nalish">
                <Space direction="vertical">
                  <Space>
                    <EnvironmentOutlined />
                    <Text>Qayerdan: <Text strong>{trip.startLocation}</Text></Text>
                  </Space>
                  <Space>
                    <EnvironmentOutlined />
                    <Text>Qayerga: <Text strong>{trip.endLocation}</Text></Text>
                  </Space>
                  <Space>
                    <Text>Masofa: <Text strong>{trip.distance} km</Text></Text>
                  </Space>
                  {trip.country && (
                    <Space>
                      <Text>Davlat: <Text strong>{trip.country}</Text></Text>
                    </Space>
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Yuk">
                <Space direction="vertical">
                  <Text>{trip.cargo}</Text>
                  {trip.cargoWeight > 0 && (
                    <Text>Og'irligi: {trip.cargoWeight} tonna</Text>
                  )}
                </Space>
              </Descriptions.Item>
              {trip.notes && (
                <Descriptions.Item label="Izohlar">
                  <Space>
                    <FileTextOutlined />
                    <Text>{trip.notes}</Text>
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          <Card title="Client" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="Haydovchi">
                  <Space align="start">
                    <Avatar size={64} icon={<UserOutlined />} />
                    <Space direction="vertical">
                      <Text strong>{trip.driverName}</Text>
                      <Text type="secondary">#{1}</Text>
                    </Space>
                  </Space>
                  <Divider style={{ margin: '12px 0' }} />
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>To'lov: {formatCurrency(trip.rawData?.dr_price || 0)}</Text>
                    <Text>Berilgan: {formatCurrency(trip.rawData?.dr_given || 0)}</Text>
                    <Text>Qoldiq: {formatCurrency((trip.rawData?.dr_price || 0) - (trip.rawData?.dr_given || 0))}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Mijoz">
                  <Space align="start">
                    <Avatar size={64} icon={<TeamOutlined />} />
                    <Space direction="vertical">
                      <Text strong>{trip.clientName}</Text>
                      <Text type="secondary">#{1}</Text>
                    </Space>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card title="Moliyaviy ma'lumotlar">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Narxi"
                  value={trip.price}
                  formatter={(value) => formatCurrency(Number(value))}
                  prefix={<DollarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Xarajat"
                  value={trip.expense}
                  formatter={(value) => formatCurrency(Number(value))}
                  prefix={<DollarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Foyda"
                  value={trip.profit}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ color: trip.profit > 0 ? '#3f8600' : '#cf1322' }}
                  prefix={<DollarOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="Xarajatlar" key="expenses">
          <Card title="Xarajatlar tafsiloti" style={{ marginBottom: 16 }}>
            <Descriptions bordered column={1} layout="vertical">
              <Descriptions.Item label="Haydovchi uchun to'lov">
                {formatCurrency(trip.rawData?.dr_price || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Dispetcher uchun to'lov">
                {formatCurrency(trip.rawData?.dp_price || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Yoqilg'i xarajati (taxminiy)">
                {formatCurrency((trip.distance || 0) * 2000)}
              </Descriptions.Item>
              <Descriptions.Item label="Boshqa xarajatlar">
                {formatCurrency(trip.rawData?.other_expenses || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Jami xarajatlar">
                <Text strong style={{ color: '#cf1322' }}>
                  {formatCurrency(trip.expense)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>
      </Tabs>
    </Drawer>
  );
}; 