import React from 'react';
import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import {
  CarOutlined,
  DollarOutlined,
  RiseOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTripsOverview } from '../../../hooks/useTripsOverview';

interface TripStatsProps {
  activeTripsCount: number;
  historyTripsCount: number;
}

const TripStatsSummary: React.FC<TripStatsProps> = ({
  activeTripsCount,
  historyTripsCount,
}) => {
  // Get overview data from API
  const { data: overview, isLoading: isLoadingOverview } = useTripsOverview();
  
  // Format currency function
  const formatCurrency = (value: number = 0) => {
    return `${value.toLocaleString('uz-UZ')} $`;
  };

  if (isLoadingOverview) {
    return (
      <Row gutter={[16, 16]}>
        {[...Array(6)].map((_, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Jami reyslar"
            value={overview?.rays_count || 0}
            prefix={<CarOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Aktiv reyslar"
            value={activeTripsCount}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Yakunlangan reyslar"
            value={historyTripsCount}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Jami tushum"
            value={formatCurrency(overview?.rays_price || 0)}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Jami foyda/zarar"
            value={formatCurrency(overview?.rays_total_price || 0)}
            prefix={<RiseOutlined />}
            valueStyle={{ color: (overview?.rays_total_price || 0) >= 0 ? '#52c41a' : '#ff4d4f' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Umumiy masofa"
            value={overview?.rays_kilometr || 0}
            suffix="km"
            prefix={<EnvironmentOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default TripStatsSummary; 