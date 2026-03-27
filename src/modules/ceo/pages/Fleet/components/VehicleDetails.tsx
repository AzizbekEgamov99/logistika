import React, { memo } from 'react';
import { Row, Col, Card, Tag, Space, Typography, Image } from 'antd';
import { CarOutlined, KeyOutlined, CalendarOutlined, DashboardOutlined } from '@ant-design/icons';
import { formatNumber } from '../../../utils/formatters';
import { getTransmissionText, getFuelText } from '../../../utils/formatters';
import { formatImageUrl } from '../../../../../api/axiosInstance';

const { Text } = Typography;

interface VehicleDetailsProps {
  vehicle: any;
}

const VehicleDetails = memo(({ vehicle }: VehicleDetailsProps) => {
  if (!vehicle) return null;

  return (
    <Card
      title={
        <Space>
          <KeyOutlined style={{ color: '#1890ff' }} />
          <span>Transport ma'lumotlari</span>
        </Space>
      }
      extra={
        <Tag color={vehicle?.is_busy ? 'red' : 'green'} style={{ fontSize: '14px', padding: '4px 12px' }}>
          {vehicle?.is_busy ? 'Band' : "Bo'sh"}
        </Tag>
      }
    >
      <Row gutter={[24, 24]}>
        {/* Vehicle Image */}
        {vehicle?.photo && (
          <Col xs={24} md={8}>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              marginBottom: '16px' 
            }}>
              <Image 
                src={formatImageUrl(vehicle.photo)} 
                alt={vehicle.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  transition: 'transform 0.3s' 
                }}
                width={300}
                height={225}
              />
            </div>
          </Col>
        )}
        
        {/* Vehicle Details - 2 columns */}
        <Col xs={24} md={vehicle?.photo ? 16 : 24}>
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary"><CarOutlined /> Model:</Text>
                <Text strong>{vehicle?.name}</Text>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Davlat raqami:</Text>
                <Text strong>{vehicle?.car_number}</Text>
              </div>
          
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary"><CalendarOutlined /> Ishlab chiqarilgan:</Text>
                <Text strong>{vehicle?.year} yil</Text>
              </div>
          
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary"><DashboardOutlined /> Kilometr:</Text>
                <Text strong>{formatNumber(vehicle?.mileage || 0)} km</Text>
              </div>
            </Col>
        
            <Col xs={24} md={12}>
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Dvigatel:</Text>
                <Text strong>{vehicle?.engine}</Text>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Transmissiya:</Text>
                <Text strong>{getTransmissionText(vehicle?.transmission)}</Text>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Yoqilg'i turi:</Text>
                <Text strong>{getFuelText(vehicle?.fuel)}</Text>
              </div>
          
              <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Quvvati:</Text>
                <Text strong>{vehicle?.power}</Text>
              </div>
            </Col>
          </Row>
          
          <div style={{ marginTop: '12px' }}>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              Sig'im: {vehicle?.capacity}
            </Tag>
          </div>
        </Col>
      </Row>
    </Card>
  );
});

export default VehicleDetails; 