'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Table, Tag } from 'antd';
import {
  ToolOutlined,
  ThunderboltOutlined,
  CarOutlined,
  ContainerOutlined,
  DollarCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import axiosInstance from '@/api/axiosInstance';

const { Title, Text } = Typography;

const ZaphosDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [furgons, setFurgons] = useState<any[]>([]);
  const [texnic, setTexnic] = useState<any[]>([]);
  const [optol, setOptol] = useState<any[]>([]);
  const [balon, setBalon] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [totalsRes, carsRes, furgonsRes, texnicRes, optolRes, balonRes] = await Promise.allSettled([
          axiosInstance.get('/service/totals/'),
          axiosInstance.get('/cars/'),
          axiosInstance.get('/furgon/'),
          axiosInstance.get('/texnic/'),
          axiosInstance.get('/optol/'),
          axiosInstance.get('/balon/'),
        ]);

        if (totalsRes.status === 'fulfilled') setTotals(totalsRes.value.data);
        if (carsRes.status === 'fulfilled') setCars(carsRes.value.data?.results || carsRes.value.data || []);
        if (furgonsRes.status === 'fulfilled') setFurgons(furgonsRes.value.data?.results || furgonsRes.value.data || []);
        if (texnicRes.status === 'fulfilled') setTexnic(texnicRes.value.data?.results || texnicRes.value.data || []);
        if (optolRes.status === 'fulfilled') setOptol(optolRes.value.data?.results || optolRes.value.data || []);
        if (balonRes.status === 'fulfilled') setBalon(balonRes.value.data?.results || balonRes.value.data || []);
      } catch (err) {
        console.error('Zaphos dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." fullscreen />;
  }

  const totalsData = totals?.totals || {};

  const texnicColumns = [
    { title: 'Mashina', dataIndex: 'car_name', key: 'car_name', render: (_: any, r: any) => r.car?.name || `Car #${r.car}` },
    { title: 'Narx', dataIndex: 'price', key: 'price', render: (v: number) => v?.toLocaleString() },
    { title: 'Valyuta', dataIndex: 'currency', key: 'currency', render: (_: any, r: any) => r.currency?.currency || 'USD' },
    { title: 'Km', dataIndex: 'kilometer', key: 'kilometer', render: (v: number) => v?.toLocaleString() || '—' },
    { title: 'Sana', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  const carsColumns = [
    { title: 'Nomi', dataIndex: 'name', key: 'name' },
    { title: 'Raqam', dataIndex: 'car_number', key: 'car_number' },
    { title: 'Holat', dataIndex: 'holat', key: 'holat', render: (v: string) => (
      <Tag color={v === 'foal' ? 'green' : v === 'tamirda' ? 'red' : 'orange'}>{v}</Tag>
    )},
    { title: 'Km', dataIndex: 'kilometer', key: 'kilometer', render: (v: number) => v?.toLocaleString() },
    { title: 'Band', dataIndex: 'is_busy', key: 'is_busy', render: (v: boolean) => v ? <Tag color="red">Ha</Tag> : <Tag color="green">Yo'q</Tag> },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        🔧 Zaphos paneli — Texnik xizmat va xarajatlar
      </Title>

      {/* Expense Totals */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Jami (USD)"
              value={totalsData.total || 0}
              precision={2}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Texnic"
              value={totalsData.texnic || 0}
              precision={2}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Optol"
              value={totalsData.optol || 0}
              precision={2}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Balon"
              value={totalsData.balon || 0}
              precision={2}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Balon (Furgon)"
              value={totalsData.balonfurgon || 0}
              precision={2}
              prefix={<ContainerOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card variant="borderless" className="dashboard-stat-card">
            <Statistic
              title="Chiqimlik"
              value={totalsData.chiqimlik || 0}
              precision={2}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Fleet Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card variant="borderless">
            <Statistic
              title="Mashinalar"
              value={cars.length}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                Foal: {cars.filter((c: any) => c.holat === 'foal').length} | 
                Ta'mirda: {cars.filter((c: any) => c.holat === 'tamirda').length} | 
                Kutmoqda: {cars.filter((c: any) => c.holat === 'kutmokda').length}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card variant="borderless">
            <Statistic
              title="Furgonlar"
              value={furgons.length}
              prefix={<ContainerOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Cars Table */}
      <Card title="Mashinalar holati" variant="borderless" style={{ marginBottom: 24 }}>
        <Table
          dataSource={cars}
          columns={carsColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </Card>

      {/* Recent Texnic Records */}
      {texnic.length > 0 && (
        <Card title={`Texnik xizmat yozuvlari (${texnic.length})`} variant="borderless" style={{ marginBottom: 24 }}>
          <Table
            dataSource={Array.isArray(texnic) ? texnic.slice(0, 10) : []}
            columns={texnicColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        </Card>
      )}
    </div>
  );
};

export default ZaphosDashboard;
