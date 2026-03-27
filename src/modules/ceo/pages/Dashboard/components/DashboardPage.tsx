"use client";
import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress, Table, Spin } from 'antd';
import { 
  UserOutlined, 
  CarOutlined, 
  ShoppingOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { Line } from '@ant-design/charts';
import '../styles/Dashboard.css';
import { cashApi } from '@/modules/accounting/api/cash/cashApi';
import { useQuery } from '@tanstack/react-query';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { summaryMetrics, tripCompletionRate, chartData, loading } = useDashboardData();
  const { data: cashOverview, isLoading } = useQuery(['cashOverview'], cashApi.getCashOverview);
  const lineConfig = {
    data: chartData.revenueData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (v: string) => `${Number(v) / 1000000}M`,
      },
    },
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="ceo-dashboard">
      <Title level={2}>Boshqaruv paneli</Title>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Jami haydovchilar"
              value={summaryMetrics.totalDrivers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Faol: {summaryMetrics.activeDrivers}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avtoparkdagi mashina"
              value={summaryMetrics.totalCars}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Faol: {summaryMetrics.activeCars}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Mijozlar"
              value={summaryMetrics.totalClients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Reyslar"
              value={summaryMetrics.totalTrips}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Faol: {summaryMetrics.activeTrips}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Financial Summary */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Jami daromad"
              value={summaryMetrics.totalRevenue}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="$"
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">So`nggi 30 kun: {summaryMetrics.revenue30Days.toLocaleString()} $</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Jami xarajatlar"
              value={summaryMetrics.totalExpenses}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="$"
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">So`nggi 30 kun: {summaryMetrics.expenses30Days.toLocaleString()} $</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="Sof foyda"
              value={summaryMetrics.profit}
              precision={0}
              valueStyle={{ color: summaryMetrics.profit >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={summaryMetrics.profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="$"
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">So`nggi 30 kun: {summaryMetrics.profit30Days.toLocaleString()} $</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card title="Reyslar yakunlash darajasi">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
              <Progress
                type="dashboard"
                percent={Math.round(tripCompletionRate)}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>{percent}%</div>
                    <div><CheckCircleOutlined /> Yakunlangan</div>
                  </div>
                )}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text>Jami: {summaryMetrics.totalTrips} | Yakunlangan: {summaryMetrics.completedTrips}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Moliyaviy ko'rsatkichlar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
              <Statistic
                title="Oy uchun foyda"
                value={summaryMetrics.profit30Days}
                precision={0}
                valueStyle={{ color: summaryMetrics.profit30Days >= 0 ? '#3f8600' : '#cf1322', fontSize: 24 }}
                prefix={<DollarOutlined />}
                suffix="$"
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text>
                Daromad: {summaryMetrics.revenue30Days.toLocaleString()} | 
                Xarajat: {summaryMetrics.expenses30Days.toLocaleString()} $
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Daromad va xarajatlar dinamikasi">
            {chartData.revenueData.length > 0 && (
              <Line {...lineConfig} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 