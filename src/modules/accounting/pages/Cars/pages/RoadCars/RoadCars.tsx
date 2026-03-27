import React, { useState } from 'react';
import { Card, Table, Tag, Avatar, Space, Typography, Row, Col, Input, Empty, Spin, Button } from 'antd';
import { 
  CarOutlined, 
  SearchOutlined, 
  InfoCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useCarStatus } from '../../../../hooks/useCars';
import { useRouter, usePathname } from 'next/navigation';
import { formatImageUrl } from '@/api/axiosInstance';
import styles from './RoadCars.module.css';

const { Text, Title } = Typography;

const RoadCars = () => {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const pathname = usePathname();
  const [searchText, setSearchText] = useState('');
  const { inRaysCars, isLoading } = useCarStatus();

  const handleCarHistory = (id: number) => {
    const basePath = pathname ? pathname.split('/').slice(0, 3).join('/') : '/modules/accounting';
    if (router) {
      router.push(`${basePath}/cars/${id}/history`);
    } else {
      window.location.href = `${basePath}/cars/${id}/history`;
    }
  };


  const filteredCars = inRaysCars.filter(car => 
    car.name.toLowerCase().includes(searchText.toLowerCase()) ||
    car.car_number.toLowerCase().includes(searchText.toLowerCase()) ||
    car.number.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Avtomobil',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          {record.photo ? (
            <Avatar 
              src={formatImageUrl(record.photo) || undefined}
              shape="square" 
              size={48}
            />
          ) : (
            <Avatar 
              icon={<CarOutlined />} 
              shape="square" 
              size={48}
              style={{ backgroundColor: '#1890ff' }}
            />
          )}
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary">#{record.car_number}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Model',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Holati',
      dataIndex: 'holat',
      key: 'holat',
      render: (holat, record) => (
        <Tag color={record.is_busy ? 'red' : 'green'}>
          {record.is_busy ? "Band" : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Yurgan masofasi',
      dataIndex: 'mileage',
      key: 'mileage',
      render: (kilometer) => `${kilometer} km`,
    },
    {
      title: 'Yil',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary"
          onClick={() => handleCarHistory(record.id)}
          icon={<HistoryOutlined />}
        >
          Tarixni ko`rish
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Ma`lumotlar yuklanmoqda...</Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.roadCarsContainer}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card style={{ marginBottom: 16, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Space>
              <InfoCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <Text strong>Yo`ldagi transportlar</Text>
                <br />
                <Text type="secondary">Reysda bo`lgan transportlar ro`yxati. Jami: {filteredCars.length} ta</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title={<Title level={5}><CarOutlined /> Yo`ldagi transportlar</Title>}
        extra={
          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        }
      >
        {filteredCars.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredCars}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => handleCarHistory(record.id),
              style: { cursor: 'pointer' }
            })}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Yo'ldagi avtotransport vositalari mavjud emas" 
          />
        )}
      </Card>
    </div>
  );
};

export default RoadCars;
