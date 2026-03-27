import React from 'react';
import { Table, Space, Button, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '../types';

const { Text } = Typography;

interface FleetTableProps {
  loading: boolean;
  data: Vehicle[];
  onEdit: (record: Vehicle) => void;
  onDelete: (id: string) => void;
  statusColors: Record<string, string>;
  statusNames: Record<string, string>;
}

export const FleetTable: React.FC<FleetTableProps> = ({
  loading,
  data,
  onEdit,
  onDelete,
  statusColors,
  statusNames
}) => {
  const router = useRouter();

  const columns = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Transport turi',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: 'Davlat raqami',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {statusNames[status]}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record: Vehicle) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/modules/ceo/fleet/${record.id}`)}
            size="small"
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Jami ${total} ta transport`,
      }}
    />
  );
}; 