import React from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { DollarOutlined, ToolOutlined, CarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatItem {
  title: string;
  currentValue: number;
  previousValue: number;
  icon: string;
  color: string;
}

interface RevenueStatsProps {
  stats: StatItem[];
  isLoading?: boolean;
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({ stats, isLoading = false }) => {
  // Function to format large numbers with commas
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Function to calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Function to get the appropriate icon based on the icon string
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar':
        return <DollarOutlined />;
      case 'tool':
        return <ToolOutlined />;
      case 'car':
        return <CarOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => {
          const change = calculateChange(stat.currentValue, stat.previousValue);
          const isIncreasing = change >= 0;
          
          return (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card variant="borderless" style={{ borderRadius: '8px' }}>
                <Statistic
                  title={stat.title}
                  value={stat.currentValue}
                  formatter={(value) => formatValue(value as number)}
                  valueStyle={{ color: stat.color }}
                  prefix={getIcon(stat.icon)}
                  suffix={
                    <div style={{ 
                      fontSize: '14px', 
                      color: isIncreasing ? '#52c41a' : '#f5222d',
                      marginLeft: '8px'
                    }}>
                      {isIncreasing ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(change).toFixed(1)}%
                    </div>
                  }
                />
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
                  Previous: {formatValue(stat.previousValue)}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
}; 