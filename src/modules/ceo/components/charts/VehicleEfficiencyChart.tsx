import React, { useState } from 'react';
import { Card, Typography, Radio, Empty, Spin } from 'antd';
import { Bar } from '@ant-design/plots';
import { VehicleEfficiency } from '../../types';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/dataProcessors';

const { Title } = Typography;
const { Group, Button } = Radio;

interface VehicleEfficiencyChartProps {
  data: VehicleEfficiency[];
  loading: boolean;
}

type MetricType = 'fuelEfficiency' | 'maintenanceCost' | 'utilizationRate';

export const VehicleEfficiencyChart: React.FC<VehicleEfficiencyChartProps> = ({ data, loading }) => {
  const [metricType, setMetricType] = useState<MetricType>('utilizationRate');

  if (loading) {
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }
  const formatMetricValue = (type: MetricType, value: number): string => {
    switch (type) {
      case 'fuelEfficiency':
        return `${value.toFixed(2)} mpg`;
      case 'maintenanceCost':
        return formatCurrency(value);
      case 'utilizationRate':
        return `${value.toFixed(2)}%`;
      default:
        return value.toString();
    }
  };

  const getMetricColor = (type: MetricType): string => {
    switch (type) {
      case 'fuelEfficiency':
        return '#1890ff';
      case 'maintenanceCost':
        return '#fa8c16';
      case 'utilizationRate':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };

  // Sort data based on the selected metric
  const sortedData = [...data].sort((a, b) => {
    // For maintenance cost, lower is better (sort ascending)
    if (metricType === 'maintenanceCost') {
      return a[metricType] - b[metricType];
    }
    // For other metrics, higher is better (sort descending)
    return b[metricType] - a[metricType];
  }).slice(0, 10); // Show top 10 vehicles

  const chartConfig = {
    data: sortedData,
    xField: metricType === 'maintenanceCost' ? 'maintenanceCost' : metricType,
    yField: 'vehicleName',
    seriesField: 'vehicleName',
    color: getMetricColor(metricType),
    legend: false,
    barBackground: { style: { fill: 'rgba(0,0,0,0.05)' } },
    interactions: [{ type: 'active-region', enable: false }],
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    label: {
      position: 'right',
      formatter: (item: any) => formatMetricValue(metricType, item[metricType]),
      style: {
        fill: '#666',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.vehicleName,
          value: formatMetricValue(metricType, datum[metricType]),
        };
      },
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 800,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Title level={4} style={{ margin: 0 }}>Vehicle Efficiency</Title>
          <Group value={metricType} onChange={(e) => setMetricType(e.target.value)}>
            <Button value="utilizationRate">Utilization</Button>
            <Button value="fuelEfficiency">Fuel Efficiency</Button>
            <Button value="maintenanceCost">Maintenance</Button>
          </Group>
        </div>
        
        <div style={{ height: '400px' }}>
          {data.length > 0 ? (
            <Bar {...chartConfig} />
          ) : (
            <Empty description="No vehicle data available" />
          )}
        </div>
      </Card>
    </motion.div>
  );
}; 