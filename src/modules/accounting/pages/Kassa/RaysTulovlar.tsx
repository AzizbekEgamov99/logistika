import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  message,
  Badge,
  Collapse,
  Tabs,
  Row,
  Col,
  Divider,
  Checkbox
} from 'antd';
import {
  SearchOutlined,
  DollarOutlined,
  CarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/axiosInstance';

const { Option } = Select;

interface Currency {
  id: number;
  currency: string;
  rate_to_uzs: string;
  updated_at: string;
}

interface Client {
  company: string;
  id: number;
  first_name: string;
  total_expected_amount_usd?: number;
  casa_paid?: number;
  total_remaining_usd?: number;
}

interface RaysClientsMap {
  rays_id: number;
  clients: Client[];
}

interface RaysPayment {
  id?: number | string;
  client: number;
  rays: number;
  amount: number;
  amount_in_usd?: string;
  currency: number; // Changed from string to number to match API expectation
  payment_way: number | string;
  payment_way_name?: string;
  comment?: string;
  is_debt?: boolean;
  is_via_driver?: boolean;
  is_delivered_to_cashier?: boolean;
  total_expected_amount?: number;
  paid_amount?: number;
  created_at?: string;
  status?: string;
  client_name?: string;
  product?: number;
  driver?: number;
  custom_rate_to_uzs: string;
}

// Form values for payment creation
interface PaymentFormValues {
  amount: number;
  currency: string;
  payment_way: number;
  comment?: string;
  is_debt?: boolean;
  is_via_driver?: boolean;
  is_delivered_to_cashier?: boolean;
  driver?: number;
  custom_rate_to_uzs: string;
}

interface Driver {
  id: number;
  fullname: string;
  phone_number: string;
}

interface PaymentCategory {
  id: number;
  name: string;
}

const RaysTulovlar: React.FC = () => {
  const [raysData, setRaysData] = useState<RaysClientsMap[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRays, setSelectedRays] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState<boolean>(false);
  const [paymentForm] = Form.useForm();
  const [activeRaysPayments, setActiveRaysPayments] = useState<RaysPayment[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[]>([]);
  const [paymentCategoriesLoading, setPaymentCategoriesLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setCurrenciesLoading(true);
        const response = await axiosInstance.get('/currency/');
        // Ensure we're correctly handling the API response
        if (response.data && Array.isArray(response.data)) {
          setCurrencies(response.data);
        } else {
          console.error('Unexpected currency data format:', response.data);
          message.error('Valyuta ma\'lumotlari noto\'g\'ri formatda');
          // Empty array instead of fallback values
          setCurrencies([]);
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
        message.error('Valyuta ma\'lumotlarini yuklashda xatolik yuz berdi');
        // Empty array instead of fallback values
        setCurrencies([]);
      } finally {
        setCurrenciesLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axiosInstance.get('/customusers/?status=driver');
        setDrivers(response.data || []);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setDrivers([]); // Default empty array
      }
    };

    fetchDrivers();
  }, []);

  // Fetch payment categories
  useEffect(() => {
    const fetchPaymentCategories = async () => {
      try {
        setPaymentCategoriesLoading(true);
        const response = await axiosInstance.get('/casacategory/');
        setPaymentCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching payment categories:', error);
        // Default fallback
        setPaymentCategories([{ id: 1, name: 'cash' }]);
      } finally {
        setPaymentCategoriesLoading(false);
      }
    };

    fetchPaymentCategories();
  }, []);

  // Fetch rays-clients mapping
  const fetchRaysClientsMap = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/casa/rays-clients-map/');
      console.log('Rays-Clients Map Response:', response.data);
      // Only keep rays that have clients (active rays)
      const activeRays = response.data.filter((rays: RaysClientsMap) => rays.clients.length > 0);
      setRaysData(activeRays);
    } catch (error) {
      message.error('Reys-mijoz ma\'lumotlarini yuklashda xatolik yuz berdi');
      console.error('Error fetching rays-clients map:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing payments for active rays
  const fetchActiveRaysPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/casa/');
      console.log('Active Rays Payments Response:', response.data);
      setActiveRaysPayments(response.data);
    } catch (error) {
      message.error('To\'lovlar ma\'lumotlarini yuklashda xatolik yuz berdi');
      console.error('Error fetching active rays payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchRaysClientsMap();
      fetchActiveRaysPayments();
    }
  }, [isClient]);

  // Helper function to convert currency code to ID
  const getCurrencyIdByCode = (code: string): number => {
    const currency = currencies.find(c => c.currency === code);
    return currency ? currency.id : 1;
  };

  // Helper function to get currency name by ID
  const getCurrencyNameById = (currencyId: number): string => {
    const currency = currencies.find(c => c.id === currencyId);
    return currency ? currency.currency : currencyId.toString();
  };

  // Fix InputNumber parser return type
  const inputParser = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace(/\$\s?|(,*)/g, ''));
  };

  const handleCreatePayment = async (values: PaymentFormValues) => {
    if (!selectedRays || !selectedClient) {
      message.error('Reys yoki mijoz tanlanmagan');
      return;
    }

    // Simplified payment data structure that matches the API requirements
    const paymentData: RaysPayment = {
      client: selectedClient.id,
      rays: selectedRays,
      amount: values.amount,
      amount_in_usd: values.amount.toString(),
      currency: getCurrencyIdByCode(values.currency || 'USD'),
      payment_way: values.payment_way,
      comment: values.comment || '',
      is_debt: values.is_debt || false,
      is_via_driver: values.is_via_driver || false,
      is_delivered_to_cashier: values.is_delivered_to_cashier || false,
      custom_rate_to_uzs: values.custom_rate_to_uzs.toString()
    };

    console.log('Payment Data being sent:', paymentData);

    // Only add driver field if a valid driver is selected
    if (values.driver) {
      paymentData.driver = values.driver;
    }

    // API ga yuboramiz
    setLoading(true);
    try {
      const response = await axiosInstance.post('/casa/', paymentData);
      console.log('Payment Creation Response:', response.data);
      message.success('To\'lov muvaffaqiyatli qo\'shildi');
      paymentForm.resetFields();
      setIsPaymentModalVisible(false);
      // Refresh data
      fetchActiveRaysPayments();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      let errorMessage = 'To\'lov qo\'shishda xatolik yuz berdi';
      if (error.response && error.response.data) {
        console.log('Error Response Data:', error.response.data);
        const responseData = error.response.data;
        if (typeof responseData === 'object') {
          // Extract specific validation errors
          const errors = Object.entries(responseData)
            .map(([field, messages]) => `${field}: ${messages}`)
            .join(', ');
          errorMessage = `Xatolik: ${errors}`;
        } else if (responseData.detail) {
          errorMessage = `Xatolik: ${responseData.detail}`;
        }
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Prepare tabs for collapse panels
  const getClientsTabs = (rays: RaysClientsMap) => {
    return [
      {
        key: 'clients',
        label: (
          <span>
            <UserOutlined /> Mijozlar bo&apos;yicha to&apos;lovlar
          </span>
        ),
        children: (
          <Row gutter={[16, 16]}>
            {rays.clients.map(client => {
              // Mijozga tegishli to'lovlar
              const clientPayments = activeRaysPayments
                .filter(payment => payment.rays === rays.rays_id && payment.client === client.id)
                .map((payment, index) => ({
                  ...payment,
                  id: payment.id || `temp-client-payment-${index}`
                }));

              const expectedAmount = client.total_expected_amount_usd || 0;
              const totalPaid = client.casa_paid || clientPayments.reduce((sum, payment) => sum + payment.amount, 0);
              const remainingDebt = client.total_remaining_usd !== undefined ? client.total_remaining_usd : expectedAmount - totalPaid;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={`client-col-${client.id}`}>
                  <Card
                    title={
                      <Space>
                        <UserOutlined />
                        {client.company}
                      </Space>
                    }
                    className="client-payment-card"
                  >
                    <p>
                      <strong>Kelishilgan summa:</strong>{' '}
                      <span style={{ color: '#1890ff' }}>
                        ${expectedAmount?.toLocaleString() || 'Belgilanmagan'}
                      </span>
                    </p>
                    <p>
                      <strong>To&apos;langan:</strong>{' '}
                      <span style={{ color: '#52c41a' }}>
                        ${totalPaid.toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <strong>Qolgan qarz:</strong>{' '}
                      <span style={{ color: '#f5222d' }}>
                        ${remainingDebt.toLocaleString()}
                      </span>
                    </p>
                    <Divider />
                    <Button
                      type="primary"
                      icon={<DollarOutlined />}
                      onClick={() => {
                        setSelectedRays(rays.rays_id);
                        setSelectedClient(client);
                        setIsPaymentModalVisible(true);
                      }}
                      block
                    >
                      To&apos;lov qo&apos;shish
                    </Button>

                    {clientPayments.length > 0 && (
                      <>
                        <Divider>To&apos;lovlar tarixi</Divider>
                        {clientPayments.map((payment, index) => (
                          <div key={payment.id ? `payment-${payment.id}` : `payment-index-${index}`} className="payment-history-item">
                            <p>
                              <Tag color="green">{payment.payment_way_name || 'Naqd'}</Tag>
                              <span style={{ marginLeft: 8 }}>
                                {payment.amount} {getCurrencyNameById(payment.currency)}
                              </span>
                              <span style={{ float: 'right', color: '#8c8c8c', fontSize: 12 }}>
                                {new Date(payment.created_at).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )
      },
      {
        key: 'history',
        label: (
          <span>
            <ClockCircleOutlined /> To&apos;lovlar tarixi
          </span>
        ),
        children: (
          <Table
            dataSource={activeRaysPayments
              .filter(payment => payment.rays === rays.rays_id)
              .map((payment, index) => ({
                ...payment,
                id: payment.id || `temp-payment-${index}`
              }))}
            rowKey={(record) => `payment-history-${record.id}`}
            pagination={false}
            columns={[
              {
                title: 'Sana',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date: string) => new Date(date).toLocaleDateString(),
              },
              {
                title: 'Mijoz',
                dataIndex: 'client_name,',
                key: 'client_name',
              },
              {
                title: 'Summa',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount: number, record: RaysPayment) => (
                  <span style={{ color: '#52c41a' }}>
                    {amount} {getCurrencyNameById(record.currency)}
                  </span>
                ),
              },
              {
                title: "To'lov turi",
                dataIndex: 'payment_way_name',
                key: 'payment_way_name',
                render: (paymentWay: string) => (
                  <Tag color="blue">{paymentWay}</Tag>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={status === 'pending' ? 'orange' : 'green'}>
                    {status === 'pending' ? 'Kutilmoqda' : 'Tasdiqlangan'}
                  </Tag>
                ),
              },
              {
                title: 'Izoh',
                dataIndex: 'comment',
                key: 'comment',
                render: (comment: string) => comment || '-',
              },
            ]}
          />
        )
      }
    ];
  };

  return (
    <div className="rays-payments">
      {isClient ? (
        <Card
          title={
            <Space>
              <CarOutlined />
              Aktiv reyslar bo`yicha to&apos;lovlar
            </Space>
          }
          extra={
            <Button
              type="primary"
              onClick={() => {
                fetchRaysClientsMap();
                fetchActiveRaysPayments();
              }}
              loading={loading}
            >
              Yangilash
            </Button>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Reys ID yoki mijoz nomi bo'yicha qidirish"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          <Collapse
            expandIconPosition="end"
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
            items={raysData.map(rays => ({
              key: `rays-${rays.rays_id}`,
              label: (
                <Space>
                  <Badge count={rays.clients.length} style={{ backgroundColor: '#108ee9' }}>
                    <Tag icon={<CarOutlined />} color="blue">Reys #{rays.rays_id}</Tag>
                  </Badge>
                  <span>Mijozlar: </span>
                  {rays.clients.map(client => (
                    <Tag key={`client-tag-${client.id}`} icon={<UserOutlined />}>{client.company}</Tag>
                  ))}
                </Space>
              ),
              children: (
                <Tabs defaultActiveKey="clients" type="card" items={getClientsTabs(rays)} />
              )
            }))}
          />
          {raysData.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <InfoCircleOutlined style={{ fontSize: 24, color: '#ccc' }} />
              <p>Aktiv reyslar topilmadi yoki filter bo&apos;yicha mos reyslar yo&apos;q</p>
            </div>
          )}

          <Modal
            title={`${selectedClient?.first_name || ''} - To'lov qo'shish`}
            open={isPaymentModalVisible}
            onCancel={() => setIsPaymentModalVisible(false)}
            footer={null}
            destroyOnHidden
            forceRender={true}
          >
            {selectedClient && (
              <div style={{ marginBottom: 16 }}>
                <span>Mijoz: </span>
                <Tag icon={<UserOutlined />}>{selectedClient.first_name}</Tag>
                <span style={{ marginLeft: 8 }}>Reys ID: </span>
                <Tag icon={<CarOutlined />} color="blue">#{selectedRays}</Tag>
              </div>
            )}

            <Form
              form={paymentForm}
              layout="vertical"
              initialValues={{
                currency: 'USD',
                payment_way: paymentCategories.length > 0 ? paymentCategories[0].id : 1,
                is_debt: false,
                is_via_driver: false,
                is_delivered_to_cashier: false
              }}
              onFinish={handleCreatePayment}
            >
              <Form.Item
                name="amount"
                label="To'lov summasi"
                rules={[{ required: true, message: 'Iltimos, to\'lov summasini kiriting' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="To'lov miqdori"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={inputParser}
                />
              </Form.Item>

              <Form.Item
                name="currency"
                label="Valyuta"
                rules={[{ required: true, message: 'Iltimos, valyutani tanlang' }]}
              >
                {currenciesLoading ? (
                  <div>Loading currencies...</div>
                ) : (
                  <Select onChange={(value) => {
                    const selectedCurrency = currencies.find(c => c.currency === value);
                    if (selectedCurrency) {
                      const amount = paymentForm.getFieldValue('amount');
                      if (amount) {
                        paymentForm.setFieldsValue({
                          custom_rate_to_uzs: selectedCurrency.rate_to_uzs
                        });
                      }
                    }
                  }}>
                    {currencies.map(currency => (
                      <Option key={`currency-${currency.id}`} value={currency.currency}>
                        {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                name="custom_rate_to_uzs"
                label="Valyuta kursi"
                rules={[{ required: true, message: 'Iltimos, valyuta kursini kiriting' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Valyuta kursi"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="payment_way"
                label="To'lov usuli"
                rules={[{ required: true, message: 'Iltimos, to\'lov usulini tanlang' }]}
              >
                {paymentCategoriesLoading ? (
                  <div>To`lov usullari yuklanmoqda...</div>
                ) : (
                  <Select>
                    {paymentCategories.map(category => (
                      <Option key={`payment-way-${category.id}`} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="is_debt"
                    valuePropName="checked"
                  >
                    <Checkbox>
                      Qarz sifatida
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="is_via_driver"
                    valuePropName="checked"
                  >
                    <Checkbox>
                      Haydovchi orqali
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="comment"
                label="Izoh"
              >
                <Input.TextArea rows={2} placeholder="Izoh qoldiring..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  To`lovni saqlash
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Yuklanmoqda...</p>
        </div>
      )}

      <style jsx global>{`
        .client-payment-card {
          height: 100%;
          transition: all 0.3s;
        }
        
        .client-payment-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }
        
        .payment-history-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .payment-history-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default RaysTulovlar; 
