import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  CarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Car, Furgon } from '../../../../../types';

interface VehicleStatsProps {
  cars: Car[];
  furgons: Furgon[];
}

export const VehicleStats: React.FC<VehicleStatsProps> = ({ cars, furgons }) => {
  // Calculate stats
  const totalCars = cars.length;
  const activeCars = cars.filter(car => car.status === 'active').length;
  const availableCars = cars.filter(car => car.is_available).length;
  const maintenanceCars = cars.filter(car => car.status === 'inactive').length;
  
  const totalFurgons = furgons.length;
  const activeFurgons = furgons.filter(furgon => furgon.status === 'active').length;
  const availableFurgons = furgons.filter(furgon => furgon.is_available).length;
  const maintenanceFurgons = furgons.filter(furgon => furgon.status === 'inactive').length;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Avtomobillar statistikasi" className="vehicle-stats-card">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic 
                title="Jami" 
                value={totalCars} 
                prefix={<CarOutlined />} 
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Faol" 
                value={activeCars} 
                prefix={<CheckCircleOutlined style={{ color: 'green' }} />} 
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Mavjud" 
                value={availableCars} 
                prefix={<CheckCircleOutlined style={{ color: 'blue' }} />} 
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Ta'mirlashda" 
                value={maintenanceCars} 
                prefix={<ToolOutlined style={{ color: 'orange' }} />} 
              />
            </Col>
          </Row>
        </Card>
      </Col>
      
      <Col xs={24} md={12}>
        <Card title="Furgonlar statistikasi" className="vehicle-stats-card">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic 
                title="Jami" 
                value={totalFurgons} 
                prefix={<CarOutlined />} 
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Faol" 
                value={activeFurgons} 
                prefix={<CheckCircleOutlined style={{ color: 'green' }} />} 
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Mavjud" 
                value={availableFurgons} 
                prefix={<CheckCircleOutlined style={{ color: 'blue' }} />} 
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Ta'mirlashda" 
                value={maintenanceFurgons} 
                prefix={<ToolOutlined style={{ color: 'orange' }} />} 
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}; 