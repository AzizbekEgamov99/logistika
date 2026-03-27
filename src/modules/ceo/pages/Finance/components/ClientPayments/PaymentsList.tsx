import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Dropdown,
  Menu,
  Tooltip,
  Typography,
  Popconfirm,
  DatePicker,
  Row,
  Col,
  Card,
  Empty,
  Select,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { Client } from '../../types';
import PaymentDetailsModal from './PaymentDetailsModal';

const { Text } = Typography;
const { RangePicker } = DatePicker;

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

interface PaymentsListProps {
  payments: Payment[];
  clients: Client[];
  loading: boolean;
  onEditPayment: (payment: Payment) => Promise<void>;
  onDeletePayment: (paymentId: string) => Promise<void>;
}

const PaymentsList: React.FC<PaymentsListProps> = ({
  payments,
  clients,
  loading,
  onEditPayment,
  onDeletePayment,
}) => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Format currency with dollar sign and commas
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Handle opening the payment details modal
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditMode(false);
    setDetailsModalVisible(true);
  };

  // Handle opening the payment edit modal
  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditMode(true);
    setDetailsModalVisible(true);
  };

  // Handle payment deletion with confirmation
  const handleDeletePayment = async (paymentId: string) => {
    try {
      await onDeletePayment(paymentId);
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  // Handle saving edited payment
  const handleSavePayment = async (payment: Payment) => {
    await onEditPayment(payment);
    setDetailsModalVisible(false);
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const clientName = getClientName(payment.clientId).toLowerCase();
    const searchLower = searchText.toLowerCase();
    const reference = payment.reference?.toLowerCase() || '';
    const notes = payment.notes?.toLowerCase() || '';
    
    // Filter by search text
    const matchesSearch = 
      searchText === '' || 
      clientName.includes(searchLower) ||
      reference.includes(searchLower) ||
      notes.includes(searchLower) ||
      payment.paymentMethod.toLowerCase().includes(searchLower) ||
      formatCurrency(payment.amount).includes(searchLower);
    
    // Filter by status
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(payment.status);
    
    // Filter by date range
    let matchesDateRange = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const paymentDate = dayjs(payment.date);
      matchesDateRange = paymentDate.isAfter(dateRange[0], 'day') && 
                          paymentDate.isBefore(dateRange[1], 'day');
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Get status tag with appropriate color
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'paid':
        return <Tag color="success">Paid</Tag>;
      case 'pending':
        return <Tag color="warning">Pending</Tag>;
      case 'overdue':
        return <Tag color="error">Overdue</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Get payment method formatted text
  const getPaymentMethod = (method: string) => {
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
        return method;
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'Client',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (clientId: string) => getClientName(clientId),
      sorter: (a: Payment, b: Payment) => {
        const nameA = getClientName(a.clientId);
        const nameB = getClientName(b.clientId);
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong>{formatCurrency(amount)}</Text>
      ),
      sorter: (a: Payment, b: Payment) => a.amount - b.amount,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MM/DD/YYYY'),
      sorter: (a: Payment, b: Payment) => {
        return dayjs(a.date).unix() - dayjs(b.date).unix();
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => getPaymentMethod(method),
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
      render: (reference?: string) => reference || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
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
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" onClick={() => handleViewPayment(record)} icon={<EyeOutlined />}>
                View Details
              </Menu.Item>
              <Menu.Item key="edit" onClick={() => handleEditPayment(record)} icon={<EditOutlined />}>
                Edit
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                key="delete"
                danger
                icon={<DeleteOutlined />}
              >
                <Popconfirm
                  title="Are you sure you want to delete this payment?"
                  onConfirm={() => handleDeletePayment(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  Delete
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by client, amount, etc."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['Start Date', 'End Date']}
            onChange={range => setDateRange(range)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Space>
            <Dropdown
              overlay={
                <Menu
                  multiple
                  selectedKeys={statusFilter}
                  onSelect={({ key }) => setStatusFilter([...statusFilter, key as string])}
                  onDeselect={({ key }) => setStatusFilter(statusFilter.filter(k => k !== key))}
                >
                  <Menu.Item key="paid">Paid</Menu.Item>
                  <Menu.Item key="pending">Pending</Menu.Item>
                  <Menu.Item key="overdue">Overdue</Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button icon={<FilterOutlined />}>
                Filter by Status {statusFilter.length > 0 && `(${statusFilter.length})`}
              </Button>
            </Dropdown>
            <Tooltip title="Export Payments">
              <Button icon={<DownloadOutlined />} />
            </Tooltip>
            <Tooltip title="Sort">
              <Button icon={<SortAscendingOutlined />} />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
        }}
        locale={{
          emptyText: <Empty description="No payments found" />,
        }}
      />

      {selectedPayment && (
        <PaymentDetailsModal
          visible={detailsModalVisible}
          payment={selectedPayment}
          clients={clients}
          onCancel={() => setDetailsModalVisible(false)}
          onSave={handleSavePayment}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      )}
    </Card>
  );
};

export default PaymentsList; 