import React from 'react';
import { Table, Typography, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowRightOutlined, DollarOutlined, CarOutlined } from '@ant-design/icons';
import { PopularRoute } from '../../hooks/usePopularRoutes';

const { Text } = Typography;

interface PopularRoutesTableProps {
  data: PopularRoute[];
  loading?: boolean;
}

export const PopularRoutesTable: React.FC<PopularRoutesTableProps> = ({ data, loading = false }) => {
  
  // Format number with commas
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat().format(value);
  };

  const columns: ColumnsType<PopularRoute> = [
    {
      title: 'Marshrut',
      dataIndex: 'route',
      key: 'route',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong>{record.from_location}</Text>
          <ArrowRightOutlined style={{ margin: '0 8px', color: '#8c8c8c' }} />
          <Text strong>{record.to_location}</Text>
        </div>
      ),
    },
    {
      title: 'Qatnovlar',
      dataIndex: 'rays_count',
      key: 'rays_count',
      align: 'center',
      render: (rays_count: number) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          <Text strong>{rays_count}</Text>
        </div>
      ),
    },
    {
      title: 'Jami summa',
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'right',
      render: (total_price: number) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <DollarOutlined style={{ marginRight: 6, color: '#52c41a' }} />
          <Text strong>{formatNumber(total_price)} UZS</Text>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data.map((item, index) => ({ ...item, key: index }))}
      pagination={false}
      loading={loading}
      size="middle"
      bordered={false}
      className="popular-routes-table"
    />
  );
}; 