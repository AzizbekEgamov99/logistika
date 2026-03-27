import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Row,
  Col,
  Card,
  message,
} from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Client } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

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

interface AddPaymentFormProps {
  clients: Client[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
}

const AddPaymentForm: React.FC<AddPaymentFormProps> = ({
  clients,
  onAddPayment,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Format date string from DatePicker value
      const formattedPayment = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      await onAddPayment(formattedPayment);
      
      // Reset form after successful submission
      form.resetFields();
      message.success('Payment added successfully');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add New Payment" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'paid',
          date: dayjs(),
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="clientId"
              label="Client"
              rules={[{ required: true, message: 'Please select a client' }]}
            >
              <Select
                placeholder="Select client"
                showSearch
                optionFilterProp="children"
                suffixIcon={<UserOutlined />}
              >
                {clients.map(client => (
                  <Option key={client.id} value={client.id}>
                    {client.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
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
                prefix={<DollarOutlined />}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label="Payment Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY-MM-DD"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="paymentMethod"
              label="Payment Method"
              rules={[{ required: true, message: 'Please select payment method' }]}
            >
              <Select 
                placeholder="Select payment method"
                suffixIcon={<CreditCardOutlined />}
              >
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
          <Col xs={24} sm={12}>
            <Form.Item
              name="reference"
              label="Reference ID"
            >
              <Input 
                placeholder="Enter reference number or ID" 
                prefix={<FileTextOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
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

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            icon={<DollarOutlined />}
            size="large"
            block
          >
            Add Payment
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddPaymentForm; 