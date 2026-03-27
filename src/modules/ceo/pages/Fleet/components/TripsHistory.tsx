import React, { memo } from 'react';
import { Card, Table, Space, Empty, Tag } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { formatDate } from '../../../utils/formatters';

interface TripsHistoryProps {
  trips: any[];
  loading?: boolean;
}

const TripsHistory = memo(({ trips, loading = false }: TripsHistoryProps) => {
  const columns = [
    {
      title: 'Reys №',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <strong>#{id}</strong>
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date)
    },
  ];

  return (
    <Card 
      title={
        <Space>
          <HistoryOutlined style={{ color: '#1890ff' }} />
          <span>Reyslar tarixi</span>
        </Space>
      }
    >
      {trips && trips.length > 0 ? (
        <Table 
          columns={columns}
          dataSource={trips}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
          bordered
          loading={loading}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Empty description="Reyslar tarixi mavjud emas" />
        </div>
      )}
    </Card>
  );
});

export default TripsHistory; 