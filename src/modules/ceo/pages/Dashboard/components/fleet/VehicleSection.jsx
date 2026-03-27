import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { VehicleStatusCard } from '../../../../components/cards/VehicleStatusCard';

const { Title } = Typography;

const VehicleSection = ({ 
  activeCars, 
  waitingCars, 
  carsInMaintenance, 
  fleetUtilization, 
  activeFurgons, 
  waitingFurgons, 
  furgonUtilization, 
  averageKilometers,
  isLoadingCars,
  isLoadingFurgons,
  viewAll 
}) => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <Title level={4}><CarOutlined /> Transport vositalari</Title>
        <Button type="primary" ghost onClick={() => viewAll('fleet')}>
          Batafsil ko`rish
        </Button>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <VehicleStatusCard
            activeVehicles={activeCars}
            availableVehicles={waitingCars}
            maintenanceVehicles={carsInMaintenance}
            utilizationRate={Math.round(fleetUtilization)}
            averageDistance={averageKilometers}
            loading={isLoadingCars}
            title="Avtomobil holati"
            type="car"
          />
        </Col>
        <Col xs={24} md={12}>
          <VehicleStatusCard
            activeVehicles={activeFurgons}
            availableVehicles={waitingFurgons}
            maintenanceVehicles={0}
            utilizationRate={Math.round(furgonUtilization)}
            loading={isLoadingFurgons}
            title="Furgon holati"
            type="furgon"
          />
        </Col>
      </Row>
    </div>
  );
};

export default VehicleSection; 