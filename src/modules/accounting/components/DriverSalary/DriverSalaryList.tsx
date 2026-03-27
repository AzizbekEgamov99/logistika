import React, { useState } from 'react';
import { Table, Card, Button, Space, Input, DatePicker, Typography, Tag, Badge } from 'antd';
import { PlusOutlined, SearchOutlined, DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useDriverSalaries } from '../../hooks/useDriverSalary';
import DriverSalaryModal from './DriverSalaryModal';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const DriverSalaryList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { driverSalaries, loading } = useDriverSalaries();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const filteredData = driverSalaries.filter((item) => {
    const matchesSearch = item.driver_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = !dateRange[0] || !dateRange[1] || (
      dayjs(item.paid_at).isAfter(dateRange[0]) &&
      dayjs(item.paid_at).isBefore(dateRange[1])
    );
    return matchesSearch && matchesDate;
  });

  const columns = [
    {
      title: <span style={{ fontSize: 20, fontWeight: 700 }}>№</span>,
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Text style={{ color: '#8c8c8c' }}>{index + 1}</Text>
      )
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 700 }}>Haydovchi</span>,
      dataIndex: 'driver_name',
      key: 'driver_name',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <Text style={{ fontSize: 20 }} strong>{text}</Text>
        </div>
      )
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 700 }}>Miqdor</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <span style={{ fontWeight: 600, fontSize: 20 }}>
          {Number(amount).toLocaleString()}
        </span>
      )
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 700 }}>Valyuta</span>,
      dataIndex: 'currency_name',
      key: 'currency_name',
      render: (currency: string) => (
        <Tag color={currency === 'USD' ? 'blue' : currency === 'UZS' ? 'green' : 'orange'} style={{ fontSize: 16 }}>
          {currency}
        </Tag>
      )
    },
    {
      title: <span style={{ fontSize: 20, fontWeight: 700 }}>Sana</span>,
      dataIndex: 'paid_at',
      key: 'paid_at',
      render: (date: string) => (
        <span style={{ display: 'flex', alignItems: 'center', height: 32, width: '100%', fontSize: 20 }}>
          <CalendarOutlined style={{ color: '#722ed1', fontSize: 20, marginRight: 8 }} />
          <span style={{ fontSize: 20 }}>{dayjs(date).format('DD.MM.YYYY HH:mm')}</span>
        </span>
      )
    },
  ];

  return (
    <div className="driver-salary-page" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        className="driver-salary-card"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>
            Haydovchilar To`lovlari
          </Title>
          <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
            Barcha haydovchilarga qilingan to'lovlar ro'yxati
          </Text>
        </div>

        <Space 
          style={{ 
            marginBottom: '24px', 
            width: '100%', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <Space size="middle" style={{ flexWrap: 'wrap', gap: '16px' }}>
            <Input
              placeholder="Haydovchi nomi bo`yicha qidirish"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <RangePicker
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
              style={{ width: 300 }}
              placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            />
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            size="large"
          >
            To`lov qo`shish
          </Button>
        </Space>

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami ${total} ta to'lov`,
            showQuickJumper: true
          }}
          bordered={false}
          size="middle"
          className="driver-salary-table"
          style={{ marginTop: '16px' }}
        />
      </Card>

      <DriverSalaryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
        }}
      />
    </div>
  );
};

export default DriverSalaryList; 