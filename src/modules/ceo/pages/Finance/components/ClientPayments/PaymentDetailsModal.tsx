import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Typography,
  Button,
  Divider,
  Row,
  Col,
  Descriptions,
  Tag,
  message,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LockOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Client } from '../../types';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

interface PaymentDetailsModalProps {
  visible: boolean;
  payment: Payment;
  clients: Client[];
  onCancel: () => void;
  onSave: (payment: Payment) => Promise<void>;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  visible,
  payment,
  clients,
  onCancel,
  onSave,
  editMode,
  setEditMode,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form when payment changes
  useEffect(() => {
    if (payment) {
      form.setFieldsValue({
        clientId: payment.clientId,
        amount: payment.amount,
        date: payment.date ? dayjs(payment.date) : null,
        paymentMethod: payment.paymentMethod,
        reference: payment.reference,
        status: payment.status,
        notes: payment.notes,
      });
    }
  }, [payment, form]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

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

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Format date string from DatePicker value
      const formattedValues = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : '',
      };

      // Merge with original payment data
      const updatedPayment = {
        ...payment,
        ...formattedValues,
      };

      await onSave(updatedPayment);
      setEditMode(false);
      message.success('Payment updated successfully');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodOptions = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'card', label: 'Credit/Debit Card' },
  ];

  const statusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return (
    <Modal
      visible={visible}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>{editMode ? 'Edit Payment' : 'Payment Details'}</Title>
          {!editMode ? (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          ) : (
            <Button 
              icon={<CloseOutlined />} 
              onClick={() => setEditMode(false)}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      }
      onCancel={onCancel}
      footer={editMode ? [
        <Button key="cancel" onClick={() => setEditMode(false)}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>,
      ] : [
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={700}
    >
      {editMode ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            clientId: payment.clientId,
            amount: payment.amount,
            date: payment.date ? dayjs(payment.date) : null,
            paymentMethod: payment.paymentMethod,
            reference: payment.reference,
            status: payment.status,
            notes: payment.notes,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="clientId"
                label="Client"
                rules={[{ required: true, message: 'Please select a client' }]}
              >
                <Select
                  placeholder="Select client"
                  showSearch
                  optionFilterProp="children"
                >
                  {clients.map(client => (
                    <Option key={client.id} value={client.id}>
                      {client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                  step={0.01}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Payment Date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
              >
                <Select placeholder="Select payment method">
                  {paymentMethodOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="reference"
                label="Reference ID"
              >
                <Input placeholder="Enter reference number or ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea
              placeholder="Add any additional payment notes"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      ) : (
        <>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Payment ID" span={2}>
              <Text code>{payment.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Client">
              <Text strong>{getClientName(payment.clientId)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Text type="success" strong>{formatCurrency(payment.amount)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {dayjs(payment.date).format('MMMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(payment.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {getPaymentMethod(payment.paymentMethod)}
            </Descriptions.Item>
            <Descriptions.Item label="Reference ID">
              {payment.reference || <Text type="secondary">No reference provided</Text>}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Additional Information</Divider>
          
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 4 }}>
            <Title level={5}>Notes</Title>
            <p>{payment.notes || 'No notes available'}</p>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PaymentDetailsModal;

// CSS for the component can be added to your global CSS or as a styled component
// .detail-item {
//   margin-bottom: 16px;
// } 