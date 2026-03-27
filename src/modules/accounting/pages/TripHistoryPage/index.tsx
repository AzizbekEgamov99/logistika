'use client';
import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Button,
  Drawer,
  Descriptions,
  Tag,
  Typography,
  Input,
  Row,
  Col,
  message,
  Popconfirm,
  DatePicker,
  Tabs,
  Card,
  List,
  Alert,
  Avatar,
  Statistic,
  Dropdown,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  RollbackOutlined,
  CarOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  DownOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import axiosInstance from '@/api/axiosInstance';

dayjs.extend(isBetween);

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const {  } = Tabs;

// Inline styles
const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '24px',
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '24px',
    margin: 0,
    marginBottom: '8px',
    fontWeight: 600,
    color: '#202124'
  },
  subTitle: {
    fontSize: '14px',
    color: '#5f6368',
    margin: 0
  },
  card: {
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  tableCard: {
    padding: '24px'
  },
  filtersContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginBottom: '24px'
  },
  filterInput: {
    width: '100%',
    maxWidth: '300px'
  },
  tableStyles: {
    borderRadius: '8px',
    overflow: 'hidden'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    gap: '16px'
  },
  statsSection: {
    marginBottom: '24px'
  },
  statisticCard: {
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  avatar: {
    padding: '12px',
    borderRadius: '50%',
    background: '#f5f5f5',
    marginRight: '16px'
  },
  actionButton: {
    borderRadius: '6px'
  },
  drawerContent: {
    padding: '0'
  },
  drawerTabs: {
    marginTop: '8px'
  },
  detailsCard: {
    marginBottom: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
  },
  clientCard: {
    marginBottom: '16px',
    borderRadius: '8px'
  }
};

interface ExpenseItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Expenses {
  texnics: Array<{
    id: number;
    car_name: string;
    price: number;
    custom_rate_to_uzs: string;
    kilometer: number;
    created_at: string;
    car: number;
    service: number;
    currency: number;
  }>;
  balons: Array<{
    id: number;
    car_name: string;
    type: string;
    price: number;
    custom_rate_to_uzs: string;
    kilometr: number;
    count: number;
    created_at: string;
    car: number;
    currency: number;
  }>;
  balon_furgons: Array<{
    id: number;
    furgon_name: string;
    type: string;
    price: number;
    custom_rate_to_uzs: string;
    kilometr: number;
    count: number;
    created_at: string;
    furgon: number;
    currency: number;
  }>;
  optols: Array<{
    id: number;
    car_name: string;
    price: number;
    custom_rate_to_uzs: string;
    kilometr: number;
    created_at: string;
    car: number;
    currency: number;
  }>;
  chiqimliks: Array<{
    id: number;
    driver_name: string;
    photo: string;
    price: number;
    custom_rate_to_uzs: string;
    description: string;
    created_at: string;
    driver: number;
    chiqimlar: number;
    currency: number;
  }>;
  arizalar: Array<{
    id: number;
    driver_name: string;
    description: string;
    created_at: string;
    driver: number;
  }>;
  referenslar: Array<{
    id: number;
    driver_name: string;
    description: string;
    created_at: string;
    driver: number;
  }>;
  total_usd: number;
}

interface ClientProductItem {
  price: number;
  count: number;
  name?: string;
}

// Define types for params
interface ExportParams {
  period?: string;
  from?: string;
  to?: string;
}

interface TripQueryParams {
  page: number;
  page_size: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}

interface Driver {
  id: number;
  fullname: string;
  phone_number: string;
}

interface Car {
  id: number;
  name: string;
  number: string;
}

interface Country {
  id: number;
  name: string;
}

interface Client {
  id: number;
  first_name: string;
  last_name?: string;
  number?: string;
  products?: ClientProductItem[];
  company?: string;
}

interface Trip {
  id: number;
  driver?: Driver;
  car?: Car;
  fourgon?: Car;
  country?: Country;
  client?: Client[];
  kilometer?: number;
  price?: number;
  dr_price?: number;
  dp_price?: number;
  dp_currency_name?: string;
  created_at: string;
  dp_information?: string;
  expenses?: Expenses;
  status?: string;
  from1?: string;
  to_go?: string;
}

// Trip tarixi sahifasi
const TripHistoryPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [statsData, setStatsData] = useState({
    rays_count: 0,
    rays_kilometr: 0,
    rays_price: 0,
    rays_total_price: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [pagination.current, pagination.pageSize, searchText, dateRange]);

  // Reyslar ro'yxatini olish
  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params: TripQueryParams = {
        page: pagination.current,
        page_size: pagination.pageSize
      };
      
      // Add search filter if exists
      if (searchText) {
        params.search = searchText;
      }
      
      // Add date range if exists
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.from_date = dateRange[0].format('YYYY-MM-DD');
        params.to_date = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await axiosInstance.get('/rayshistory/', { params });
      
      if (response.data) {
        // Handle pagination response format
        if (response.data.results && Array.isArray(response.data.results)) {
        setTrips(response.data.results);
          setPagination({
            ...pagination,
            total: response.data.count || response.data.results.length
          });
        console.log("Paginatsiya ma'lumotlari yuklandi:", response.data.results.length);
        } 
        // Handle direct array response
        else if (Array.isArray(response.data)) {
          setTrips(response.data);
          setPagination({
            ...pagination,
            total: response.data.length
          });
          console.log("Ma'lumotlar yuklandi:", response.data.length);
      }
      else {
        console.error('API xato javob qaytardi:', response.data);
        setTrips([]);
        setError('Server ma\'lumotlari noto\'g\'ri formatda');
        }
      }
    } catch (err) {
      console.error('Reyslarni yuklashda xatolik:', err);
      setError('Reyslarni yuklashda xatolik yuz berdi');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // Statistika ma'lumotlarini serverdan olish
  const fetchOverviewStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axiosInstance.get('/rayshistory/rayshistory-overview/');
      
      if (response.data) {
        setStatsData(response.data);
        console.log("Statistika ma'lumotlari yuklandi:", response.data);
      } else {
        console.error('Statistika API xato javob qaytardi:', response.data);
        // Keep default values if API returns invalid data
      }
    } catch (err) {
      console.error('Statistikani yuklashda xatolik:', err);
      message.error('Statistika ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setStatsLoading(false);
    }
  };

  // Reys haqida batafsil ma'lumotlarni ko'rish
  const viewTripDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailsVisible(true);
  };

  // Reysni qaytarish (aktivga qaytarish)
  const handleReturnTrip = async (tripId: number) => {
    try {
      setIsReturning(true);
      setSelectedTrip(prev => prev && prev.id === tripId ? prev : trips.find(t => t.id === tripId) || null);
      setConfirmLoading(true);
      
      await axiosInstance.post(`/rayshistory-actions/${tripId}/restore/`);
      
      message.success('Reys muvaffaqiyatli qaytarildi');
      fetchTrips();
      setDetailsVisible(false);
      
    } catch (err) {
      console.error('Reysni qaytarishda xatolik:', err);
      message.error('Reysni qaytarishda xatolik yuz berdi');
    } finally {
      setIsReturning(false);
      setConfirmLoading(false);
    }
  };
  
  // 2 kundan ko'p vaqt o'tgan reyslarni qaytarib bo'lmaydi
  const canReturnTrip = (trip: Trip) => {
    const createdAt = dayjs(trip.created_at);
    const now = dayjs();
    const diff = now.diff(createdAt, 'day');
    return diff <= 2;
  };

  const exportToExcel = async (period: string | null = null, customRange: [Dayjs, Dayjs] | null = null) => {
    try {
      setIsExporting(true);
      
      const url = '/rays-export/export/';
      const params: ExportParams = {};
      if (period) {
        params.period = period;
      } 
      else if (customRange && customRange[0] && customRange[1]) {
        params.from = customRange[0].format('YYYY-MM-DD');
        params.to = customRange[1].format('YYYY-MM-DD');
      }
      else if (dateRange && dateRange[0] && dateRange[1]) {
        params.from = dateRange[0].format('YYYY-MM-DD');
        params.to = dateRange[1].format('YYYY-MM-DD');
      }
      
      // Call export API with parameters
      const response = await axiosInstance.get(url, {
        params,
        responseType: 'blob',
      });
      
      // Download the file
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileUrl;
      
      // Set filename with date
      const currentDate = new Date().toISOString().split('T')[0];
      let fileName = `reyslar_tarixi_${currentDate}`;
      
      if (period) {
        fileName += `_${period}`;
      } else if (customRange && customRange[0] && customRange[1]) {
        const fromDate = customRange[0].format('YYYY-MM-DD');
        const toDate = customRange[1].format('YYYY-MM-DD');
        fileName += `_${fromDate}_${toDate}`;
      }
      
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Excel fayli muvaffaqiyatli yuklandi');
    } catch (err) {
      console.error('Excel faylini yuklashda xatolik:', err);
      message.error('Excel faylini yuklashda xatolik yuz berdi');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle pagination change
  const handleTableChange = (page: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize
    });
  };
    
  // Handle search input
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({
      ...pagination,
      current: 1 // Reset to first page on new search
    });
  };

  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    setDateRange(dates);
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const getStats = () => {
    return statsData;
  };

  const TripTable = ({
    trips,
    onViewDetails,
    loading,
    pagination,
    onChange
  }: {
    trips: Trip[],
    onViewDetails: (trip: Trip) => void,
    loading: boolean,
    pagination: {
      current: number,
      pageSize: number,
      total: number
    },
    onChange: (page: number, pageSize?: number) => void
  }) => {
    const displayTrips = Array.isArray(trips) ? trips : [];
    const tripColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 70,
      },
      {
        title: 'Haydovchi',
        key: 'driver',
        render: (_: unknown, record: Trip) => (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{record.driver?.fullname}</Text>
          </Space>
        ),
      },
      {
        title: 'Mijoz',
        key: 'client',
        render: (_: unknown, record: Trip) => (
          <Text strong>
            {record.client && record.client.length > 0
              ? record.client[0]?.company || record.client[0]?.first_name || 'Mijoz kiritilmagan'
              : 'Mijoz kiritilmagan'}
          </Text>
        ),
      },
      {
        title: 'Transport',
        key: 'transport',
        render: (_: unknown, record: Trip) => (
          <Space direction="vertical" size="small">
            <Space>
              <CarOutlined /> {record.car ? `${record.car.name} (${record.car.number})` : '-'}
            </Space>
            {record.fourgon && (
              <Space>
                <Tag color="blue">{record.fourgon.name} ({record.fourgon.number})</Tag>
              </Space>
            )}
          </Space>
        ),
      },
      {
        title: 'Davlat',
        key: 'country',
        render: (_: unknown, record: Trip) => (
          <Text>{record.country?.name || '-'}</Text>
        ),
      },
      {
        title: 'Masofa',
        dataIndex: 'kilometer',
        key: 'kilometer',
        render: (kilometer: number) => `${kilometer} km`,
      },
      {
        title: 'Narx',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => <Text strong style={{ color: '#52c41a' }}>{price?.toLocaleString() || 0} $</Text>,
      },
      {
        title: 'Sana',
        key: 'date',
        render: (_: unknown, record: Trip) => (
          <Space>
            <CalendarOutlined />
            <Text>{dayjs(record.created_at).format('DD.MM.YYYY')}</Text>
          </Space>
        ),
      },
      {
        title: 'Amallar',
        key: 'actions',
        render: (_: unknown, record: Trip) => (
          <Space>
            <Button
              type="primary"
              size="small"
              style={styles.actionButton}
              onClick={() => onViewDetails(record)}
            >
              Batafsil
            </Button>
            
            {canReturnTrip(record) ? (
              <Popconfirm
                title="Reysni qaytarish"
                description="Ushbu reysni aktivlarga qaytarishni xohlaysizmi?"
                onConfirm={() => handleReturnTrip(record.id)}
                okText="Ha"
                cancelText="Yo'q"
                okButtonProps={{ loading: confirmLoading }}
                icon={<InfoCircleOutlined style={{ color: 'blue' }} />}
              >
                <Button
                  size="small"
                  type="default"
                  icon={<RollbackOutlined />}
                  style={styles.actionButton}
                  loading={isReturning && selectedTrip?.id === record.id}
                >
                  Qaytarish
                </Button>
              </Popconfirm>
            ) : (
              <Button
                size="small"
                type="default"
                icon={<RollbackOutlined />}
                style={styles.actionButton}
                disabled
                title="Reys 2 kundan ko'p vaqt o'tgani uchun qaytarib bo'lmaydi"
              >
                Qaytarib bo`lmaydi
              </Button>
            )}
          </Space>
        ),
      },
    ];

    return (
      <Table
        dataSource={displayTrips}
        columns={tripColumns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: onChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Jami ${total} ta reys`
        }}
        style={styles.tableStyles}
      />
    );
  };

  // Reys haqida batafsil ma'lumot
  const TripDetailsDrawer = () => {
    if (!selectedTrip) return null;
    
    const drawerTabItems = [
      {
        key: "general",
        label: <><UserOutlined /> Umumiy ma`lumotlar</>,
        children: (
          <Card style={styles.detailsCard}>
            <Space align="start" style={{ marginBottom: 16 }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                  {selectedTrip.driver?.fullname || "Ma'lumot kiritilmagan"}
                </Title>
                <Text type="secondary">
                  {selectedTrip.driver?.phone_number || "Telefon raqami kiritilmagan"}
                </Text>
              </div>
            </Space>

            <Descriptions bordered column={1}>
              <Descriptions.Item label={<><CalendarOutlined /> Yaratilgan sana</>}>
                {dayjs(selectedTrip.created_at).format('DD.MM.YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label={<><CarOutlined /> Mashina</>}>
                {selectedTrip.car?.name} ({selectedTrip.car?.number})
              </Descriptions.Item>
              {selectedTrip.fourgon && (
              <Descriptions.Item label={<><CarOutlined /> Furgon</>}>
                {selectedTrip.fourgon?.name} ({selectedTrip.fourgon?.number})
              </Descriptions.Item>
              )}
              <Descriptions.Item label={<><EnvironmentOutlined /> Davlat</>}>
                {selectedTrip.country?.name || 'Kiritilmagan'}
              </Descriptions.Item>
              <Descriptions.Item label={<><EnvironmentOutlined /> Masofa</>}>
                {selectedTrip.kilometer || 0} km
              </Descriptions.Item>
              <Descriptions.Item label={<><InfoCircleOutlined /> Izoh</>}>
                {selectedTrip.dp_information || "Ma'lumot kiritilmagan"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )
      },
      {
        key: "financial",
        label: <><DollarOutlined /> Moliyaviy ma`lumotlar</>,
        children: (
          <>
            <Card style={styles.detailsCard}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic 
                    title="Reys narxi" 
                    value={selectedTrip.price || 0} 
                    suffix="$"
                    valueStyle={{ color: '#1890ff' }}
                    precision={0}
                    formatter={value => value.toLocaleString()}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Haydovchi xarajatlari"
                    value={selectedTrip.dr_price || 0}
                    suffix="$"
                    valueStyle={{ color: '#fa8c16' }}
                    precision={0}
                    formatter={value => value.toLocaleString()}
                  />
                </Col>
              </Row>

              <Descriptions bordered column={1} style={{ marginTop: 24 }}>
                <Descriptions.Item label="Haydovchiga to'lov">
                  {selectedTrip.dp_price?.toLocaleString() || 0} {selectedTrip.dp_currency_name || '$'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            {selectedTrip.expenses && (
              <>
                <Card title={<><DollarOutlined /> Texnik xizmat xarajatlari</>} style={styles.detailsCard}>
                  {selectedTrip.expenses.texnics && selectedTrip.expenses.texnics.length > 0 ? (
                    <Table
                      dataSource={selectedTrip.expenses.texnics}
                      columns={[
                        {
                          title: 'Mashina',
                          dataIndex: 'car_name',
                          key: 'car_name',
                        },
                        {
                          title: 'Narx',
                          dataIndex: 'price',
                          key: 'price',
                          render: (price: number) => <Text strong>{price?.toLocaleString()} $</Text>,
                        },
                        {
                          title: 'Kilometr',
                          dataIndex: 'kilometer',
                          key: 'kilometer',
                        },
                        {
                          title: 'Sana',
                          dataIndex: 'created_at',
                          key: 'created_at',
                          render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
                        },
                      ]}
                      pagination={false}
                    />
                  ) : (
                    <Alert message="Texnik xizmat xarajatlari mavjud emas" type="info" />
                  )}
                </Card>

                <Card title={<><DollarOutlined /> Balon xarajatlari</>} style={styles.detailsCard}>
                  {selectedTrip.expenses.balons && selectedTrip.expenses.balons.length > 0 ? (
                    <Table
                      dataSource={selectedTrip.expenses.balons}
                      columns={[
                        {
                          title: 'Mashina',
                          dataIndex: 'car_name',
                          key: 'car_name',
                        },
                        {
                          title: 'Turi',
                          dataIndex: 'type',
                          key: 'type',
                        },
                        {
                          title: 'Narx',
                          dataIndex: 'price',
                          key: 'price',
                          render: (price: number) => <Text strong>{price?.toLocaleString()} $</Text>,
                        },
                        {
                          title: 'Kilometr',
                          dataIndex: 'kilometr',
                          key: 'kilometr',
                        },
                        {
                          title: 'Soni',
                          dataIndex: 'count',
                          key: 'count',
                        },
                      ]}
                      pagination={false}
                    />
                  ) : (
                    <Alert message="Balon xarajatlari mavjud emas" type="info" />
                  )}
                </Card>

                <Card title={<><DollarOutlined /> Furgon balon xarajatlari</>} style={styles.detailsCard}>
                  {selectedTrip.expenses.balon_furgons && selectedTrip.expenses.balon_furgons.length > 0 ? (
                    <Table
                      dataSource={selectedTrip.expenses.balon_furgons}
                      columns={[
                        {
                          title: 'Furgon',
                          dataIndex: 'furgon_name',
                          key: 'furgon_name',
                        },
                        {
                          title: 'Turi',
                          dataIndex: 'type',
                          key: 'type',
                        },
                        {
                          title: 'Narx',
                          dataIndex: 'price',
                          key: 'price',
                          render: (price: number) => <Text strong>{price?.toLocaleString()} $</Text>,
                        },
                        {
                          title: 'Kilometr',
                          dataIndex: 'kilometr',
                          key: 'kilometr',
                        },
                        {
                          title: 'Soni',
                          dataIndex: 'count',
                          key: 'count',
                        },
                      ]}
                      pagination={false}
                    />
                  ) : (
                    <Alert message="Furgon balon xarajatlari mavjud emas" type="info" />
                  )}
                </Card>

                <Card title={<><DollarOutlined /> Optol xarajatlari</>} style={styles.detailsCard}>
                  {selectedTrip.expenses.optols && selectedTrip.expenses.optols.length > 0 ? (
                    <Table
                      dataSource={selectedTrip.expenses.optols}
                      columns={[
                        {
                          title: 'Mashina',
                          dataIndex: 'car_name',
                          key: 'car_name',
                        },
                        {
                          title: 'Narx',
                          dataIndex: 'price',
                          key: 'price',
                          render: (price: number) => <Text strong>{price?.toLocaleString()} $</Text>,
                        },
                        {
                          title: 'Kilometr',
                          dataIndex: 'kilometr',
                          key: 'kilometr',
                        },
                        {
                          title: 'Sana',
                          dataIndex: 'created_at',
                          key: 'created_at',
                          render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
                        },
                      ]}
                      pagination={false}
                    />
                  ) : (
                    <Alert message="Optol xarajatlari mavjud emas" type="info" />
                  )}
                </Card>

                <Card title={<><DollarOutlined /> Chiqim xarajatlari</>} style={styles.detailsCard}>
                  {selectedTrip.expenses.chiqimliks && selectedTrip.expenses.chiqimliks.length > 0 ? (
                    <Table
                      dataSource={selectedTrip.expenses.chiqimliks}
                      columns={[
                        {
                          title: 'Haydovchi',
                          dataIndex: 'driver_name',
                          key: 'driver_name',
                        },
                        {
                          title: 'Narx',
                          dataIndex: 'price',
                          key: 'price',
                          render: (price: number) => <Text strong>{price?.toLocaleString()} $</Text>,
                        },
                        {
                          title: 'Izoh',
                          dataIndex: 'description',
                          key: 'description',
                        },
                        {
                          title: 'Sana',
                          dataIndex: 'created_at',
                          key: 'created_at',
                          render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
                        },
                      ]}
                      pagination={false}
                    />
                  ) : (
                    <Alert message="Chiqim xarajatlari mavjud emas" type="info" />
                  )}
                </Card>

                <Card title={<><DollarOutlined /> Ariza va referenslar</>} style={styles.detailsCard}>
                  <Tabs
                    items={[
                      {
                        key: 'arizalar',
                        label: 'Arizalar',
                        children: selectedTrip.expenses.arizalar && selectedTrip.expenses.arizalar.length > 0 ? (
                <List
                            dataSource={selectedTrip.expenses.arizalar}
                            renderItem={(item) => (
                              <List.Item>
                      <List.Item.Meta
                                  title={`Haydovchi: ${item.driver_name}`}
                        description={item.description}
                      />
                                <Text type="secondary">{dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}</Text>
                    </List.Item>
                  )}
                          />
                        ) : (
                          <Alert message="Arizalar mavjud emas" type="info" />
                        )
                      },
                      {
                        key: 'referenslar',
                        label: 'Referenslar',
                        children: selectedTrip.expenses.referenslar && selectedTrip.expenses.referenslar.length > 0 ? (
                          <List
                            dataSource={selectedTrip.expenses.referenslar}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta
                                  title={`Haydovchi: ${item.driver_name}`}
                                  description={item.description}
                                />
                                <Text type="secondary">{dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}</Text>
                              </List.Item>
                            )}
                          />
                        ) : (
                          <Alert message="Referenslar mavjud emas" type="info" />
                        )
                      }
                    ]}
                />
              </Card>

                <Card style={styles.detailsCard}>
                  <Statistic
                    title="Jami xarajatlar"
                    value={selectedTrip.expenses.total_usd || 0}
                    suffix="$"
                    valueStyle={{ color: '#fa8c16' }}
                    precision={2}
                    formatter={value => value.toLocaleString()}
                  />
                </Card>
              </>
            )}
          </>
        )
      },
      {
        key: "clients",
        label: <><TeamOutlined /> Mijozlar va mahsulotlar</>,
        children: (
          <>
            {selectedTrip.client && selectedTrip.client.length > 0 ? (
              selectedTrip.client.map((client, index) => (
                <Card 
                  key={client.id || index} 
                  title={
                    <Space>
                      <UserOutlined />
                      <span>{client.company || `${client.first_name} ${client.last_name || ''}`}</span>
                    </Space>
                  }
                  extra={<Text type="secondary">{client.number}</Text>}
                  style={styles.clientCard}
                >
                  {client.products && client.products.length > 0 ? (
                    <Table
                      dataSource={client.products}
                      columns={[
                        {
                          title: 'Mahsulot',
                          dataIndex: 'name',
                          key: 'name',
                        },
                        {
                          title: 'Narx',
                          dataIndex: 'price',
                          key: 'price',
                          render: (price: number, record: any) => (
                            <Text strong style={{ color: '#52c41a' }}>
                              {price?.toLocaleString() || 0} {record.currency_name}
                            </Text>
                          ),
                        },
                        {
                          title: 'USD narxi',
                          dataIndex: 'price_in_usd',
                          key: 'price_in_usd',
                          render: (price: string) => (
                            <Text strong style={{ color: '#1890ff' }}>
                              {parseFloat(price).toLocaleString()} $
                            </Text>
                          ),
                        },
                        {
                          title: 'Soni',
                          dataIndex: 'count',
                          key: 'count',
                        },
                      ]}
                      summary={(pageData) => {
                        return (
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={4}>
                              <Text strong>Jami USD:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                              <Text strong style={{ color: '#52c41a' }}>{selectedTrip.price?.toLocaleString()} $</Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        );
                      }}
                      style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}
                    />
                  ) : (
                    <Alert message="Mahsulotlar mavjud emas" type="info" />
                  )}
                </Card>
              ))
            ) : (
              <Alert message="Mijozlar mavjud emas" type="info" />
            )}
          </>
        )
      }
    ];

    return (
      <Drawer
        title={`Reys #${selectedTrip.id} tafsilotlari`}
        width={768}
        placement="right"
        onClose={() => setDetailsVisible(false)}
        open={detailsVisible}
        bodyStyle={styles.drawerContent}
        extra={
          canReturnTrip(selectedTrip) ? (
            <Button
              type="primary"
              icon={<RollbackOutlined />}
              onClick={() => handleReturnTrip(selectedTrip.id)}
              danger
            >
              Qaytarish
            </Button>
          ) : (
            <Button
              type="default"
              icon={<RollbackOutlined />}
              disabled
              title="Reys 2 kundan ko'p vaqt o'tgani uchun qaytarib bo'lmaydi"
            >
              Qaytarish
            </Button>
          )
        }
      >
        <Tabs defaultActiveKey="general" style={styles.drawerTabs} items={drawerTabItems} />
      </Drawer>
    );
  };

  const stats = getStats();
  return (
    <div style={styles.pageContainer}>
      <Card style={styles.header}>
        <div style={styles.headerRow}>
          <div>
            <Title level={3} style={styles.title}>Reyslar tarixi</Title>
            <Text type="secondary">Bu yerda barcha yakunlangan reyslar ro`yxati ko`rsatilgan</Text>
          </div>
          <div>
            <Dropdown menu={{
              items: [
                {
                  key: 'all',
                  label: 'Barcha ma\'lumotlarni eksport qilish',
                  onClick: () => exportToExcel()
                },
                {
                  key: 'current',
                  label: 'Joriy filtrlangan ma\'lumotlarni eksport qilish',
                  onClick: () => exportToExcel(null, dateRange)
                },
                {
                  key: 'period',
                  label: 'Davr bo\'yicha eksport qilish',
                  children: [
                    {
                      key: 'week',
                      label: 'Haftalik',
                      onClick: () => exportToExcel('week')
                    },
                    {
                      key: 'month',
                      label: 'Oylik',
                      onClick: () => exportToExcel('month')
                    },
                    {
                      key: 'year',
                      label: 'Yillik',
                      onClick: () => exportToExcel('year')
                    }
                  ]
                }
              ]
            }}>
              <Button 
                type="primary" 
                loading={isExporting} 
                icon={<ExportOutlined />}
                style={{ 
                  background: '#1677ff', 
                  borderRadius: '4px',
                }}
              >
                Eksport <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]} style={styles.statsSection}>
        <Col xs={24} sm={12} md={6}>
          <Card style={styles.statisticCard}>
            <Statistic
              title="Jami reyslar"
              value={stats.rays_count}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={styles.statisticCard}>
            <Statistic
              title="Jami masofa"
              value={stats.rays_kilometr}
              suffix="km"
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={styles.statisticCard}>
            <Statistic
              title="Jami summa"
              value={stats.rays_price}
              suffix="$"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={value => value.toLocaleString()}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={styles.statisticCard}>
            <Statistic
              title="Jami foyda"
              value={stats.rays_total_price}
              suffix="$"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
              formatter={value => value.toLocaleString()}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ ...styles.card, ...styles.tableCard }}>
        <div style={styles.filtersContainer}>
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined style={{ fontSize: '18px', color: '#1677ff' }} />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            style={styles.filterInput}
              allowClear
              size="large"
            />
            <RangePicker
            style={styles.filterInput}
              placeholder={['Boshlanish', 'Tugash']}
              onChange={handleDateRangeChange}
              size="large"
          />
      </div>

        {error ? (
          <Alert message={error} type="error" />
        ) : (
          <TripTable 
            trips={trips} 
            onViewDetails={viewTripDetails} 
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
          />
        )}
      </Card>

      <TripDetailsDrawer />
    </div>
  );
};

export default TripHistoryPage;