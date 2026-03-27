import React, { useState } from 'react';
import { Card, Table, Tag, Avatar, Space, Typography, Row, Col, Input, Empty, Spin } from 'antd';
import { 
  CarOutlined, 
  SearchOutlined, 
  CompassOutlined
} from '@ant-design/icons';
import { useFurgonStatus } from '../../../hooks/useFurgon';
import styles from '../style/furgon.module.css';
import { formatImageUrl } from '@/api/axiosInstance';

const { Text, Title } = Typography;

const RoadFurgons = () => {
  const [searchText, setSearchText] = useState('');
  const { inRaysFurgons, isLoading } = useFurgonStatus();

  const filteredFurgons = inRaysFurgons.filter(furgon => 
    furgon.name.toLowerCase().includes(searchText.toLowerCase()) ||
    furgon.number.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Furgon',
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
              <Text type="secondary">#{record.number}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag color={record.is_busy ? 'red' : 'green'}>
          {record.is_busy ? "Band" : "Bo'sh"}
        </Tag>
      ),
    }
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
    <div className={styles.roadContainer}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card style={{ marginBottom: 16, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Space>
              <CompassOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <Text strong>Yo`ldagi furgonlar</Text>
                <br />
                <Text type="secondary">Reysda bo`lgan furgonlar ro`yxati. Jami: {filteredFurgons.length} ta</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title={<Title level={5}><CarOutlined /> Yo`ldagi furgonlar</Title>}
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
        {filteredFurgons.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredFurgons}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Yo'ldagi furgonlar mavjud emas" 
          />
        )}
      </Card>
    </div>
  );
};

export default RoadFurgons; 