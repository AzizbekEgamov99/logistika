import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber, Checkbox, Table, message, Space, Tag } from 'antd';
import { useCash } from '../../../hooks/useCash';
import { useCurrencies } from '../../../hooks/useCurrencies';
import { CashTransaction } from '../../../api/cashTransaction';

interface ClientPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  raysId: number | null;
}

const ClientPaymentModal: React.FC<ClientPaymentModalProps> = ({
  visible,
  onClose,
  raysId
}) => {
  const [form] = Form.useForm();
  const { loading, createTransaction, getClientsForRays} = useCash();
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    if (visible && raysId) {
      form.resetFields();
      setSelectedClient(null);
    }
  }, [visible, raysId, form]);

  const handleSubmit = async (values: any) => {
    if (!selectedClient) {
      message.error('Iltimos, mijozni tanlang');
      return;
    }

    try {
      const transactionData: CashTransaction = {
        client: selectedClient.id,
        rays: raysId || undefined,
        amount: values.amount,
        currency: values.currency,
        payment_way: values.payment_way,
        comment: values.comment,
        is_debt: values.is_debt || false,
        is_via_driver: values.is_via_driver || false,
        is_delivered_to_cashier: values.is_delivered_to_cashier || false,
      };

      await createTransaction(transactionData);
      message.success("To'lov muvaffaqiyatli yaratildi");
      form.resetFields();
      setSelectedClient(null);
      onClose();
    } catch (error) {
      console.error('Payment creation error:', error);
      message.error("To'lovni yaratishda xatolik yuz berdi");
    }
  };

  const clientColumns = [
    {
      title: 'Mijoz',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (text: string, record: any) => `${text} ${record.last_name}`,
    },
    {
      title: 'Telefon',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => setSelectedClient(record)}
          disabled={selectedClient?.id === record.id}
        >
          Tanlash
        </Button>
      ),
    },
  ];

  const clients = raysId ? getClientsForRays(raysId) : [];

  return (
    <Modal
      title="Yangi to'lov yaratish"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <h3>Mijozni tanlang</h3>
        <Table
          columns={clientColumns}
          dataSource={clients}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </div>

      {selectedClient && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Tag color="blue">Tanlangan mijoz:</Tag>
              <span>{selectedClient.first_name} {selectedClient.last_name}</span>
            </Space>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              currency: 'USD',
              payment_way: 1,
              is_delivered_to_cashier: true,
            }}
          >
            <Form.Item
              name="amount"
              label="Summa"
              rules={[{ required: true, message: 'Summani kiriting' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Summani kiriting"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              name="currency"
              label="Valyuta"
              rules={[{ required: true, message: 'Valyutani tanlang' }]}
            >
              <Select loading={currenciesLoading}>
                {currencies.length > 0 ? (
                  currencies.map(currency => (
                    <Select.Option key={currency.id} value={currency.currency}>
                      {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
                    </Select.Option>
                  ))
                ) : (
                  <>
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="UZS">UZS</Select.Option>
                    <Select.Option value="RUB">RUB</Select.Option>
                    <Select.Option value="EUR">EUR</Select.Option>
                  </>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="payment_way"
              label="To'lov turi"
              rules={[{ required: true, message: "To'lov turini tanlang" }]}
            >
              <Select>
                <Select.Option value={1}>Naqd</Select.Option>
                <Select.Option value={2}>Karta</Select.Option>
                <Select.Option value={3}>O`tkazma</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="comment"
              label="Izoh"
            >
              <Input.TextArea rows={2} placeholder="Izoh kiriting" />
            </Form.Item>

            <Form.Item name="is_debt" valuePropName="checked">
              <Checkbox>Qarz</Checkbox>
            </Form.Item>

            <Form.Item name="is_via_driver" valuePropName="checked">
              <Checkbox>Haydovchi orqali</Checkbox>
            </Form.Item>

            <Form.Item name="is_delivered_to_cashier" valuePropName="checked">
              <Checkbox>Kassaga topshirilgan</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                To`lovni saqlash
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default ClientPaymentModal; 