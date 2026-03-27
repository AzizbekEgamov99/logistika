import React from 'react';
import { Table, Avatar, Typography, Tag, Tooltip } from 'antd';
import { UserOutlined, ShoppingOutlined, CarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;

interface ClientStats {
  id: number;
  clientId: number;
  clientName: string;
  photo?: string | null;
  completedTrips: number;
  pendingTrips: number;
  totalTrips: number;
  totalSpent: number;
  lastOrderDate?: string;
}

interface TopClientsTableProps {
  data: ClientStats[];
  loading?: boolean;
}

export const TopClientsTable: React.FC<TopClientsTableProps> = ({ data, loading = false }) => {
  // Format client name to be shorter if needed
  const formatName = (name: string) => {
    if (!name) return ''; // Null va undefined tekshirish
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return name;
  };

  // Format currency for better display
  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return '0';
    
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} mln`;
    }
    return `${(amount / 1000).toFixed(0)} ming`;
  };

  // Format date for better display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const columns = [
    {
      title: 'Mijoz',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (name: string, record: ClientStats) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            icon={<UserOutlined />}
            src={record.photo}
            size={40}
            style={{ marginRight: 12 }}
          />
          <div>
            <Text strong>{formatName(name)}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.clientId}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Reyslar',
      dataIndex: 'totalTrips',
      key: 'trips',
      render: (total: number, record: ClientStats) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <CarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
            <Text strong>{total}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tooltip title="Yakunlangan">
              <Tag color="success">{record.completedTrips}</Tag>
            </Tooltip>
            {record.pendingTrips > 0 && (
              <Tooltip title="Jarayonda">
                <Tag color="processing">{record.pendingTrips}</Tag>
              </Tooltip>
            )}
          </div>
        </div>
      ),
      sorter: (a: ClientStats, b: ClientStats) => a.totalTrips - b.totalTrips,
    },
    {
      title: 'Xarajatlar',
      dataIndex: 'totalSpent',
      key: 'spent',
      render: (spent: number) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingOutlined style={{ marginRight: 6, color: '#52c41a' }} />
            <Text strong>{formatCurrency(spent)} so`m</Text>
          </div>
        </div>
      ),
      sorter: (a: ClientStats, b: ClientStats) => a.totalSpent - b.totalSpent,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Oxirgi buyurtma',
      dataIndex: 'lastOrderDate',
      key: 'lastOrder',
      render: (date?: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: 6, color: '#722ed1' }} />
          <Text>{formatDate(date)}</Text>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={columns}
        dataSource={data.map(d => ({ ...d, key: d.id }))}
        loading={loading}
        pagination={false}
        className="top-clients-table"
        scroll={{ x: 'max-content' }}
      />

      <style jsx global>{`
        .top-clients-table .ant-table-thead > tr > th {
          background-color: #f7fafc;
          font-weight: 600;
          color: #4b5563;
        }
        
        .top-clients-table .ant-table-tbody > tr:hover > td {
          background-color: #f5f9ff;
        }
        
        .top-clients-table .ant-table-cell {
          padding: 12px 16px;
        }
        
        .ant-tag {
          margin-right: 0;
        }
      `}</style>
    </motion.div>
  );
}; 