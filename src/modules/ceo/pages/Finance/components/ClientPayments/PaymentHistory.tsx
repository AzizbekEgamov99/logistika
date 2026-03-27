import React from 'react';
import { Table, Tag, Typography, Button, Space, Tooltip } from 'antd';
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
  onViewDetails: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status tag color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get payment method label
  const getPaymentMethodLabel = (method: string): string => {
    switch (method) {
      case 'bank':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      case 'check':
        return 'Check';
      case 'card':
        return 'Credit/Debit Card';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: Payment, b: Payment) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>{formatCurrency(amount)}</Text>,
      sorter: (a: Payment, b: Payment) => a.amount - b.amount,
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => getPaymentMethodLabel(method),
      filters: [
        { text: 'Bank Transfer', value: 'bank' },
        { text: 'Cash', value: 'cash' },
        { text: 'Check', value: 'check' },
        { text: 'Credit/Debit Card', value: 'card' },
      ],
      onFilter: (value: string, record: Payment) => record.paymentMethod === value,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (reference: string) => reference || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Pending', value: 'pending' },
        { text: 'Overdue', value: 'overdue' },
      ],
      onFilter: (value: string, record: Payment) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Payment) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<FileTextOutlined />} 
              onClick={() => onViewDetails(record)} 
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record.id)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={payments}
      rowKey="id"
      loading={loading}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
      }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default PaymentHistory; 