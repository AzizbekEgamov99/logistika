import React from 'react';
import { Card, Radio, Spin, Row, Col } from 'antd';
import { Line } from '@ant-design/charts';
import type { RadioChangeEvent } from 'antd';

interface DataPoint {
  date: string;
  value: number;
  category: string;
}

interface RevenueChartProps {
  data: DataPoint[];
  isLoading?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading = false }) => {
  const [timeRange, setTimeRange] = React.useState<string>('month');

  const handleRangeChange = (e: RadioChangeEvent) => {
    setTimeRange(e.target.value);
  };

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (!data.length) return [];
    
    const currentDate = new Date();
    let filterDate = new Date();
    
    switch (timeRange) {
      case 'week':
        filterDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(currentDate.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        filterDate.setMonth(currentDate.getMonth() - 1);
    }

    return data.filter(item => new Date(item.date) >= filterDate);
  };

  const config = {
    data: getFilteredData(),
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      title: {
        text: 'Revenue (USD)',
      },
      label: {
        formatter: (v: number) => {
          return `$${(v / 1000).toFixed(0)}k`;
        },
      },
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fillOpacity: 0.8,
      },
    },
    smooth: true,
    legend: {
      position: 'top-right',
    },
    tooltip: {
      formatter: (datum: DataPoint) => {
        return { name: datum.category, value: `$${datum.value.toLocaleString()}` };
      },
    },
  };

  return (
    <Card 
      title="Revenue Trends" 
      bordered={false}
      style={{ borderRadius: '8px' }}
      extra={
        <Radio.Group 
          value={timeRange} 
          onChange={handleRangeChange}
          optionType="button" 
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="week">Week</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="quarter">Quarter</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>
      }
    >
      <Spin spinning={isLoading}>
        <Row>
          <Col span={24} style={{ height: '350px' }}>
            {data.length > 0 ? (
              <Line {...config} />
            ) : (
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                No data available
              </div>
            )}
          </Col>
        </Row>
      </Spin>
    </Card>
  );
}; 