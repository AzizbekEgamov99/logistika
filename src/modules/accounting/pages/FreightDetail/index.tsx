'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Spin,
  Table,
  Alert,
  Button,
  Empty,
  message,
  Space,
  Avatar,
  Badge,
  Statistic,
  Tabs,
  Progress,
  Collapse,
  Divider,
  List
} from 'antd'
import {
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  BoxPlotOutlined,
  FileTextOutlined,
  SyncOutlined,
  RiseOutlined,
  FallOutlined,
  DashboardOutlined,
  PhoneOutlined,
  ToolOutlined,
  AuditOutlined
} from '@ant-design/icons'
import axiosInstance from '@/api/axiosInstance'
import dayjs from 'dayjs'
import { useRouter, useParams } from 'next/navigation'
import './styles.css'
import { useCurrencies } from '../../hooks/useCurrencies'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

// Define interface for product data
interface ProductData {
  id: number;
  from_location_name: string | null;
  to_location_name: string | null;
  name: string;
  price: number;
  price_in_usd: string;
  currency: string;
  count: number;
  description: string;
  photo: string;
  is_busy: boolean;
  is_delivered: boolean;
  client: number;
  from_location: number | null;
  to_location: number | null;
}

// Define interface for client data
interface ClientData {
  id: number;
  company: string;
  first_name: string;
  last_name: string;
  number: string;
  products: ProductData[];
}

// Define interface for expense item
interface ExpenseItem {
  id: number;
  price: number;
  currency: string;
  usd_value: number;
  description?: string;
  created_at?: string;
  driver_name?: string;
  driver?: number;
}

// Define interface for issue/ariza item
interface ArizaItem {
  id: number;
  driver_name: string;
  description: string;
  created_at: string;
  driver: number;
}

// Define interface for reference item
interface ReferenceItem {
  id: number;
  driver_name: string;
  description: string;
  created_at: string;
  driver: number;
}

// Define interface for expenses
interface Expenses {
  texnics: ExpenseItem[];
  balons: ExpenseItem[];
  balon_furgons: ExpenseItem[];
  optols: ExpenseItem[];
  chiqimliks: ExpenseItem[];
  arizalar: ArizaItem[];
  referenslar: ReferenceItem[];
  total_usd: number;
}

// Define interface for trip data
interface TripData {
  id: number;
  driver: {
    fullname: string;
    phone_number: string;
  };
  car: {
    name: string;
    number: string;
  };
  fourgon: {
    name: string;
    number: string;
  };
  client: ClientData[];
  client_completed: number[];
  created_at: string;
  updated_at: string;
  is_completed: boolean;
  price: number;
  dr_price: number;
  dp_price: number;
  dp_currency: string;
  dp_information: string;
  kilometer: number;
  count: number;
  country: number;
  country_name: string;
  expenses: Expenses;
}

// Move formatCurrency to be accessible in all components
const formatCurrency = (price: number | undefined, currency: string) => {
  if (price === undefined) return '0';
  return `${price.toLocaleString()} ${currency}`;
};

const TripOverview: React.FC = () => {
  const { data: tripData } = React.useContext(TripContext);
  const { currencies } = useCurrencies();

  if (!tripData) return <Spin size="large" />;

  const profit = tripData.price - (tripData.expenses?.total_usd || 0) - (tripData.dr_price || 0) - (tripData.dp_price || 0);
  const profitMargin = tripData.price ? Math.round((profit / tripData.price) * 100 * 100) / 100 : 0;
  const isProfitable = profit > 0;

  // Find currency string from ID
  const getCurrencyName = (currencyId: string | number): string => {
    if (!currencies || currencies.length === 0) return String(currencyId);

    // If currencyId is already a currency code like "USD", return it
    if (typeof currencyId === 'string' && ['USD', 'UZS', 'RUB', 'EUR'].includes(currencyId)) {
      return currencyId;
    }

    // Try to find currency by ID
    const currency = currencies.find(c => c.id === Number(currencyId));
    return currency ? currency.currency : String(currencyId);
  };

  return (
    <div className="trip-overview">
      <Row gutter={[16, 16]}>
        {/* Vehicle Info */}
        <Col xs={24} md={12}>
          <Card title="Transport ma&apos;lumotlari" className="trip-info-card">
            <Descriptions column={{ xs: 1, sm: 2 }} layout="vertical">
              <Descriptions.Item label="Mashina">
                <Tag icon={<CarOutlined />} color="blue">{tripData.car?.name || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mashina raqami">
                <Tag color="blue">{tripData.car?.number || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Furgon">
                <Tag icon={<CarOutlined />} color="purple">{tripData.fourgon?.name || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Furgon raqami">
                <Tag color="purple">{tripData.fourgon?.number || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Haydovchi">
                <Tag icon={<UserOutlined />} color="green">{tripData.driver?.fullname || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Telefon">
                <Tag icon={<PhoneOutlined />} color="green">{tripData.driver?.phone_number || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Kilometr">
                <Tag color="orange">{tripData.kilometer || 0} km</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mamlakat">
                <Tag icon={<EnvironmentOutlined />} color="geekblue">{tripData.country_name || 'Ma\'lumot yo\'q'}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Financial Summary */}
        <Col xs={24} md={12}>
          <Card title="Moliyaviy ma&apos;lumotlar" className="trip-info-card">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12}>
                <Statistic
                  title="Umumiy reys narxi"
                  value={tripData.price || 0}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<RiseOutlined />}
                  suffix="USD"
                />
              </Col>
              <Col xs={12} sm={12}>
                <Statistic
                  title="Haydovchi xarajatlari"
                  value={tripData.dr_price || 0}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<FallOutlined />}
                  suffix="USD"
                />
              </Col>
              <Col xs={12} sm={12}>
                <Statistic
                  title="Haydovchiga to'lov"
                  value={tripData.dp_price || 0}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<UserOutlined />}
                  suffix={getCurrencyName(tripData.dp_currency || 'UZS')}
                />
              </Col>
              <Col xs={12} sm={12}>
                <Statistic
                  title="Boshqa xarajatlar"
                  value={tripData.expenses?.total_usd || 0}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
              </Col>
              <Col xs={24}>
                <Divider style={{ margin: '12px 0' }} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Clients Tab Component
const ClientsTab: React.FC = () => {
  const { data: tripData } = React.useContext(TripContext);
  const { currencies } = useCurrencies();

  if (!tripData || !tripData.client || tripData.client.length === 0) {
    return <Empty description="Mijozlar ma&apos;lumotlari topilmadi" />;
  }

  // Find currency string from ID
  const getCurrencyName = (currencyId: string | number): string => {
    if (!currencies || currencies.length === 0) return String(currencyId);

    // If currencyId is already a currency code like "USD", return it
    if (typeof currencyId === 'string' && ['USD', 'UZS', 'RUB', 'EUR'].includes(currencyId)) {
      return currencyId;
    }

    // Try to find currency by ID
    const currency = currencies.find(c => c.id === Number(currencyId));
    return currency ? currency.currency : String(currencyId);
  };

  return (
    <div className="clients-card">
      <Collapse className="clients-collapse">
        {tripData.client.map((client) => (
          <Panel
            key={client.id || ''}
            header={
              <Space>
                <UserOutlined />
                <strong>{client.first_name || ''} {client.company || ''}</strong>
                <Tag icon={<PhoneOutlined />}>{client.number || 'Raqam yo\'q'}</Tag>
                <Tag color="blue">{client.products?.length || 0} mahsulot</Tag>
              </Space>
            }
          >
            {client.products && client.products.length > 0 ? (
              <Table
                dataSource={client.products}
                rowKey="id"
                pagination={false}
                className="products-table"
              >
                <Table.Column title="Nomi" dataIndex="name" key="name"
                  render={(text, record: ProductData) => (
                    <Space>
                      <Tag color="blue">{text || 'Nomsiz'}</Tag>
                      {record.is_delivered && <Tag color="green" icon={<CheckCircleOutlined />}>Yetkazildi</Tag>}
                      {record.is_busy && <Tag color="orange" icon={<ClockCircleOutlined />}>Jarayonda</Tag>}
                    </Space>
                  )}
                />
                <Table.Column title="Narxi" dataIndex="price" key="price"
                  render={(text, record: ProductData) => (
                    <Tag color="green">{formatCurrency(record.price, getCurrencyName(record.currency || 'UZS'))}</Tag>
                  )}
                />
                <Table.Column title="Miqdor" dataIndex="count" key="count"
                  render={(count) => count || 0}
                />
                <Table.Column title="Izoh" dataIndex="description" key="description"
                  render={(description) => description || '-'}
                  ellipsis
                />
              </Table>
            ) : (
              <Empty description="Mahsulotlar topilmadi" />
            )}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

// Expenses Tab Component
const ExpensesTab: React.FC = () => {
  const { data: tripData } = React.useContext(TripContext);

  if (!tripData || !tripData.expenses) {
    return <Empty description="Xarajatlar ma&apos;lumotlari topilmadi" />;
  }

  const expenses = tripData.expenses;
  const expenseCategories = [
    { key: 'texnics', name: 'Texnik xizmatlar', items: expenses.texnics || [], icon: <ToolOutlined /> },
    { key: 'balons', name: 'Balonlar', items: expenses.balons || [], icon: <SyncOutlined /> },
    { key: 'balon_furgons', name: 'Balon Furgonlar', items: expenses.balon_furgons || [], icon: <BoxPlotOutlined /> },
    { key: 'optols', name: 'Optollar', items: expenses.optols || [], icon: <ShopOutlined /> },
    { key: 'chiqimliks', name: 'Chiqimliklar', items: expenses.chiqimliks || [], icon: <DollarOutlined /> },
    { key: 'arizalar', name: 'Arizalar', items: expenses.arizalar || [], icon: <FileTextOutlined /> },
    { key: 'referenslar', name: 'Referenslar', items: expenses.referenslar || [], icon: <AuditOutlined /> }
  ];

  const calculateCategoryTotal = (items: ExpenseItem[] | ArizaItem[] | ReferenceItem[]): number => {
    if (!items || items.length === 0) return 0;
    // @ts-expect-error - handling different item types
    return items.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="expenses-tab">
      <Card className="expenses-summary-card">
        <Statistic
          title="Jami xarajatlar"
          value={expenses.total_usd || 0}
          precision={2}
          valueStyle={{ color: '#cf1322' }}
          prefix={<DollarOutlined />}
          suffix="USD"
        />
      </Card>

      <Divider />

      <Collapse className="expenses-collapse">
        {expenseCategories.map((category) => {
          if (!category.items || category.items.length === 0) return null;

          const total = calculateCategoryTotal(category.items);
          const percentage = expenses.total_usd ? (total / expenses.total_usd) * 100 : 0;

          return (
            <Panel
              key={category.key}
              header={
                <Space>
                  {category.icon}
                  <strong>{category.name}</strong>
                  <Badge count={category.items.length} style={{ backgroundColor: '#52c41a' }} />
                  <span>{formatCurrency(total, 'UZS')}</span>
                  <Progress
                    percent={Math.round(percentage * 100) / 100}
                    size="small"
                    status="active"
                    style={{ width: 100 }}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </Space>
              }
            >
              <List
                dataSource={category.items}
                renderItem={(item: any) => (
                  <List.Item key={item.id || ''}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<DollarOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title={
                        <Space>
                          <Text strong>{formatCurrency(item.price, item.currency || 'UZS')}</Text>
                          {item.usd_value && <Tag color="blue">{item.usd_value.toFixed(2)} USD</Tag>}
                        </Space>
                      }
                      description={
                        <>
                          {item.description && <Paragraph ellipsis={{ rows: 2 }}>{item.description}</Paragraph>}
                          {item.created_at && <Text type="secondary">{dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}</Text>}
                          {item.driver_name && (
                            <div>
                              <Tag icon={<UserOutlined />} color="green">{item.driver_name}</Tag>
                            </div>
                          )}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

// Create a context to share trip data between components
const TripContext = React.createContext<{
  data: TripData | null;
}>({
  data: null
});

const FreightDetailPage = () => {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const { currencies } = useCurrencies()

  const id = params?.id
  const fetchTripDetails = useCallback(async () => {
    if (!id) {
      setError('Reys ID topilmadi');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      setLoading(true);
      console.log(`Fetching trip details for ID: ${id}`);
      // To'g'ri URL - faqat nisbiy yo'l ishlatilmoqda
      const response = await axiosInstance.get(`rays/${id}/`, {
        signal: controller.signal,
        // Add cache control headers
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      // Basic validation of response data
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Noto\'g\'ri ma\'lumot formati');
      }

      console.log('Response data:', response.data);

      // Initialize missing fields to prevent null reference errors
      const normalizedData = {
        ...response.data,
        car: response.data.car || { name: 'Ma\'lumot yo\'q', number: 'Ma\'lumot yo\'q' },
        fourgon: response.data.fourgon || { name: 'Ma\'lumot yo\'q', number: 'Ma\'lumot yo\'q' },
        driver: response.data.driver || { fullname: 'Ma\'lumot yo\'q', phone_number: 'Ma\'lumot yo\'q' },
        client: Array.isArray(response.data.client) ? response.data.client : [],
        expenses: response.data.expenses || {
          texnics: [],
          balons: [],
          balon_furgons: [],
          optols: [],
          chiqimliks: [],
          arizalar: [],
          referenslar: [],
          total_usd: 0
        }
      };

      setTripData(normalizedData);
      setError(null);
    } catch (err: any) {
      console.error('Reys ma\'lumotlarini olishda xatolik:', err);

      if (err.name === 'AbortError') {
        setError('So\'rov vaqti tugadi. Iltimos qaytadan urinib ko\'ring.');
      } else if (err.response?.status === 404) {
        setError('Reys topilmadi.');
      } else if (err.response?.status === 403) {
        setError('Bu ma\'lumotlarga kirish uchun ruxsat yo\'q.');
      } else {
        setError(`Xatolik: ${err.message || 'Noma\'lum xato'}`);
      }

      // Display error message
      message.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [id]);

  // Fetch data on mount
  useEffect(() => {
    fetchTripDetails();

    // Return cleanup function
    return () => {
      // Clean up any pending operations here
    };
  }, [fetchTripDetails]);

  // Return to main freight page
  const handleGoBack = () => {
    router.push('/modules/accounting/freight');
  }

  const handleRetry = () => {
    fetchTripDetails();
  }

  // Format functions
  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Yakunlangan' : 'Jarayonda';
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted ? 'success' : 'processing';
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getExpenseCategoryName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      arizalar: 'Arizalar',
      balons: 'Balonlar',
      balon_furgons: 'Balon Furgonlar',
      chiqimliks: 'Chiqimliklar',
      optols: 'Optollar',
      referenslar: 'Referenslar',
      texnics: 'Texnik xizmatlar'
    };

    return categoryMap[category] || category;
  };

  // Calculate total expense for each category
  const calculateCategoryTotal = (items: ExpenseItem[] | undefined): number => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + item.price, 0);
  };

  // Get all expenses as a flat array
  const getAllExpenses = (expenses: Expenses | undefined): any[] => {
    if (!expenses) return [];
    return [
      ...(expenses.arizalar || []),
      ...(expenses.balons || []),
      ...(expenses.balon_furgons || []),
      ...(expenses.chiqimliks || []),
      ...(expenses.optols || []),
      ...(expenses.referenslar || []),
      ...(expenses.texnics || [])
    ];
  };

  // Calculate total revenue from all products
  const calculateTotalRevenue = (tripData: TripData | null): number => {
    if (!tripData) return 0;

    let total = 0;
    if (tripData.client) {
      tripData.client.forEach(client => {
        if (client.products) {
          client.products.forEach(product => {
            total += product.price;
          });
        }
      });
    }

    return total;
  };

  // Calculate total expenses
  const calculateTotalExpenses = (tripData: TripData | null): number => {
    if (!tripData || !tripData.expenses) return 0;
    return tripData.expenses.total_usd || 0;
  };

  // Calculate total profit
  const calculateProfit = (tripData: TripData | null): number => {
    if (!tripData) return 0;
    const revenue = tripData.price;
    const expenses = calculateTotalExpenses(tripData);
    return revenue - expenses - (tripData.dr_price || 0) - (tripData.dp_price || 0);
  };

  // Calculate profit margin percentage
  const calculateProfitMargin = (tripData: TripData | null): number => {
    if (!tripData) return 0;
    const revenue = tripData.price;
    if (revenue === 0) return 0;

    const profit = calculateProfit(tripData);
    const margin = (profit / revenue) * 100;
    return Math.round(margin * 100) / 100; // Round to 2 decimal places
  };
  const tabItems = [
    {
      key: 'overview',
      label: <span><DashboardOutlined /> Umumiy ma`lumot</span>,
      children: <TripOverview />
    },
    {
      key: 'clients',
      label: (
        <span>
          <UserOutlined /> Mijozlar {tripData?.client ? `(${tripData.client.length || 0})` : ''}
        </span>
      ),
      children: <ClientsTab />
    },
    {
      key: 'expenses',
      label: (
        <span>
          <DollarOutlined /> Xarajatlar {tripData?.expenses ? `(${tripData.expenses.total_usd?.toFixed(2) || 0} USD)` : ''}
        </span>
      ),
      children: <ExpensesTab />
    }
  ];

  // Main render
  if (loading) {
    return (
      <div className="freight-detail-container">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Ma`lumotlar yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="freight-detail-container">
        <Alert
          message="Xatolik"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={handleRetry}>
              Qayta urinish
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <TripContext.Provider value={{ data: tripData }}>
      <div className="freight-detail-container">
        <div className="page-header">
          <div className="header-left">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              style={{ marginRight: 16 }}
            >
              Orqaga
            </Button>
            <Title level={3}>
              Reys #{tripData?.id} {tripData?.country_name && `- ${tripData.country_name}`}
              <Tag
                color={getStatusColor(tripData?.is_completed || false)}
                style={{ marginLeft: 8 }}
              >
                {getStatusText(tripData?.is_completed || false)}
              </Tag>
            </Title>
          </div>

          <div className="header-right">
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRetry}
              >
                Yangilash
              </Button>
            </Space>
          </div>
        </div>

        <Card className="detail-tabs">
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        </Card>
      </div>
    </TripContext.Provider>
  );
};

export default FreightDetailPage 