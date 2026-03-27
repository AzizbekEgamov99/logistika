import React, { useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { CarOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface MileageChartProps {
  cars: any[];
  furgons: any[];
}

export const MileageChart: React.FC<MileageChartProps> = ({ cars, furgons }) => {
  // Calculate average and total mileage statistics
  const carStats = useMemo(() => {
    const totalMileage = cars.reduce((sum, car) => sum + (car.kilometer || 0), 0);
    const averageMileage = cars.length > 0 ? Math.round(totalMileage / cars.length) : 0;
    const topCar = [...cars].sort((a, b) => (b.kilometer || 0) - (a.kilometer || 0))[0];
    
    return {
      totalMileage,
      averageMileage,
      topCar: topCar || null
    };
  }, [cars]);

  const furgonStats = useMemo(() => {
    const totalMileage = furgons.reduce((sum, furgon) => sum + (furgon.kilometer || 0), 0);
    const averageMileage = furgons.length > 0 ? Math.round(totalMileage / furgons.length) : 0;
    const topFurgon = [...furgons].sort((a, b) => (b.kilometer || 0) - (a.kilometer || 0))[0];
    
    return {
      totalMileage,
      averageMileage,
      topFurgon: topFurgon || null
    };
  }, [furgons]);

  // Prepare data for the chart
  const chartData = [...cars, ...furgons]
    .sort((a, b) => (b.kilometer || 0) - (a.kilometer || 0))
    .slice(0, 10) // Take top 10 vehicles by mileage
    .map(vehicle => ({
      name: vehicle.nomi || `${vehicle.type === 'car' ? 'Avtomobil' : 'Furgon'} #${vehicle.id}`,
      type: vehicle.type === 'car' ? 'Avtomobil' : 'Furgon',
      kilometer: vehicle.kilometer || 0
    }));

  const config = {
    data: chartData,
    xField: 'name',
    yField: 'kilometer',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: 'top',
      style: {
        fill: '#aaa',
        fontSize: 12,
      },
    },
    color: ['#1890ff', '#faad14'],
  };

  return (
    <div className="mileage-chart">
      <Row gutter={[16, 24]}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Avtomobillar umumiy masofasi"
              value={carStats.totalMileage.toLocaleString()}
              suffix="km"
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Furgonlar umumiy masofasi"
              value={furgonStats.totalMileage.toLocaleString()}
              suffix="km"
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Avtomobillar o'rtacha masofasi"
              value={carStats.averageMileage.toLocaleString()}
              suffix="km"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Furgonlar o'rtacha masofasi"
              value={furgonStats.averageMileage.toLocaleString()}
              suffix="km"
            />
          </Card>
        </Col>
      </Row>

      <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
        <TrophyOutlined /> Eng ko`p yurgan transport vositalari (top 10)
      </Title>
      <Column {...config} />

      <style jsx global>{`
        .mileage-chart {
          padding: 10px;
        }
      `}</style>
    </div>
  );
}; 