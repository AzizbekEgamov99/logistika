import React from 'react';
import { Drawer, Descriptions, Tag, Divider, Typography, List, Card, Row, Col, Statistic, Timeline, Empty } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ToolOutlined, CarOutlined, UserOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface VehicleDetailsDrawerProps {
  visible: boolean;
  onClose: () => void;
  vehicle: any;
  trips: any[];
}

export const VehicleDetailsDrawer: React.FC<VehicleDetailsDrawerProps> = ({
  visible,
  onClose,
  vehicle,
  trips
}) => {
  if (!vehicle) return null;
  
  const getStatusTag = (status: string) => {
    if (status === 'active') {
      return <Tag icon={<ClockCircleOutlined />} color="processing">Faol qatnovda</Tag>;
    } else if (status === 'available') {
      return <Tag icon={<CheckCircleOutlined />} color="success">Mavjud</Tag>;
    } else if (status === 'maintenance') {
      return <Tag icon={<ToolOutlined />} color="warning">Ta'mirda</Tag>;
    }
    return <Tag>Noma'lum</Tag>;
  };
  
  const vehicleTrips = trips.filter(trip => {
    if (vehicle.type === 'car') {
      return trip.car === vehicle.id;
    } else {
      return trip.furgon === vehicle.id;
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <Drawer
      title={<><CarOutlined /> {vehicle.nomi || 'Transport vositasi'} ma'lumotlari</>}
      width={600}
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Turi">
          {vehicle.type === 'car' ? 'Avtomobil' : 'Furgon'}
        </Descriptions.Item>
        <Descriptions.Item label="Davlat raqami">
          {vehicle.davlat_raqami || 'Kiritilmagan'}
        </Descriptions.Item>
        <Descriptions.Item label="Model">
          {vehicle.model || 'Kiritilmagan'}
        </Descriptions.Item>
        <Descriptions.Item label="Holati">
          {getStatusTag(vehicle.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Haydovchi">
          <UserOutlined /> {vehicle.driverName}
        </Descriptions.Item>
        <Descriptions.Item label="Bosib o'tilgan masofa">
          {vehicle.kilometer?.toLocaleString() || 0} km
        </Descriptions.Item>
        <Descriptions.Item label="Ishlab chiqarilgan yil">
          {vehicle.ishlab_chiqarilgan_yil || 'Kiritilmagan'}
        </Descriptions.Item>
      </Descriptions>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Jami qatnovlar"
              value={vehicle.tripCount}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Umumiy daromad"
              value={vehicle.totalRevenue?.toLocaleString() || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Samaradorlik"
              value={vehicle.performanceScore || 0}
              suffix="%"
              valueStyle={{ 
                color: vehicle.performanceScore > 80 ? '#3f8600' : 
                       vehicle.performanceScore > 60 ? '#faad14' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Oxirgi qatnovlar</Divider>
      
      {vehicleTrips.length > 0 ? (
        <List
          dataSource={vehicleTrips}
          renderItem={(trip: any) => (
            <List.Item>
              <Card style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div>
                      <EnvironmentOutlined /> Yo`nalish: <strong>{trip.from1 || 'Noma\'lum'} - {trip.to_go || 'Noma\'lum'}</strong>
                    </div>
                    <div>
                      <UserOutlined /> Mijoz: <strong>{trip.client_name || 'Noma\'lum'}</strong>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <DollarOutlined /> Narxi: <strong>{trip.price?.toLocaleString() || 0}</strong>
                    </div>
                    <div>
                      Sana: <strong>{new Date(trip.created_at).toLocaleDateString('uz-UZ')}</strong>
                    </div>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Qatnovlar mavjud emas" />
      )}
    </Drawer>
  );
}; 