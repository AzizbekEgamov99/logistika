import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, InputNumber, Select, message } from 'antd';
import { Client } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface PaymentAddModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddPayment: (values: any) => Promise<void>;
  clients: Client[];
  selectedClientId?: string;
}

const PaymentAddModal: React.FC<PaymentAddModalProps> = ({
  visible,
  onCancel,
  onAddPayment,
  clients,
  selectedClientId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form when modal becomes visible or hidden
  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // If a client is pre-selected, set the client field
      if (selectedClientId) {
        form.setFieldsValue({ clientId: selectedClientId });
      }
    }
  }, [visible, form, selectedClientId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      // Convert date to ISO string
      const paymentData = {
        ...values,
        date: values.date.toISOString(),
      };
      
      await onAddPayment(paymentData);
      
      message.success('Payment added successfully');
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Failed to add payment:', error);
      message.error('Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Payment"
      open={visible}
      onCancel={onCancel}
      forceRender={true}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Add Payment
        </Button>,
      ]}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          clientId: selectedClientId,
          date: dayjs(),
          paymentMethod: 'bank',
        }}
      >
        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: 'Please select a client' }]}
        >
          <Select
            placeholder="Select a client"
            disabled={!!selectedClientId}
            showSearch
            optionFilterProp="children"
          >
            {clients.map((client) => (
              <Option key={client.id} value={client.id}>
                {client.name} ({client.company})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter the payment amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            placeholder="Enter payment amount"
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Payment Date"
          rules={[{ required: true, message: 'Please select the payment date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select payment method' }]}
        >
          <Select placeholder="Select payment method">
            <Option value="cash">Cash</Option>
            <Option value="bank">Bank Transfer</Option>
            <Option value="check">Check</Option>
            <Option value="card">Credit/Debit Card</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reference"
          label="Reference/Transaction ID"
        >
          <Input placeholder="Enter reference number or transaction ID" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={4} placeholder="Add any additional notes about this payment" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentAddModal; 