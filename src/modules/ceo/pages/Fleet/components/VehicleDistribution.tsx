import React from 'react';
import { Pie, Column } from '@ant-design/plots';
import { Row, Col, Typography, Card } from 'antd';
import { Car, Furgon } from '../../../../../types';

const { Title } = Typography;

interface VehicleDistributionProps {
  cars: Car[];
  furgons: Furgon[];
}

export const VehicleDistribution: React.FC<VehicleDistributionProps> = ({ cars, furgons }) => {
  // Calculate vehicle status counts
  const activeCars = cars.filter(car => !car.is_busy && car.holat === 'foal').length;
  const onRoadCars = cars.filter(car => car.is_busy).length;
  const maintenanceCars = cars.filter(car => car.holat === 'tamirda').length;
  const waitingCars = cars.filter(car => car.holat === 'kutmoqda').length;

  const activeFurgons = furgons.filter(furgon => !furgon.is_busy && furgon.holat === 'foal').length;
  const onRoadFurgons = furgons.filter(furgon => furgon.is_busy).length;
  const maintenanceFurgons = furgons.filter(furgon => furgon.holat === 'tamirda').length;
  const waitingFurgons = furgons.filter(furgon => furgon.holat === 'kutmoqda').length;

  // Data for vehicle type pie chart
  const vehicleTypeData = [
    { type: 'Avtomobillar', value: cars.length },
    { type: 'Furgonlar', value: furgons.length },
  ].filter(item => item.value > 0);

  // Data for vehicle status column chart
  const vehicleStatusData = [
    { category: 'Faol', value: activeCars + activeFurgons, type: 'Avtomobillar', color: '#52c41a' },
    { category: 'Faol', value: activeFurgons, type: 'Furgonlar', color: '#52c41a' },
    
    { category: 'Reysda', value: onRoadCars, type: 'Avtomobillar', color: '#1890ff' },
    { category: 'Reysda', value: onRoadFurgons, type: 'Furgonlar', color: '#1890ff' },
    
    { category: 'Tamirda', value: maintenanceCars, type: 'Avtomobillar', color: '#ff4d4f' },
    { category: 'Tamirda', value: maintenanceFurgons, type: 'Furgonlar', color: '#ff4d4f' },
    
    { category: 'Kutishda', value: waitingCars, type: 'Avtomobillar', color: '#faad14' },
    { category: 'Kutishda', value: waitingFurgons, type: 'Furgonlar', color: '#faad14' },
  ].filter(item => item.value > 0);

  // Configuration for vehicle type pie chart
  const pieConfig = {
    data: vehicleTypeData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: datum.type, value: `${datum.value}` };
      },
    },
  };

  // Configuration for vehicle status column chart
  const columnConfig = {
    data: vehicleStatusData,
    isGroup: true,
    xField: 'category',
    yField: 'value',
    seriesField: 'type',
    dodgePadding: 2,
    label: {
      position: 'top',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Title level={5} style={{ marginBottom: 20 }}>Transport vositalari statistikasi</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Transport turlari">
            {vehicleTypeData.length > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                Ma'lumot mavjud emas
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Holat bo'yicha taqsimot">
            {vehicleStatusData.length > 0 ? (
              <Column {...columnConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                Ma'lumot mavjud emas
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default VehicleDistribution; 