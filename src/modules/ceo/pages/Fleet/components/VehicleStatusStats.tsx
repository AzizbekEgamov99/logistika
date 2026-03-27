import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CarOutlined } from '@ant-design/icons';

interface VehicleStatusStatsProps {
  carCount: number;
  activeCars: number;
  availableCars: number;
  furgonCount: number;
  activeFurgons: number;
  availableFurgons: number;
}

export const VehicleStatusStats: React.FC<VehicleStatusStatsProps> = ({
  carCount,
  activeCars,
  availableCars,
  furgonCount,
  activeFurgons,
  availableFurgons
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={6}>
        <Card className="stat-card">
          <Statistic 
            title="Jami avtomobillar" 
            value={carCount} 
            prefix={<CarOutlined />}
          />
          <div style={{marginTop: '10px'}}>Reysda: {activeCars}</div>
          <div style={{marginTop: '5px'}}>Mavjud: {availableCars}</div>
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="stat-card">
          <Statistic 
            title="Jami furgonlar" 
            value={furgonCount} 
            prefix={<CarOutlined />}
          />
          <div style={{marginTop: '10px'}}>Reysda: {activeFurgons}</div>
          <div style={{marginTop: '5px'}}>Mavjud: {availableFurgons}</div>
        </Card>
      </Col>
    </Row>
  );
}; 