import React from 'react';
import { Pie, G2 } from '@ant-design/plots';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { CarOutlined, CheckCircleOutlined, SyncOutlined, ToolOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Register theme components
G2.registerTheme('custom-theme', {
  colors10: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#52c41a'],
});

interface VehicleStatusChartProps {
  cars: {
    active: number;
    available: number;
    maintenance: number;
  };
  furgons: {
    active: number;
    available: number;
    maintenance: number;
  };
}

export const VehicleStatusChart: React.FC<VehicleStatusChartProps> = ({ cars, furgons }) => {
  const carData = [
    { type: 'Faol qatnovda', value: cars.active, color: '#1890ff' },
    { type: 'Mavjud', value: cars.available, color: '#52c41a' },
    { type: 'Ta\'mirda', value: cars.maintenance, color: '#faad14' },
  ];

  const furgonData = [
    { type: 'Faol qatnovda', value: furgons.active, color: '#1890ff' },
    { type: 'Mavjud', value: furgons.available, color: '#52c41a' },
    { type: 'Ta\'mirda', value: furgons.maintenance, color: '#faad14' },
  ];

  const totalCars = cars.active + cars.available + cars.maintenance;
  const totalFurgons = furgons.active + furgons.available + furgons.maintenance;

  const config = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' as const },
    theme: 'custom-theme',
  };

  return (
    <div className="vehicle-status-chart">
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card className="chart-card">
            <Title level={5}>Avtomobillar holati</Title>
            <div className="status-indicators">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title={<div><SyncOutlined spin /> Faol</div>}
                    value={cars.active}
                    suffix={`/ ${totalCars}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={<div><CheckCircleOutlined /> Mavjud</div>}
                    value={cars.available}
                    suffix={`/ ${totalCars}`}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={<div><ToolOutlined /> Ta'mirda</div>}
                    value={cars.maintenance}
                    suffix={`/ ${totalCars}`}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
              </Row>
            </div>
            <Pie {...config} data={carData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="chart-card">
            <Title level={5}>Furgonlar holati</Title>
            <div className="status-indicators">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title={<div><SyncOutlined spin /> Faol</div>}
                    value={furgons.active}
                    suffix={`/ ${totalFurgons}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={<div><CheckCircleOutlined /> Mavjud</div>}
                    value={furgons.available}
                    suffix={`/ ${totalFurgons}`}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={<div><ToolOutlined /> Ta'mirda</div>}
                    value={furgons.maintenance}
                    suffix={`/ ${totalFurgons}`}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
              </Row>
            </div>
            <Pie {...config} data={furgonData} />
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .vehicle-status-chart {
          margin-bottom: 24px;
        }
        .chart-card {
          height: 100%;
        }
        .status-indicators {
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}; 