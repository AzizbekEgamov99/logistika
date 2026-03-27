import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Typography, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Spin, Statistic, Alert, Empty } from 'antd';
import { PlusOutlined, DollarOutlined, WalletOutlined, BankOutlined, CarOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import { cashApi } from '../../../../../accounting/api/cash/cashApi';
import { useCurrencies } from '../../../../../accounting/hooks/useCurrencies';
import FinancialSummary from '../../components/FinancialSummary';
import TransactionsList from '../../components/TransactionsList';
import CashFlow from '../../components/CashFlow';
import styles from '../../finance.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const CashManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [cashOverview, setCashOverview] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [clientDebts, setClientDebts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Get currencies from the API
  const { currencies, loading: currenciesLoading } = useCurrencies();
  
  // Fetch cash overview data
  const fetchCashOverview = async () => {
    try {
      setLoading(true);
      const data = await cashApi.getCashOverview();
      setCashOverview(data);
    } catch (err) {
      console.error('Error fetching cash overview:', err);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cash transactions
  const fetchTransactions = async () => {
    try {
      const response = await cashApi.getCashHistory();
      setTransactions(response);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Tranzaksiyalarni yuklashda xatolik yuz berdi');
    }
  };

  // Fetch client debts
  const fetchClientDebts = async () => {
    try {
      const response = await cashApi.getAllClientDebts();
      setClientDebts(response);
    } catch (err) {
      console.error('Error fetching client debts:', err);
    }
  };

  useEffect(() => {
    fetchCashOverview();
    fetchTransactions();
    fetchClientDebts();
  }, []);

  // Show modal to add transaction
  const showAddTransactionModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle adding a new transaction
  const handleAddTransaction = async (values: any) => {
    try {
      await cashApi.createCash(values);
    setIsModalVisible(false);
    form.resetFields();
      // Refresh data
      fetchCashOverview();
      fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  if ((loading && !cashOverview) || currenciesLoading) {
    return (
      <div className={styles['loading-container']}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  // Function to get currency symbol
  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'RUB': return '₽';
      case 'EUR': return '€';
      case 'UZS': return 'so\'m';
      default: return currencyCode;
    }
  };

  // Function to get color class for currency
  const getCurrencyColorClass = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return styles['usd-card'];
      case 'RUB': return styles['rub-card'];
      case 'EUR': return styles['eur-card'];
      case 'UZS': return styles['uzs-card'];
      default: return styles['default-card'];
    }
  };

  // Ensure we always have at least default currencies available if no currencies are loaded
  const availableCurrencies = currencies.length > 0 
    ? currencies 
    : [
        { id: 1, currency: 'USD', rate_to_uzs: '1' },
        { id: 2, currency: 'UZS', rate_to_uzs: '1' }
      ];
  return (
    <div className="cash-management">
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Title level={4}>Kassa Boshqaruvi</Title>
          <Text type="secondary">
            Umumiy pul oqimi hisoboti va moliyaviy operatsiyalar
          </Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddTransactionModal}
            className={styles['non-printable']}
          >
            Yangi Tranzaksiya
          </Button>
        </Col>
      </Row>

      {/* Currency Stats */}
      {cashOverview && (
        <Row gutter={[24, 24]} className="currency-stats">
          {availableCurrencies.map(currency => (
            <Col xs={24} sm={12} md={6} key={`currency-card-${currency.id}`}>
              <Card className={`${styles['currency-card']} ${getCurrencyColorClass(currency.currency)}`} hoverable>
              <div className={styles['currency-card-header']}>
                  <span className={styles['currency-icon']}>{getCurrencySymbol(currency.currency)}</span>
                  <div className={styles['currency-title']}>{currency.currency}</div>
              </div>
              <div className={styles['currency-amount']}>
                  {cashOverview?.cashbox?.[currency.currency]?.toLocaleString() || 0}
              </div>
            </Card>
          </Col>
          ))}
        </Row>
      )}

      {/* Summary Stats */}
      {cashOverview && (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card className={`${styles['summary-card']} ${styles['total-card']}`} hoverable>
              <div className={styles['summary-card-title']}>Jami kassa </div>
              <div className={styles['summary-card-value']}>
                ${cashOverview?.cashbox?.total_in_usd?.toLocaleString() || 0}
              </div>
              <LineChartOutlined className={styles['summary-card-icon']} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className={`${styles['summary-card']} ${styles['expenses-card']}`} hoverable>
              <div className={styles['summary-card-title']}>Jami xarajatlar</div>
              <div className={styles['summary-card-value']}>
                ${cashOverview?.expenses?.total_expenses_usd?.toLocaleString() || 0}
              </div>
              <div className={styles['summary-card-subtitle']}>
                <span>DP: ${cashOverview?.expenses?.dp_price_usd?.toLocaleString() || 0}</span> |
                <span> Maosh: ${cashOverview?.expenses?.salaries_usd?.toLocaleString() || 0}</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              className={`${styles['summary-card']} ${styles['balance-card']}`}
              hoverable
              style={{
                borderTop: cashOverview?.final_balance_usd >= 0 ? '4px solid #52c41a' : '4px solid #f5222d'
              }}
            >
              <div className={styles['summary-card-title']}>Qolgan balans (USD)</div>
              <div
                className={styles['summary-card-value']}
                style={{
                  color: cashOverview?.final_balance_usd >= 0 ? '#52c41a' : '#f5222d'
                }}
              >
                ${cashOverview?.final_balance_usd?.toLocaleString() || 0}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 24 }}>
        <TabPane tab={<span><DollarOutlined /> Umumiy Ma'lumot</span>} key="overview">
          <Card title="Moliyaviy ko'rsatkichlar" loading={loading}>
            {cashOverview && (
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Jami daromad (USD)"
                    value={cashOverview.total_income_usd || 0}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="$"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Jami xarajat (USD)"
                    value={cashOverview.total_expense_usd || 0}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    prefix="$"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Qarzdorlar soni"
                    value={clientDebts?.length || 0}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<UserOutlined />}
                  />
                </Col>
              </Row>
            )}
          </Card>
          
          <Card title="So'nggi Tranzaksiyalar" style={{ marginTop: 16 }}>
            <TransactionsList 
              transactions={transactions.slice(0, 5)} 
              showPagination={false}
              loading={loading}
            />
            {transactions.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button 
                  type="link" 
                  onClick={() => setActiveTab('transactions')}
                >
                  Barcha tranzaksiyalarni ko'rish
                </Button>
              </div>
            )}
          </Card>
          
          <Card title="Pul Oqimi" style={{ marginTop: 16 }}>
            <CashFlow transactions={transactions} />
          </Card>
        </TabPane>
        
        <TabPane tab={<span><UserOutlined /> Qarzdorlar</span>} key="debtors">
          <Card>
            <FinancialSummary 
              clientDebts={clientDebts}
              loading={loading}
            />
          </Card>
        </TabPane>
        
        <TabPane tab={<span><CarOutlined /> Tranzaksiyalar Tarixi</span>} key="transactions">
          <Card>
            <TransactionsList 
              transactions={transactions} 
              showPagination={true}
              loading={loading}
            />
          </Card>
        </TabPane>
        
        <TabPane tab={<span><BankOutlined /> To'lov Turlari</span>} key="payment-types">
          <Card title="To'lov Turlari va Hisob-kitob">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={6}>
                <Card className={styles['payment-type-card']}>
                  <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <Title level={5} style={{ marginTop: 16 }}>To'liq to'lov</Title>
                  <Text>Mijoz barcha xizmat uchun to'lovni to'liq amalga oshiradi</Text>
                </Card>
              </Col>
              
              <Col xs={24} md={12} lg={6}>
                <Card className={styles['payment-type-card']}>
                  <WalletOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Title level={5} style={{ marginTop: 16 }}>Yarim to'lov</Title>
                  <Text>Mijoz to'lovning bir qismini amalga oshiradi, qolganini keyinroq to'laydi</Text>
                </Card>
              </Col>
              
              <Col xs={24} md={12} lg={6}>
                <Card className={styles['payment-type-card']}>
                  <BankOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <Title level={5} style={{ marginTop: 16 }}>Qarzga savdo</Title>
                  <Text>Mijoz xizmatdan avval foydalanib, to'lovni keyinroq amalga oshiradi</Text>
                </Card>
              </Col>
              
              <Col xs={24} md={12} lg={6}>
                <Card className={styles['payment-type-card']}>
                  <CarOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  <Title level={5} style={{ marginTop: 16 }}>Haydovchi orqali</Title>
                  <Text>Mijoz to'lovni bevosita haydovchiga amalga oshiradi</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Add Transaction Modal */}
      <Modal
        title="Yangi Tranzaksiya Qo'shish"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className={styles['non-printable']}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTransaction}
          initialValues={{
            type: 'income',
            currency: 'USD',
            amount: null,
            category: '',
            description: '',
          }}
        >
          <Form.Item
            name="type"
            label="Tranzaksiya turi"
            rules={[{ required: true, message: 'Iltimos, tranzaksiya turini tanlang' }]}
          >
            <Select>
              <Option value="income">Kirim</Option>
              <Option value="expense">Chiqim</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="Miqdori"
            rules={[{ required: true, message: 'Iltimos, miqdorni kiriting' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/(,*)/g, '')}
              min={0}
            />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="Valyuta"
            rules={[{ required: true, message: 'Iltimos, valyutani tanlang' }]}
          >
            <Select loading={currenciesLoading}>
              {availableCurrencies.map(currency => (
                <Option key={currency.id} value={currency.currency}>
                  {currency.currency} {currency.rate_to_uzs && `(${parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Kategoriya"
            rules={[{ required: true, message: 'Iltimos, kategoriyani tanlang' }]}
          >
            <Select>
              <Option value="Trip payment">Reys to'lovi</Option>
              <Option value="Vehicle maintenance">Transport xizmati</Option>
              <Option value="Fuel">Yoqilg'i</Option>
              <Option value="Driver salary">Haydovchi maoshi</Option>
              <Option value="Office expenses">Ofis xarajatlari</Option>
              <Option value="Taxes">Soliqlar</Option>
              <Option value="Other">Boshqa</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Izoh"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setIsModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CashManagement; 
