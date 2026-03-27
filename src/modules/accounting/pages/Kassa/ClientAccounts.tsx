import React, { useEffect, useState } from 'react';
import {
  Table, Card, Button, Space, Tag, Tooltip, Modal, Form,
  Input, Row, Col, Statistic,
  Typography, Empty, message, InputNumber, Select
} from 'antd';
import {
  EyeOutlined, DollarOutlined, SearchOutlined, FilterOutlined,
  UserOutlined,
  FallOutlined, ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ReloadOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/axiosInstance';
import { formatMoney } from '@/utils/format';

const { Title } = Typography;
const { Option } = Select;

interface ClientDebt {
  client_id: number;
  fullname: string;
  client_company: string;
  expected_usd: number;
  paid_usd: number;
  remaining_usd: number;
}
interface PaymentHistory {
  id: number;
  client_name: string;
  payment_name: string;
  driver_name: string | null;
  amount: number;
  amount_in_usd: string;
  status: string;
  comment: string;
  is_via_driver: boolean;
  is_confirmed_by_cashier: boolean;
  is_delivered_to_cashier: boolean;
  total_expected_amount: number;
  paid_amount: number;
  remaining_debt: number;
  is_debt: boolean;
  created_at: string;
  moved_at: string;
  client: number;
  rays: number;
  rays_history: number | null;
  product: number | null;
  driver: number | null;
  currency: number;
  payment_way: number;
  cashier: number | null;
}

interface Currency {
  id: number;
  currency: string;
  rate_to_uzs: string;
}

const ClientAccounts: React.FC = () => {
  const [debts, setDebts] = useState<ClientDebt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<ClientDebt[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [clientHistory, setClientHistory] = useState<PaymentHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<{ id: number, name: string }[]>([]);

  // Filter states
  const [searchValue, setSearchValue] = useState('');

  // Stats
  const [totalStats, setTotalStats] = useState({
    totalClients: 0,
    totalDebt: 0,
    totalPaid: 0,
    averageDebt: 0,
    topDebtors: [] as ClientDebt[]
  });

  const [refreshing, setRefreshing] = useState(false);

  // Fetch currencies from backend
  const fetchCurrencies = async () => {
    try {
      const response = await axiosInstance.get('/currency/');
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  // Fetch payment methods from backend
  const fetchPaymentMethods = async () => {
    try {
      const response = await axiosInstance.get('/casacategory/');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  // Powerful refresh function with cache busting
  const forceRefreshData = async () => {
    try {
      setRefreshing(true);
      const response = await axiosInstance.get(`/casa/all-debts/`);

      console.log('API javob:', response.data);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const debtsWithKey = response.data.map((debt: ClientDebt) => ({
          ...debt,
          key: debt.client_id
        }));

        setDebts(debtsWithKey);
        setFilteredDebts(debtsWithKey);

        // Statistikalarni hisoblash
        const totalDebt = debtsWithKey.reduce((sum, debt) => sum + Math.max(0, debt.remaining_usd), 0);
        const totalPaid = debtsWithKey.reduce((sum, debt) => sum + debt.paid_usd, 0);
        const averageDebt = totalDebt / debtsWithKey.length;
        const topDebtors = [...debtsWithKey]
          .sort((a, b) => b.remaining_usd - a.remaining_usd)
          .filter(debt => debt.remaining_usd > 0)
          .slice(0, 3);

        setTotalStats({
          totalClients: debtsWithKey.length,
          totalDebt,
          totalPaid,
          averageDebt,
          topDebtors
        });

        message.success('Ma\'lumotlar yangilandi');
      } else {
        // Agar API dan ma'lumot kelmasa, hammasini tozalash
        console.log('API dan ma\'lumot yo\'q yoki bo\'sh array');
        setDebts([]);
        setFilteredDebts([]);
        setTotalStats({
          totalClients: 0,
          totalDebt: 0,
          totalPaid: 0,
          averageDebt: 0,
          topDebtors: []
        });
        message.info('Hozircha qarzdor mijozlar yo\'q');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      message.error('Ma\'lumotlarni yangilashda xatolik yuz berdi');

      // Xatolik bo'lsa ham bo'sh holatga o'tkazish
      setDebts([]);
      setFilteredDebts([]);
      setTotalStats({
        totalClients: 0,
        totalDebt: 0,
        totalPaid: 0,
        averageDebt: 0,
        topDebtors: []
      });
    } finally {
      setRefreshing(false);
    }
  };

  const fetchDebts = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCurrencies(), fetchPaymentMethods()]);
      const response = await axiosInstance.get(`/casa/all-debts/`);

      console.log('Boshlang\'ich API javob:', response.data);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const debtsWithKey = response.data.map((debt: ClientDebt) => ({
          ...debt,
          key: debt.client_id
        }));

        setDebts(debtsWithKey);
        setFilteredDebts(debtsWithKey);

        // Statistikalarni hisoblash
        const totalDebt = debtsWithKey.reduce((sum, debt) => sum + Math.max(0, debt.remaining_usd), 0);
        const totalPaid = debtsWithKey.reduce((sum, debt) => sum + debt.paid_usd, 0);
        const averageDebt = totalDebt / debtsWithKey.length;
        const topDebtors = [...debtsWithKey]
          .sort((a, b) => b.remaining_usd - a.remaining_usd)
          .filter(debt => debt.remaining_usd > 0)
          .slice(0, 3);

        setTotalStats({
          totalClients: debtsWithKey.length,
          totalDebt,
          totalPaid,
          averageDebt,
          topDebtors
        });
      } else {
        // Agar API dan ma'lumot kelmasa, bo'sh holat
        console.log('API dan ma\'lumot yo\'q');
        setDebts([]);
        setFilteredDebts([]);
        setTotalStats({
          totalClients: 0,
          totalDebt: 0,
          totalPaid: 0,
          averageDebt: 0,
          topDebtors: []
        });
      }
    } catch (error) {
      console.error('Error fetching client debts:', error);
      message.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');

      // Xatolik bo'lsa ham bo'sh holatga o'tkazish
      setDebts([]);
      setFilteredDebts([]);
      setTotalStats({
        totalClients: 0,
        totalDebt: 0,
        totalPaid: 0,
        averageDebt: 0,
        topDebtors: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  // Apply filters when search value changes
  useEffect(() => {
    filterData();
  }, [searchValue, debts]);

  const filterData = () => {
    let filtered = [...debts];

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(debt =>
        debt.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
        debt.client_company.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredDebts(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const fetchClientHistory = async (clientId: number, clientName: string) => {
    setHistoryLoading(true);
    setSelectedClientName(clientName);
    try {
      const response = await axiosInstance.get('/casahistory/');
      const filteredHistory = response.data.filter((item: PaymentHistory) =>
        item.client === clientId
      );

      setClientHistory(filteredHistory);
      setHistoryModalVisible(true);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      message.error('To\'lov tarixini yuklashda xatolik yuz berdi');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Get currency code from ID
  const getCurrencyCode = (currencyId: number): string => {
    const currency = currencies.find(c => c.id === currencyId);
    if (currency) return currency.currency;

    // Fallback to default mapping if not found in the currencies list
    const currencyMap: { [key: number]: string } = {
      1: 'RUB',
      2: 'USD',
      3: 'EUR',
      4: 'UZS',
      5: 'KZT'
    };

    return currencyMap[currencyId] || 'USD';
  };

  const columns = [
    {
      title: 'Mijoz',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text: string, record: ClientDebt) => (
        <Space direction="vertical" size="small">
          <Tag color="blue" icon={<UserOutlined />}>{text}</Tag>
          {record.client_company && (
            <small>{record.client_company}</small>
          )}
          {record.remaining_usd > 0 && (
            <Tag color="red">Qarzdor</Tag>
          )}
        </Space>
      ),
      sorter: (a: ClientDebt, b: ClientDebt) =>
        a.fullname.localeCompare(b.fullname),
    },
    {
      title: 'Umumiy summa (USD)',
      dataIndex: 'expected_usd',
      key: 'expected_usd',
      render: (amount: number) => formatMoney(amount),
      sorter: (a: ClientDebt, b: ClientDebt) =>
        a.expected_usd - b.expected_usd,
    },
    {
      title: 'To\'langan summa (USD)',
      dataIndex: 'paid_usd',
      key: 'paid_usd',
      render: (amount: number) => formatMoney(amount),
      sorter: (a: ClientDebt, b: ClientDebt) =>
        a.paid_usd - b.paid_usd,
    },
    {
      title: 'Qolgan qarz (USD)',
      dataIndex: 'remaining_usd',
      key: 'remaining_usd',
      render: (debt: number) => (
        <Tag color={debt > 0 ? 'red' : 'green'} style={{ fontSize: '14px', padding: '4px 8px' }}>
          {formatMoney(debt)} {debt > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </Tag>
      ),
      sorter: (a: ClientDebt, b: ClientDebt) =>
        a.remaining_usd - b.remaining_usd,
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: unknown, record: ClientDebt) => (
        <Space>
          {record.remaining_usd > 0 ? (
            <Tooltip title="Qarzni to'lash">
              <Button
                type="primary"
                danger
                shape="circle"
                size="small"
                icon={<DollarOutlined />}
                onClick={() => {
                  setSelectedClient(record.client_id);
                  setSelectedClientName(record.fullname);
                  setModalVisible(true);
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="To'lov qo'shish">
              <Button
                type="primary"
                shape="circle"
                size="small"
                icon={<DollarOutlined />}
                onClick={() => {
                  setSelectedClient(record.client_id);
                  setSelectedClientName(record.fullname);
                  setModalVisible(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="To'lovlar tarixi">
            <Button
              shape="circle"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => fetchClientHistory(record.client_id, record.fullname)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible, form]);

  const historyColumns = [
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: PaymentHistory) => (
        <span>{formatMoney(amount)} {getCurrencyCode(record.currency)}</span>
      ),
    },
    {
      title: 'To\'lov usuli',
      dataIndex: 'payment_name',
      key: 'payment_name',
      render: (name: string) => (
        <Tag color="blue">{name}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'confirmed' ? 'green' : 'orange'} icon={status === 'confirmed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {status === 'confirmed' ? 'Tasdiqlangan' : 'Kutilmoqda'}
        </Tag>
      ),
    },
    {
      title: 'Qarz',
      dataIndex: 'is_debt',
      key: 'is_debt',
      render: (isDebt: boolean) => (
        isDebt ? <Tag color="red">Qarz</Tag> : <Tag color="green">To`lov</Tag>
      ),
    },
    {
      title: 'Izoh',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => comment || '-',
    },
  ];
  const getCurrencyIdByCode = (code: string): number => {
    const currency = currencies.find(c => c.currency === code);
    return currency ? currency.id : 2;
  };
  return (
    <div className="client-accounts">
      <Row gutter={[16, 16]} className="client-stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card total-clients-card">
            <Statistic
              title="Jami mijozlar"
              value={totalStats.totalClients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card debt-card">
            <Statistic
              title="Jami qarz (USD)"
              value={totalStats.totalDebt}
              prefix={<FallOutlined />}
              precision={2}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="summary-card action-card">
            <Statistic
              title="O'rtacha qarz (USD)"
              value={totalStats.averageDebt}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={8}>
            <Input
              placeholder="Mijoz nomini qidirish"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      <Card
        className="clients-content-card"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={5} style={{ margin: 0 }}>
              <FilterOutlined /> Mijozlar va ularning qarzlari
            </Title>
            <Button
              icon={<ReloadOutlined />}
              loading={refreshing}
              onClick={forceRefreshData}
              type="primary"
              ghost
            >
              Yangilash
            </Button>
          </div>
        }
      >
        {filteredDebts.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={filteredDebts}
              loading={loading}
              rowKey="client_id"
              pagination={{
                total: filteredDebts.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Jami: ${total} mijozlar`,
              }}
              className="client-accounts-table"
              summary={(pageData) => {
                const totalDebt = pageData.reduce((sum, record) => sum + Math.max(0, record.remaining_usd), 0);
                const totalPaid = pageData.reduce((sum, record) => sum + record.paid_usd, 0);
                return (
                  <>
                    <Table.Summary.Row style={{ fontWeight: 'bold', background: '#fafafa' }}>
                      <Table.Summary.Cell index={0}>Jami</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>{formatMoney(totalPaid)} USD</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        <Tag color={totalDebt > 0 ? 'red' : 'green'} style={{ fontSize: '14px', padding: '4px 8px' }}>
                          {formatMoney(totalDebt)} USD
                        </Tag>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          </>
        ) : (
          <Empty
            description="Hozircha qarzdor mijozlar yo'q"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {totalStats.topDebtors.length > 0 && (
        <Card title="Eng ko'p qarzdorlar" style={{ marginTop: 16 }}>
          {totalStats.topDebtors.map((debtor, index) => (
            <Card.Grid key={index} style={{ width: '33.33%', textAlign: 'center' }}>
              <div style={{ padding: '10px 0' }}>
                <UserOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{debtor.fullname}</div>
                {debtor.client_company && (
                  <div style={{ fontSize: 12, color: '#666' }}>{debtor.client_company}</div>
                )}
                <Tag color="red" style={{ margin: '8px 0', padding: '0 8px' }}>
                  {formatMoney(debtor.remaining_usd)} USD
                </Tag>
                <div>
                  <Button
                    type="primary"
                    size="small"
                    icon={<DollarOutlined />}
                    onClick={() => {
                      setSelectedClient(debtor.client_id);
                      setSelectedClientName(debtor.fullname);
                      setModalVisible(true);
                    }}
                  >
                    To&apos;lov qo&apos;shish
                  </Button>
                </div>
              </div>
            </Card.Grid>
          ))}
        </Card>
      )}

      <Modal
        title={`${selectedClientName} to'lovlar tarixi`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        {clientHistory.length > 0 ? (
          <Table
            dataSource={clientHistory}
            columns={historyColumns}
            rowKey="id"
            loading={historyLoading}
            pagination={{ pageSize: 5 }}
          />
        ) : historyLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Yuklanmoqda...</div>
        ) : (
          <Empty description="To'lovlar tarixi topilmadi" />
        )}
      </Modal>

      {/* Cash Transaction Modal */}
      <Modal
        title="To'lov qo'shish"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedClient(null);
        }}
        footer={null}
        destroyOnHidden
        forceRender={true}
      >
        {selectedClient && (
          <div style={{ marginBottom: 16 }}>
            <span>Mijoz: </span>
            <Tag icon={<UserOutlined />}>{selectedClientName}</Tag>
            <span style={{ marginLeft: 8 }}>Qarz miqdori: </span>
            <Tag icon={<DollarOutlined />} color="red">
              ${(filteredDebts.find(d => d.client_id === selectedClient)?.remaining_usd || 0).toLocaleString()}
            </Tag>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            currency: 'USD',
            payment_way: paymentMethods.length > 0 ? paymentMethods[0].id : 1,
            is_debt: false,
          }}
          onFinish={async (values) => {
            try {
              setLoading(true);

              // API ga mos formatdagi ma'lumotni tayyorlaymiz
              const paymentData = {
                client: selectedClient,
                amount: values.amount,
                currency: getCurrencyIdByCode(values.currency),
                payment_way: values.payment_way,
                comment: values.comment || "Qarz to'lovi",
                is_debt: false,
                custom_rate_to_uzs: values.custom_rate_to_uzs.toString()
              };

              // API ga yuboramiz
              await axiosInstance.post('/casa/', paymentData);
              message.success('To\'lov muvaffaqiyatli qo\'shildi');

              // Close modal first for better UX
              setModalVisible(false);
              setSelectedClient(null);
              form.resetFields();

              // Force refresh with delay to allow backend to process
              setTimeout(() => {
                forceRefreshData();
              }, 1000);
            } catch (error) {
              console.error('Error creating payment:', error);
              let errorMessage = 'To\'lovni saqlashda muammo yuz berdi';

              if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.client) {
                  errorMessage = `Mijoz xatosi: ${errorData.client}`;
                } else if (errorData.payment_way) {
                  errorMessage = `To'lov usuli xatosi: ${errorData.payment_way}`;
                } else if (errorData.detail) {
                  errorMessage = errorData.detail;
                }
              }

              message.error(`Xatolik: ${errorMessage}`);
            } finally {
              setLoading(false);
            }
          }}
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
              parser={(value) => {
                if (!value) return 0;
                return Number(value.replace(/\$\s?|(,*)/g, ''));
              }}
            />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Valyuta"
            rules={[{ required: true, message: 'Iltimos, valyutani tanlang' }]}
          >
            <Select onChange={(value) => {
              const selectedCurrency = currencies.find(c => c.currency === value);
              if (selectedCurrency) {
                const amount = form.getFieldValue('amount');
                if (amount) {
                  form.setFieldsValue({
                    custom_rate_to_uzs: selectedCurrency.rate_to_uzs
                  });
                }
              }
            }}>
              {currencies.map(currency => (
                <Option key={`currency-${currency.id}`} value={currency.currency}>
                  {currency.currency} ({parseFloat(currency.rate_to_uzs || "0").toLocaleString()} UZS)
                </Option>
              ))}
            </Select>
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
            <Select>
              {paymentMethods.map(method => (
                <Option key={`payment-${method.id}`} value={method.id}>
                  {method.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="comment"
            label="Izoh"
          >
            <Input.TextArea rows={2} placeholder="Izoh qoldiring..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              To`lovni saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ClientAccounts;
