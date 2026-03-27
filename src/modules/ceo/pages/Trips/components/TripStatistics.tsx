import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  CarOutlined,
  DollarOutlined,
  RiseOutlined,
  EnvironmentOutlined,
  ExpenseOutlined,
} from '@ant-design/icons';
import { formatPrice } from '../../../../../utils/formatCurrency';

interface TripStatisticsProps {
  totalTrips: number;
  totalRevenue: number; // always in USD
  totalExpense: number; // mixed or converted to USD
  totalProfit: number; // always in USD
  avgDistance: number;
  expenses?: {
    total_usd?: number;
    [key: string]: any;
  };
}

export const TripStatistics: React.FC<TripStatisticsProps> = ({
  totalTrips,
  totalRevenue,
  totalExpense,
  totalProfit,
  avgDistance,
  expenses
}) => {
  return (
    <Row gutter={[16, 16]} className="statistics-row">
      <Col xs={24} sm={12} md={6}>
        <Card className="statistic-card">
          <Statistic
            title="Jami reyslar"
            value={totalTrips}
            prefix={<CarOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="statistic-card">
          <Statistic
            title="Jami tushum (USD)"
            value={formatPrice(totalRevenue, 'rays_price', 'USD')}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="statistic-card">
          <Statistic
            title="Jami xarajat (USD)"
            value={formatPrice(expenses?.total_usd || totalExpense, 'total_usd', 'USD')}
            prefix={<ExpenseOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="statistic-card">
          <Statistic
            title="Sof foyda (USD)"
            value={formatPrice(totalProfit, 'profit', 'USD')}
            prefix={<RiseOutlined />}
            valueStyle={{ color: totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="statistic-card">
          <Statistic
            title="O'rtacha masofa"
            value={avgDistance.toFixed(0)}
            suffix="km"
            prefix={<EnvironmentOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default TripStatistics; 