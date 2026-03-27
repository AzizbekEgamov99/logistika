'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Table, Tag, Badge } from 'antd';
import {
  WalletOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axiosInstance from '@/api/axiosInstance';

const { Title, Text } = Typography;

const CashierDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [pendingTx, setPendingTx] = useState<any[]>([]);
  const [viaDriverSummary, setViaDriverSummary] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [payPresent, setPayPresent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, pendingRes, viaDriverRes, debtsRes, historyRes, payPresentRes] = await Promise.allSettled([
          axiosInstance.get('/casa/overview/'),
          axiosInstance.get('/casa/?status=pending'),
          axiosInstance.get('/casa/via-driver-summary/'),
          axiosInstance.get('/casa/all-debts/'),
          axiosInstance.get('/casahistory/'),
          axiosInstance.get('/casa/cash-pay-present/'),
        ]);

        if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value.data);
        if (pendingRes.status === 'fulfilled') setPendingTx(pendingRes.value.data?.results || pendingRes.value.data || []);
        if (viaDriverRes.status === 'fulfilled') setViaDriverSummary(viaDriverRes.value.data || []);
        if (debtsRes.status === 'fulfilled') setDebts(debtsRes.value.data || []);
        if (historyRes.status === 'fulfilled') {
          const histData = historyRes.value.data?.results || historyRes.value.data || [];
          setHistory(Array.isArray(histData) ? histData.slice(0, 10) : []);
        }
        if (payPresentRes.status === 'fulfilled') setPayPresent(payPresentRes.value.data);
      } catch (err) {
        console.error('Cashier dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." fullscreen />;
  }

  const cashbox = overview?.cashbox || {};

  const pendingColumns = [
    { title: 'Mijoz', dataIndex: 'client_name', key: 'client_name', render: (_: any, r: any) => r.client?.first_name || 'N/A' },
    { title: 'Haydovchi', dataIndex: 'driver_name', key: 'driver_name', render: (_: any, r: any) => r.driver?.fullname || '—' },
    { title: 'Summa', dataIndex: 'amount', key: 'amount', render: (v: number) => v?.toLocaleString() },
    { title: 'Valyuta', dataIndex: 'currency', key: 'currency', render: (_: any, r: any) => r.currency?.currency || 'USD' },
    { title: 'Holat', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'pending' ? 'orange' : s === 'confirmed' ? 'green' : 'red'}>{s}</Tag>
    )},
  ];

  const viaDriverColumns = [
    { title: 'Haydovchi', dataIndex: 'driver', key: 'driver' },
    { title: 'Mijoz', dataIndex: 'client', key: 'client' },
    { title: 'Summa (USD)', dataIndex: 'amount_in_usd', key: 'amount_in_usd', render: (v: number) => `$${v?.toLocaleString()}` },
    { title: 'Asl summa', dataIndex: 'amount_original', key: 'amount_original', render: (v: number, r: any) => `${v?.toLocaleString()} ${r.currency}` },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        💰 Kassir paneli
      </Title>

      {/* Main Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Kassa (USD)"
              value={cashbox.total_in_usd || 0}
              precision={2}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Badge count={pendingTx.length} offset={[15, 0]}>
              <Statistic
                title="Tasdiqlanmagan"
                value={pendingTx.length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Badge>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Haydovchi orqali"
              value={viaDriverSummary.length}
              prefix={<SwapOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Qarzdorlar"
              value={debts.length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Statistics */}
      {payPresent && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card variant="borderless">
              <Statistic title="Jami mijozlar" value={payPresent.total_clients} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card variant="borderless">
              <Statistic
                title="To'lagan"
                value={payPresent.paid_clients}
                suffix={<Text type="secondary">({payPresent.percent_paid}%)</Text>}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card variant="borderless">
              <Statistic
                title="To'lamagan"
                value={payPresent.unpaid_clients}
                suffix={<Text type="secondary">({payPresent.percent_unpaid}%)</Text>}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Currency Breakdown */}
      <Card title="Valyuta bo'yicha kassa" variant="borderless" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic title="USD" value={cashbox.USD || 0} prefix={<DollarCircleOutlined />} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="EUR" value={cashbox.EUR || 0} prefix="€" />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="RUB" value={cashbox.RUB || 0} prefix="₽" />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="UZS" value={cashbox.UZS || 0} suffix="so'm" />
          </Col>
        </Row>
      </Card>

      {/* Pending Transactions */}
      {pendingTx.length > 0 && (
        <Card title={`Tasdiqlanmagan tranzaksiyalar (${pendingTx.length})`} variant="borderless" style={{ marginBottom: 24 }}>
          <Table
            dataSource={pendingTx}
            columns={pendingColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        </Card>
      )}

      {/* Via Driver Summary */}
      {viaDriverSummary.length > 0 && (
        <Card title="Haydovchilar orqali kelgan pullar" variant="borderless" style={{ marginBottom: 24 }}>
          <Table
            dataSource={viaDriverSummary}
            columns={viaDriverColumns}
            rowKey={(r) => `${r.driver}-${r.client}`}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        </Card>
      )}
    </div>
  );
};

export default CashierDashboard;
