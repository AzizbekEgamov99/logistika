import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Tooltip, message, Popconfirm, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PaymentDetailsModal from './PaymentDetailsModal';
import AddPaymentForm from './AddPaymentForm';
import { Client } from '../../types';

// Define Payment interface
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

interface ClientPaymentsListProps {
  payments: Payment[];
  clients: Client[];
  isLoading: boolean;
  onAddPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  onUpdatePayment: (payment: Payment) => Promise<void>;
  onDeletePayment: (id: string) => Promise<void>;
}

const ClientPaymentsList: React.FC<ClientPaymentsListProps> = ({
  payments,
  clients,
  isLoading,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to find client name by ID
  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Format payment method for display
  const formatPaymentMethod = (method: string): string => {
    const methods: Record<string, string> = {
      'bank': 'Bank Transfer',
      'cash': 'Cash',
      'check': 'Check',
      'card': 'Credit/Debit Card',
    };
    return methods[method] || method;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handler for viewing payment details
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditMode(false);
    setModalVisible(true);
  };

  // Handler for editing a payment
  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditMode(true);
    setModalVisible(true);
  };

  // Handler for deleting a payment
  const handleDeletePayment = async (paymentId: string) => {
    try {
      await onDeletePayment(paymentId);
      message.success('Payment deleted successfully');
    } catch (err) {
      message.error('Failed to delete payment');
    }
  };

  // Handler for saving updated payment
  const handleSavePayment = async (updatedPayment: Payment) => {
    try {
      await onUpdatePayment(updatedPayment);
      message.success('Payment updated successfully');
      setModalVisible(false);
    } catch (err) {
      message.error('Failed to update payment');
    }
  };

  // Handler for adding new payment
  const handleAddPayment = async (newPayment: Omit<Payment, 'id'>) => {
    setError(null);
    try {
      await onAddPayment(newPayment);
      message.success('Payment added successfully');
      return Promise.resolve();
    } catch (err) {
      setError('Failed to add payment. Please try again.');
      return Promise.reject(err);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPayment(null);
  };

  // Table columns
  const columns = [
    {
      title: 'Client',
      dataIndex: 'clientId',
      key: 'client',
      render: (clientId: string) => getClientName(clientId),
      sorter: (a: Payment, b: Payment) => 
        getClientName(a.clientId).localeCompare(getClientName(b.clientId)),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: Payment, b: Payment) => a.amount - b.amount,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a: Payment, b: Payment) => 
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => formatPaymentMethod(method),
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
      render: (status: string) => {
        const colors: Record<string, string> = {
          paid: 'green',
          pending: 'orange',
          overdue: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
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
        <Space size="middle">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewPayment(record)} 
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditPayment(record)} 
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this payment?"
              onConfirm={() => handleDeletePayment(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="Client Payments" bordered={false}>
            <Table
              dataSource={payments}
              columns={columns}
              rowKey="id"
              loading={isLoading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <AddPaymentForm
            clients={clients}
            onSave={handleAddPayment}
            isLoading={isLoading}
            error={error}
          />
        </Col>
      </Row>

      {selectedPayment && (
        <PaymentDetailsModal
          visible={modalVisible}
          payment={selectedPayment}
          clients={clients}
          isEditMode={isEditMode}
          onCancel={handleCloseModal}
          onSave={handleSavePayment}
          setIsEditMode={setIsEditMode}
        />
      )}
    </div>
  );
};

export default ClientPaymentsList; 