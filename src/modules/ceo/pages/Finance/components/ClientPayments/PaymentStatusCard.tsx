import React from 'react';
import { Card, Typography, Statistic, Space } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface PaymentStatusCardProps {
  title: string;
  amount: number;
  description: string;
  type: 'paid' | 'pending' | 'overdue';
  style?: React.CSSProperties;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  title,
  amount,
  description,
  type,
  style,
}) => {
  // Format currency value
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Define icon and color based on payment type
  const getIconAndColor = () => {
    switch (type) {
      case 'paid':
        return {
          icon: <CheckCircleOutlined />,
          color: '#52c41a',
        };
      case 'pending':
        return {
          icon: <ClockCircleOutlined />,
          color: '#1890ff',
        };
      case 'overdue':
        return {
          icon: <ExclamationCircleOutlined />,
          color: '#f5222d',
        };
      default:
        return {
          icon: <CheckCircleOutlined />,
          color: '#52c41a',
        };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: 8, 
        ...style 
      }}
    >
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, color }}>{icon}</span>
          <Text type="secondary">{title}</Text>
        </div>
        <Statistic 
          value={amount} 
          formatter={(value) => formatCurrency(Number(value))}
          valueStyle={{ color }}
        />
        <Text type="secondary">{description}</Text>
      </Space>
    </Card>
  );
};

export default PaymentStatusCard; 