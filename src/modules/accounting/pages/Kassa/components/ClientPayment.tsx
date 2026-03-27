import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, message, Table, Space } from 'antd';
import { useCash } from '../../../hooks/useCash';
import { CashTransaction } from '../../../api/cashTransaction';

interface ClientPaymentProps {
  raysId: number;
  visible: boolean;
  onClose: () => void;
}

const ClientPayment: React.FC<ClientPaymentProps> = ({ raysId, visible, onClose }) => {
  const [form] = Form.useForm();
  const { loading, createTransaction,raysClientsMap } = useCash();
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  useEffect(() => {
    if (visible && raysId) {
      const raysData = raysClientsMap.find(item => item.rays_id === raysId);
      setClients(raysData?.clients || []);
    }
  }, [visible, raysId, raysClientsMap]);

  const handleSubmit = async (values: any) => {
    try {
      const transactionData: CashTransaction = {
        client: selectedClient!,
        rays: raysId,
        amount: Number(values.amount),
        currency: values.currency,
        payment_way: values.payment_way,
        comment: values.comment,
        is_debt: values.is_debt,
        is_via_driver: values.is_via_driver,
        is_delivered_to_cashier: values.is_delivered_to_cashier
      };

      await createTransaction(transactionData);
      message.success('Payment recorded successfully');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Failed to record payment');
      console.error('Error recording payment:', error);
    }
  };

  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => setSelectedClient(record.id)}
            disabled={selectedClient === record.id}
          >
            Select
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Client Payment"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 20 }}>
        <Table 
          columns={columns} 
          dataSource={clients} 
          rowKey="id"
          pagination={false}
        />
      </div>

      {selectedClient && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input the amount!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: 'Please select currency!' }]}
          >
            <Select>
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="UZS">UZS</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="payment_way"
            label="Payment Way"
            rules={[{ required: true, message: 'Please select payment way!' }]}
          >
            <Select>
              <Select.Option value={1}>Cash</Select.Option>
              <Select.Option value={2}>Card</Select.Option>
              <Select.Option value={3}>Bank Transfer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="comment"
            label="Comment"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="is_debt"
            valuePropName="checked"
          >
            <Input type="checkbox" /> Client took on debt
          </Form.Item>

          <Form.Item
            name="is_via_driver"
            valuePropName="checked"
          >
            <Input type="checkbox" /> Payment via driver
          </Form.Item>

          <Form.Item
            name="is_delivered_to_cashier"
            valuePropName="checked"
          >
            <Input type="checkbox" /> Delivered to cashier
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Record Payment
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ClientPayment; 