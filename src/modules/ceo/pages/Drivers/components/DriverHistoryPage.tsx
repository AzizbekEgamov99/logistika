'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Row, Col, Typography, Tag, Space, Empty, Tabs, List, Avatar, Collapse, Statistic, Divider, message, Pagination, Form, Input, Select, DatePicker, Modal, Popconfirm } from 'antd';
import {  UserOutlined,  CarOutlined,  HistoryOutlined,  DollarOutlined,  RollbackOutlined,  EnvironmentOutlined,  PhoneOutlined,  TeamOutlined,  CalendarOutlined,  TrophyOutlined,  BoxPlotOutlined,  ThunderboltOutlined,  IdcardOutlined} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axiosInstance, { formatImageUrl } from '../../../../../api/axiosInstance';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useCEODrivers } from '../../../hooks/useCEODrivers';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const statusColors = {
  'active': 'success',
  'inactive': 'default',
  'on_trip': 'processing',
  'suspended': 'error',
  'waiting': 'warning'
};

const statusNames = {
  'active': 'Faol',
  'inactive': 'Nofaol',
  'on_trip': 'Reysda',
  'suspended': 'To\'xtatilgan',
  'waiting': 'Kutmoqda'
};
const historyStyles = `
  .history-container {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    margin-top: 16px;
  }
  
  .driver-info-container {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  .avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .avatar-large {
    width: 120px;
    height: 120px;
    font-size: 48px;
    line-height: 120px;
    border: 3px solid #f0f0f0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .driver-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .driver-info-icon {
    margin-right: 8px;
    color: #1890ff;
  }
  
  .trip-card {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: all 0.3s;
  }
  
  .trip-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .trip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .trip-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .trip-details {
    padding: 16px;
  }
  
  .trip-route {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .trip-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #1890ff;
    margin: 0 8px;
  }
  
  .trip-line {
    flex: 1;
    height: 2px;
    background-color: #1890ff;
    position: relative;
  }
  
  .trip-arrow {
    position: absolute;
    right: -5px;
    top: -4px;
    width: 0;
    height: 0;
    border-left: 6px solid #1890ff;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
  
  .product-item {
    padding: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  
  .product-name {
    font-weight: 500;
  }
  
  .statistics-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stat-card {
    width: calc(50% - 8px);
  }
  
  .client-tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }
  
  .product-list {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 8px;
  }
  
  .expense-item {
    border-bottom: 1px dashed #f0f0f0;
    padding: 8px 0;
  }
  
  .price-value {
    color: #f5222d;
    font-weight: 500;
  }
  
  .driver-status {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .driver-status-icon {
    margin-right: 6px;
  }
  
  .driver-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .driver-info {
    margin-left: 16px;
  }
  
  .trip-status-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
  }
  
  .action-btn-section {
    display: flex;
    gap: 8px;
    margin-top: 24px;
    justify-content: flex-end;
  }
  
  .loading-placeholder {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface DriverHistoryPageProps {
  id?: string;
}
interface DriverInfo {
  id: number;
  fullname: string;
  first_name?: string;
  last_name?: string;
  phone_number: string;
  avatar?: string;
  address?: string;
  passport?: string;
  birth_date?: string;
  driver_license?: string;
  license_number?: string;
  license_expiry?: string;
  status?: string;
  city?: string;
  photo?: string;
}

interface Trip {
  id: number;
  rays_id: number | null;
  country: {
    id: number;
    name: string;
  };
  driver: {
    id: number;
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
  client: Array<{
    id: number;
    first_name: string;
    last_name: string;
    number: string;
    products: Array<unknown>;
  }>;
  price: number;
  dr_price: number;
  dp_price: number;
  kilometer: number;
  dp_information: string;
  created_at: string;
  count: number;
  expenses: Array<{
    description?: string;
    price: number;
    created_at?: string;
  }>;
  status?: 'completed' | 'in_progress' | string;
}

interface DriverHistoryResponse {
  history: Trip[];
  driver?: DriverInfo;
}

const DriverHistoryPage: React.FC<DriverHistoryPageProps> = ({ id }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [driverHistory, setDriverHistory] = useState<DriverHistoryResponse>({ history: [] });
  const [stats, setStats] = useState<{
    totalTrips: number;
    totalKm: number;
    totalEarnings: number;
    avgKmPerTrip: number;
    completedTrips: number;
    ongoingTrips: number;
  }>({
    totalTrips: 0,
    totalKm: 0,
    totalEarnings: 0,
    avgKmPerTrip: 0,
    completedTrips: 0,
    ongoingTrips: 0
  });
  const [activeTab, setActiveTab] = useState<string>('trips');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [expandedTrips, setExpandedTrips] = useState<string[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const router = useRouter();
  const { deleteDriver, updateDriver } = useCEODrivers();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const driverId = id ? parseInt(id as string, 10) : 0;

  console.log('Driver History Page loaded with ID:', driverId);

  useEffect(() => {
    if (!driverId) {
      setError('Invalid driver ID');
      setLoading(false);
      return;
    }

    fetchData();
  }, [driverId]);

  useEffect(() => {
    if (!isClient) return;
    
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(historyStyles));
    document.head.appendChild(styleElement);

    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [isClient]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/customusers/${id}/driver-history/`);

      if (response.data && response.data.history) {
        setDriverHistory({ history: response.data.history });

        try {
          setStats(calculateStats(response.data.history));
        } catch (statsError) {
          console.error('Error calculating stats:', statsError);
        }
      } else {
        console.error('Invalid response data structure:', response.data);
        setError('Invalid response data structure');
      }

      if (!driverInfo) {
        try {
          const driverResponse = await axiosInstance.get(`/customusers/${id}/`);
          setDriverInfo(driverResponse.data);
        } catch (driverError) {
          console.error('Error fetching driver details:', driverError);
        }
      }
    } catch (error) {
      console.error('Error fetching driver history:', error);
      setError("Haydovchi ma'lumotlarini yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('Refreshing driver data...');
    try {
      await fetchData();
      message.success('Ma\'lumotlar yangilandi');
    } catch (error) {
      console.error('Error refreshing data:', error);
      message.error('Ma\'lumotlarni yangilashda xatolik yuz berdi');
    }
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) {
      return '$0';
    }
    return `$${amount.toLocaleString('en-US')}`;
  };

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) {
      return '0';
    }
    return num.toLocaleString('en-US');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Mavjud emas';
    
    try {
      const date = new Date(dateString);
      
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const calculateStats = (history: Trip[] | undefined): { totalTrips: number, totalKm: number, totalEarnings: number, avgKmPerTrip: number, completedTrips: number, ongoingTrips: number } => {
    if (!history || !Array.isArray(history) || history.length === 0)
      return { totalTrips: 0, totalKm: 0, totalEarnings: 0, avgKmPerTrip: 0, completedTrips: 0, ongoingTrips: 0 };

    const totalTrips = history.length;
    const totalKm = history.reduce((sum, trip) => sum + (trip.kilometer || 0), 0);
    const totalEarnings = history.reduce((sum, trip) => sum + (trip.dr_price || 0), 0);
    const avgKmPerTrip = totalTrips > 0 ? totalKm / totalTrips : 0;
    const completedTrips = history.filter(trip => trip.status === 'completed').length;
    const ongoingTrips = history.filter(trip => trip.status === 'in_progress').length;

    return { totalTrips, totalKm, totalEarnings, avgKmPerTrip, completedTrips, ongoingTrips };
  };
  const handleEditDriver = () => {
    if (!driverInfo) return;
    form.setFieldsValue({
      first_name: driverInfo.first_name || '',
      last_name: driverInfo.last_name || '',
      phone_number: driverInfo.phone_number || '',
      address: driverInfo.address || '',
      passport: driverInfo.passport || '',
      license_number: driverInfo.license_number || '',
      license_expiry: driverInfo.license_expiry ? new Date(driverInfo.license_expiry) : undefined,
      status: driverInfo.status || 'active'
    });

    setIsEditModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (!driverId) return;

    setEditFormLoading(true);

    try {
      const formattedValues = {
        ...values,
        license_expiry: values.license_expiry && typeof values.license_expiry.toISOString === 'function'
          ? values.license_expiry.toISOString().split('T')[0]
          : values.license_expiry || undefined,
      };
      await updateDriver(driverId, formattedValues);
      message.success('Haydovchi ma\'lumotlari muvaffaqiyatli yangilandi');
      setDriverInfo(prev => prev ? { ...prev, ...formattedValues } : null);
      setIsEditModalVisible(false);

      await refreshData();
    } catch (error) {
      console.error('Error updating driver:', error);
      message.error('Haydovchi ma\'lumotlarini yangilashda xatolik yuz berdi');
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleDeleteDriver = async () => {
    if (!driverId) return;

    try {
      await deleteDriver(driverId);
      message.success('Haydovchi muvaffaqiyatli o\'chirildi');
      setIsDeleteModalVisible(false);
      router.push('/modules/ceo/drivers');
    } catch (error) {
      console.error('Error deleting driver:', error);
      message.error('Haydovchini o\'chirishda xatolik yuz berdi');
    }
  };

  const getDriverStatusDisplay = (driver: DriverInfo) => {
    const status = driver.status || 'inactive';
    const color = statusColors[status] || 'default';

    return (
      <div className="driver-status" style={{ backgroundColor: `${color === 'success' ? '#f6ffed' : color === 'processing' ? '#e6f7ff' : color === 'warning' ? '#fffbe6' : color === 'error' ? '#fff2f0' : '#f5f5f5'}`, color: `${color === 'success' ? '#52c41a' : color === 'processing' ? '#1890ff' : color === 'warning' ? '#faad14' : color === 'error' ? '#f5222d' : '#8c8c8c'}` }}>
        {status === 'active' && <UserOutlined className="driver-status-icon" />}
        {status === 'on_trip' && <CarOutlined className="driver-status-icon" />}
        {status === 'waiting' && <UserOutlined className="driver-status-icon" />}
        {status === 'inactive' && <UserOutlined className="driver-status-icon" />}
        {statusNames[status] || status}
      </div>
    );
  };

  const toggleTripExpansion = (tripId: string) => {
    setExpandedTrips(prev =>
      prev.includes(tripId)
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const getCurrentPageTrips = () => {
    const trips = driverHistory.history || [];
    const startIndex = (currentPage - 1) * pageSize;
    return trips.slice(startIndex, startIndex + pageSize);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const tripsSection = document.getElementById('trips-section');
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isClient) {
    return <DashboardLayout title="Haydovchi tarixi"><div className="loading-placeholder"></div></DashboardLayout>;
  }

  if (loading) {
    return (
      <DashboardLayout title="Haydovchi tarixi" subtitle="Ma'lumotlar yuklanmoqda...">
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Ma'lumotlar yuklanmoqda...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Haydovchi tarixi" subtitle="Xatolik">
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                <Text type="danger">{error}</Text>
                <br />
                <Button type="primary" onClick={() => router.back()} style={{ marginTop: 16 }}>
                  Orqaga qaytish
                </Button>
              </span>
            }
          />
        </Card>
      </DashboardLayout>
    );
  }

  const driver = driverInfo || (driverHistory.history[0]?.driver ? {
    id: driverId,
    fullname: driverHistory.history[0].driver.fullname,
    phone_number: driverHistory.history[0].driver.phone_number
  } : null);

  if (!driver) {
    return (
      <DashboardLayout title="Haydovchi tarixi" subtitle="Haydovchi ma'lumotlari">
        <div>Ma'lumotlar topilmadi</div>
      </DashboardLayout>
    );
  }

  if (!driverHistory.history.length) {
    return (
      <DashboardLayout title="Haydovchi tarixi" subtitle={driver.fullname || `${driver.first_name || ''} ${driver.last_name || ''}`}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="driver-info-container">
              <div className="avatar-container">
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  src={formatImageUrl(driver.avatar || driver.photo) || undefined}
                  className="avatar-large"
                />
              </div>

              <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
                {driver.fullname || `${driver.first_name || ''} ${driver.last_name || ''}`}
              </Title>

              {driver.status && (
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {getDriverStatusDisplay(driver)}
                </div>
              )}

              <div className="driver-info-item">
                <PhoneOutlined className="driver-info-icon" />
                <Text>{driver.phone_number || 'Telefon raqami ko\'rsatilmagan'}</Text>
              </div>

              {(driver.address || driver.city) && (
                <div className="driver-info-item">
                  <EnvironmentOutlined className="driver-info-icon" />
                  <Text>{driver.address || ''} {driver.city ? `, ${driver.city}` : ''}</Text>
                </div>
              )}

              {(driver.passport) && (
                <div className="driver-info-item">
                  <IdcardOutlined className="driver-info-icon" />
                  <Text>Passport: {driver.passport}</Text>
                </div>
              )}

              {(driver.birth_date) && (
                <div className="driver-info-item">
                  <CalendarOutlined className="driver-info-icon" />
                  <Text>Tug'ilgan sana: {formatDate(driver.birth_date)}</Text>
                </div>
              )}

              {(driver.driver_license || driver.license_number) && (
                <div className="driver-info-item">
                  <CarOutlined className="driver-info-icon" />
                  <Text>Haydovchilik guvohnomasi: {driver.driver_license || driver.license_number}</Text>
                </div>
              )}

              {driver.license_expiry && (
                <div className="driver-info-item">
                  <CalendarOutlined className="driver-info-icon" />
                  <Text>Guvohnoma muddati: {formatDate(driver.license_expiry)}</Text>
                </div>
              )}

              <div className="action-btn-section">
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  onClick={() => router.push('/modules/ceo/drivers')}
                >
                  Ro'yxatga qaytish
                </Button>
                <Button 
                  type="default"
                  onClick={handleEditDriver}
                >
                  Tahrirlash
                </Button>
              </div>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <Card>
              <Empty description="Haydovchi tarixi ma'lumotlari topilmadi" />
            </Card>
          </Col>
        </Row>
      </DashboardLayout>
    );
  }

  const renderTrips = () => {
    const trips = driverHistory.history || [];

    if (trips.length === 0) {
      return <Empty description="Haydovchi reyslar tarixi topilmadi" />;
    }

    const currentTrips = getCurrentPageTrips();

    return (
      <div id="trips-section">
        <List
          dataSource={currentTrips}
          renderItem={(trip: Trip) => (
            <Collapse
              activeKey={expandedTrips}
              onChange={(keys) => setExpandedTrips(keys as string[])}
              className="trip-collapse"
            >
              <Panel
                key={`trip-${trip.id}`}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div>
                      <strong>Reys #{trip.id}</strong> - {formatDate(trip.created_at)}
                    </div>
                    <div>
                      <Tag color="blue">{trip.car?.name} ({trip.car?.number})</Tag>
                      <Tag color="green">{formatCurrency(trip.dr_price)}</Tag>
                      <Tag color="orange">{trip.kilometer} km</Tag>
                    </div>
                  </div>
                }
              >
                <Card className="trip-card" key={trip.id} style={{ marginBottom: 0 }}>
                  <div className="trip-details">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div className="driver-info-item">
                          <CalendarOutlined className="driver-info-icon" />
                          <span>Sana: <Text strong>{formatDate(trip.created_at)}</Text></span>
                        </div>

                        {trip.car && (
                          <div className="driver-info-item">
                            <CarOutlined className="driver-info-icon" />
                            <span>Transport: <Text strong>{trip.car.name} ({trip.car.number})</Text></span>
                          </div>
                        )}

                        {trip.fourgon && (
                          <div className="driver-info-item">
                            <BoxPlotOutlined className="driver-info-icon" />
                            <span>Furgon: <Text strong>{trip.fourgon.name} ({trip.fourgon.number})</Text></span>
                          </div>
                        )}

                        {trip.country && (
                          <div className="driver-info-item">
                            <EnvironmentOutlined className="driver-info-icon" />
                            <span>Davlat: <Text strong>{trip.country.name}</Text></span>
                          </div>
                        )}

                        <div className="driver-info-item">
                          <ThunderboltOutlined className="driver-info-icon" />
                          <span>Masofa: <Text strong>{formatNumber(trip.kilometer)} km</Text></span>
                        </div>

                        <div className="driver-info-item">
                          <TeamOutlined className="driver-info-icon" />
                          <span>Soni: <Text strong>{trip.count}</Text></span>
                        </div>
                      </Col>

                      <Col xs={24} md={12}>
                        <div className="driver-info-item">
                          <DollarOutlined className="driver-info-icon" />
                          <span>Reys narxi: <Text strong className="price-value">{formatCurrency(trip.price)}</Text></span>
                        </div>

                        <div className="driver-info-item">
                          <DollarOutlined className="driver-info-icon" />
                          <span>Haydovchi narxi: <Text strong className="price-value">{formatCurrency(trip.dr_price)}</Text></span>
                        </div>

                        <div className="driver-info-item">
                          <DollarOutlined className="driver-info-icon" />
                          <span>To'lov: <Text strong className="price-value">{formatCurrency(trip.dp_price)}</Text></span>
                        </div>

                        {trip.dp_information && (
                          <div className="driver-info-item">
                            <span>Qo'shimcha ma'lumot: <Text>{trip.dp_information}</Text></span>
                          </div>
                        )}

                        {trip.client && trip.client.length > 0 && (
                          <div className="driver-info-item">
                            <TeamOutlined className="driver-info-icon" />
                            <span>Mijozlar: <Text strong>{trip.client.length}</Text></span>
                          </div>
                        )}
                      </Col>

                      {trip.client && trip.client.length > 0 && (
                        <Col span={24}>
                          <Divider orientation="left">Mijozlar</Divider>
                          {trip.client.map((client, index) => (
                            <Tag key={index} color="blue" className="client-tag">
                              {client.first_name} {client.last_name} ({client.number})
                            </Tag>
                          ))}
                        </Col>
                      )}

                      {trip.expenses && trip.expenses.length > 0 && (
                        <Col span={24}>
                          <Divider orientation="left">Xarajatlar</Divider>
                          <List
                            size="small"
                            dataSource={trip.expenses}
                            renderItem={(expense, index) => (
                              <div className="expense-item" key={index}>
                                <Row>
                                  <Col span={16}>
                                    <Text>{expense.description || 'Xarajat'}</Text>
                                  </Col>
                                  <Col span={8} style={{ textAlign: 'right' }}>
                                    <Text className="price-value">{formatCurrency(expense.price)}</Text>
                                  </Col>
                                </Row>
                                {expense.created_at && (
                                  <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(expense.created_at)}</Text>
                                )}
                              </div>
                            )}
                          />
                        </Col>
                      )}
                    </Row>
                  </div>
                </Card>
              </Panel>
            </Collapse>
          )}
          pagination={false}
        />

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={trips.length}
            onChange={handlePageChange}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={['5', '10', '20', '50']}
            showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} reyslar`}
          />
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Haydovchi tarixi"
      subtitle={driver.fullname || `${driver.first_name || ''} ${driver.last_name || ''}`}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <div className="driver-info-container">
            <div className="avatar-container">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={driver.avatar || driver.photo}
                className="avatar-large"
              />
            </div>

            <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
              {driver.fullname || `${driver.first_name || ''} ${driver.last_name || ''}`}
            </Title>

            {driver.status && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                {getDriverStatusDisplay(driver)}
              </div>
            )}

            <div className="driver-info-item">
              <PhoneOutlined className="driver-info-icon" />
              <Text>{driver.phone_number || 'Telefon raqami ko\'rsatilmagan'}</Text>
            </div>

            {(driver.address || driver.city) && (
              <div className="driver-info-item">
                <EnvironmentOutlined className="driver-info-icon" />
                <Text>{driver.address || ''} {driver.city ? `, ${driver.city}` : ''}</Text>
              </div>
            )}

            {(driver.passport) && (
              <div className="driver-info-item">
                <IdcardOutlined className="driver-info-icon" />
                <Text>Passport: {driver.passport}</Text>
              </div>
            )}

            {(driver.birth_date) && (
              <div className="driver-info-item">
                <CalendarOutlined className="driver-info-icon" />
                <Text>Tug'ilgan sana: {formatDate(driver.birth_date)}</Text>
              </div>
            )}

            {(driver.driver_license || driver.license_number) && (
              <div className="driver-info-item">
                <CarOutlined className="driver-info-icon" />
                <Text>Haydovchilik guvohnomasi: {driver.driver_license || driver.license_number}</Text>
              </div>
            )}

            {driver.license_expiry && (
              <div className="driver-info-item">
                <CalendarOutlined className="driver-info-icon" />
                <Text>Guvohnoma muddati: {formatDate(driver.license_expiry)}</Text>
              </div>
            )}

            <Divider />

            <Title level={4}>Statistika</Title>
            <div className="statistics-container">
              <Card className="stat-card">
                <Statistic
                  title="Jami reyslar"
                  value={stats.totalTrips}
                  prefix={<HistoryOutlined />}
                />
              </Card>

              <Card className="stat-card">
                <Statistic
                  title="Jami masofa"
                  value={formatNumber(stats.totalKm)}
                  suffix="km"
                  prefix={<ThunderboltOutlined />}
                />
              </Card>

              <Card className="stat-card">
                <Statistic
                  title="Jami daromad"
                  value={formatCurrency(stats.totalEarnings)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>

              <Card className="stat-card">
                <Statistic
                  title="O'rtacha masofa"
                  value={formatNumber(Math.round(stats.avgKmPerTrip))}
                  suffix="km/reys"
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </div>

            <div className="action-btn-section">
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={() => router.push('/modules/ceo/drivers')}
              >
                Ro'yxatga qaytish
              </Button>
              <Button 
                type="default"
                onClick={handleEditDriver}
              >
                Tahrirlash
              </Button>
              <Button 
                type="default"
                onClick={refreshData}
              >
                Yangilash
              </Button>
              <Button 
                type="primary" 
                danger
                onClick={() => setIsDeleteModalVisible(true)}
              >
                O'chirish
              </Button>
            </div>
          </div>
        </Col>

        <Col xs={24} md={16}>
          <div className="history-container">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'trips',
                  label: <span><HistoryOutlined /> Reyslar tarixi ({driverHistory.history.length})</span>,
                  children: renderTrips()
                }
              ]}
            />
          </div>
        </Col>
      </Row>

      {/* Add Edit Driver Modal */}
      <Modal
        title="Haydovchi ma'lumotlarini tahrirlash"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={600}
        forceRender={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={editFormLoading}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="Ism"
                rules={[{ required: true, message: 'Iltimos, ismni kiriting' }]}
              >
                <Input placeholder="Ismni kiriting" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Familiya"
                rules={[{ required: true, message: 'Iltimos, familiyani kiriting' }]}
              >
                <Input placeholder="Familiyani kiriting" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="phone_number"
            label="Telefon raqami"
            rules={[{ required: true, message: 'Iltimos, telefon raqamini kiriting' }]}
          >
            <Input placeholder="Telefon raqamini kiriting" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Manzil"
          >
            <Input placeholder="Manzilni kiriting" />
          </Form.Item>
          
          <Form.Item
            name="passport"
            label="Passport"
          >
            <Input placeholder="Passport ma'lumotlarini kiriting" />
          </Form.Item>
          
          <Form.Item
            name="license_number"
            label="Haydovchilik guvohnomasi raqami"
          >
            <Input placeholder="Haydovchilik guvohnomasi raqamini kiriting" />
          </Form.Item>
          
          <Form.Item
            name="license_expiry"
            label="Guvohnoma muddati"
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Holati"
          >
            <Select>
              <Select.Option value="active">Faol</Select.Option>
              <Select.Option value="inactive">Nofaol</Select.Option>
              <Select.Option value="on_trip">Reysda</Select.Option>
              <Select.Option value="waiting">Kutmoqda</Select.Option>
              <Select.Option value="suspended">To'xtatilgan</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Bekor qilish
              </Button>
              <Button type="primary" htmlType="submit" loading={editFormLoading}>
                Saqlash
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Add Delete Confirmation */}
      <Modal
        title="Haydovchini o'chirish"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Bekor qilish
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteDriver} loading={loading}>
            O'chirish
          </Button>
        ]}
      >
        <p>Siz haqiqatan ham bu haydovchini o'chirmoqchimisiz?</p>
        <p>Bu harakat qaytarilmas va barcha ma'lumotlar o'chiriladi.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default DriverHistoryPage;