import React, { useState, useEffect } from 'react'
import {
  Tabs,
  Spin,
  Alert,
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Radio,
  Progress,
  Space,
  DatePicker,
  Select,
  Tag,
  Button,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber
} from 'antd'
import {
  DashboardOutlined,
  PlusOutlined,
  CarOutlined,
  DollarCircleOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FilterOutlined,
  ReloadOutlined,
  DollarOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import TripTable from './components/TripTable'
import TripAdd from './components/TripAdd'
import LocationManagement from './components/LocationManagement'
import { useTrips } from '@/modules/accounting/hooks/useTrips'
import { motion } from 'framer-motion'
import './style/style.css'
import axiosInstance from '@/api/axiosInstance'
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies'
import dayjs from 'dayjs'
import { message } from 'antd'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

const FreightDeliveryPage: React.FC = () => {
  const { data: trips = [], isLoading, error, refetch } = useTrips()
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card')
  const [timeFilter, setTimeFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<[any, any] | null>(null)
  const [tripHistoryCount, setTripHistoryCount] = useState<number>(0)
  const [loadingHistoryCount, setLoadingHistoryCount] = useState<boolean>(false)
  const [isDriverPaymentModalVisible, setIsDriverPaymentModalVisible] = useState<boolean>(false)
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null)
  const [paymentForm] = Form.useForm()
  const [paymentLoading, setPaymentLoading] = useState(false)
  const { currencies, loading: currenciesLoading } = useCurrencies()
  
  // Fetch triphistory count on component mount
  useEffect(() => {
    fetchTripHistoryCount();
  }, []);
  
  // Function to fetch trip history count
  const fetchTripHistoryCount = async () => {
    try {
      setLoadingHistoryCount(true);
      const response = await axiosInstance.get('/rayshistory/');
      
      if (response.data && Array.isArray(response.data)) {
        setTripHistoryCount(response.data.length);
        console.log('Trip history count:', response.data.length);
      } 
      else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setTripHistoryCount(response.data.results.length);
        console.log('Trip history count (paginated):', response.data.results.length);
      }
      else {
        console.error('Invalid response format for trip history:', response.data);
        setTripHistoryCount(0);
      }
    } catch (error) {
      console.error('Error fetching trip history count:', error);
      setTripHistoryCount(0);
    } finally {
      setLoadingHistoryCount(false);
    }
  };
  
  // Filter trips based on time frame
  const getFilteredTrips = () => {
    if (!trips.length) return []
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      return trips.filter(trip => {
        const tripDate = new Date(trip.created_at)
        return tripDate >= dateRange[0] && tripDate <= dateRange[1]
      })
    }
    
    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay
    const oneMonth = 30 * oneDay
    
    switch (timeFilter) {
      case 'today':
        return trips.filter(trip => {
          const tripDate = new Date(trip.created_at)
          return (now.getTime() - tripDate.getTime()) < oneDay
        })
      case 'week':
        return trips.filter(trip => {
          const tripDate = new Date(trip.created_at)
          return (now.getTime() - tripDate.getTime()) < oneWeek
        })
      case 'month':
        return trips.filter(trip => {
          const tripDate = new Date(trip.created_at)
          return (now.getTime() - tripDate.getTime()) < oneMonth
        })
      default:
        return trips
    }
  }
  
  const filteredTrips = getFilteredTrips()
  
  // Function to handle driver payment
  const handleDriverPayment = (tripId: number) => {
    setSelectedTripId(tripId);
    setIsDriverPaymentModalVisible(true);
    
    // Fetch trip details and populate form
    if (tripId) {
      const trip = trips.find(t => t.id === tripId);
      if (trip) {
        paymentForm.setFieldsValue({
          amount: trip.dp_price,
          currency: trip.dp_currency || 'USD',
          payment_date: dayjs(),
          payment_method: 'cash'
        });
      }
    }
  };
  
  const handlePaymentSubmit = async (values: any) => {
    if (!selectedTripId) {
      message.error('Reys ma\'lumotlari mavjud emas');
      return;
    }
    
    const trip = trips.find(t => t.id === selectedTripId);
    if (!trip || !trip.driver) {
      message.error('Haydovchi ma\'lumotlari mavjud emas');
      return;
    }

    setPaymentLoading(true);
    try {
      // Log full driver object for debugging
      console.log('Driver object:', trip.driver);
      
      // Extract numeric driver ID
      let driverId = null;
      
      if (trip.driver && typeof trip.driver === 'object' && trip.driver.id) {
        driverId = Number(trip.driver.id);
      }
      
      console.log('Using driver ID:', driverId);
      
      if (!driverId || isNaN(driverId)) {
        message.error('Haydovchi ID raqami topilmadi');
        setPaymentLoading(false);
        return;
      }
      
      // Create payload with ONLY the exact fields the API requires
      const paymentData = {
        driver: driverId,
        amount: values.amount.toString(),
        currency: values.currency
      };
      
      console.log('Payment data being sent:', paymentData);

      const response = await axiosInstance.post('/driversalary/', paymentData);
      console.log('Payment response:', response.data);
      
      message.success('Haydovchiga to\'lov muvaffaqiyatli amalga oshirildi');
      paymentForm.resetFields();
      setIsDriverPaymentModalVisible(false);
      setSelectedTripId(null);
      refetch();
    } catch (error) {
      console.error('Error making payment:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        // Show more specific error message to the user
        if (error.response.data && typeof error.response.data === 'object') {
          const errorMessages = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          message.error(`To'lov amalga oshirishda xatolik: ${errorMessages}`);
        } else {
          message.error(`To'lov amalga oshirishda xatolik: ${error.response.status}`);
        }
      } else {
        message.error('To\'lov amalga oshirishda xatolik yuz berdi');
      }
    } finally {
      setPaymentLoading(false);
    }
  };
  
  const getCurrencySymbol = (currency: string): string => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'UZS':
        return 'so\'m';
      case 'RUB':
        return '₽';
      case 'EUR':
        return '€';
      default:
        return 'so\'m';
    }
  };
  
  const TripDashboard = () => {
    if (isLoading) return <Spin size="large" className="centered-spin" />
    if (error)
      return (
        <Alert 
          type="error" 
          message={`Xatolik: ${error.message}`} 
          action={
            <Button size="small" type="primary" onClick={() => refetch()}>
              Qayta urinish
            </Button>
          }
          banner 
        />
      )
      
    const totalTrips = filteredTrips.length
    const totalRevenue = filteredTrips.reduce((sum, trip) => sum + trip.price, 0)
    const totalDriverExpenses = filteredTrips.reduce(
      (sum, trip) => sum + trip.dr_price,
      0,
    )
    const totalDriverPayments = filteredTrips.reduce(
      (sum, trip) => sum + trip.dp_price,
      0,
    )
    const totalProfit = totalRevenue - totalDriverExpenses - totalDriverPayments
    const inProgressTripsCount = filteredTrips.filter((t) => !t.is_completed).length
    const completedTripsCount = filteredTrips.filter((t) => t.is_completed).length
    
    // Calculate completion percentage
    const completionPercentage = totalTrips > 0 
      ? Math.round((completedTripsCount / totalTrips) * 100) 
      : 0
      
    const avgDistance = totalTrips > 0
      ? Math.round(filteredTrips.reduce((sum, trip) => sum + trip.kilometer, 0) / totalTrips)
      : 0
      
    // Format large numbers with commas
    const formatNumber = (value: number) => 
      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    
    return (
      <div className="trip-dashboard">
        <Card className="dashboard-header-card">
          <Row className="dashboard-header" align="middle" gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Title level={3}>Reyslar bo`yicha umumiy statistika</Title>
              <Text type="secondary">
                Ushbu bo`limda yuk tashish xizmatlari bo`yicha statistik
                ma`lumotlar ko`rsatilgan
              </Text>
            </Col>
            <Col xs={24} md={8}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={0}
              >
                <Card variant="borderless">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Statistic 
                      title="Jami reyslar soni" 
                      value={totalTrips} 
                      prefix={<BarChartOutlined />} 
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Card>
        
        <Row gutter={[24, 24]} className="stats-cards">
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              custom={1}
            >
              <Card variant="borderless">
                <Statistic
                  title="Umumiy daromad"
                  value={totalRevenue}
                  suffix="$"
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarCircleOutlined />}
                  formatter={(value) => formatNumber(value as number)}
                />
                <div className="stat-footer">
                  <Tag color="green">
                    <RiseOutlined /> Daromad
                  </Tag>
                </div>
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              custom={2}
            >
              <Card variant="borderless">
                <Statistic
                  title="Service xarajatlari"
                  value={totalDriverExpenses}
                  suffix="$"
                  precision={0}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<FallOutlined />}
                  formatter={(value) => formatNumber(value as number)}
                />
                <div className="stat-footer">
                  <Tag color="red">
                    <FallOutlined /> Xarajat
                  </Tag>
                </div>
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              custom={3}
            >
              <Card variant="borderless">
                <Statistic
                  title="Haydovchiga to'lovlar"
                  value={totalDriverPayments}
                  suffix="$"
                  precision={0}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<DollarOutlined />}
                  formatter={(value) => formatNumber(value as number)}
                />
                <div className="stat-footer">
                  <Tag color="blue">
                    <DollarOutlined /> To`lov
                  </Tag>
                </div>
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              custom={4}
            >
              <Card variant="borderless">
                <Statistic
                  title="Sof foyda"
                  value={totalProfit}
                  suffix="$"
                  precision={0}
                  valueStyle={{ 
                    color: totalProfit >= 0 ? '#3f8600' : '#cf1322' 
                  }}
                  prefix={totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  formatter={(value) => formatNumber(value as number)}
                />
                <div className="stat-footer">
                  <Tag color={totalProfit >= 0 ? 'green' : 'red'}>
                    foyda
                  </Tag>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} className="stats-details">
          <Col xs={24}>
            <Card 
              title={<><LineChartOutlined /> Reys holati</>}
              className="trips-status-card"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={6}>
                  <Card variant="borderless">
                    <Statistic
                      title="Jo'natilgan reyslar"
                      value={inProgressTripsCount}
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<CarOutlined />}
                    />
                    <Progress 
                      percent={inProgressTripsCount > 0 ? Math.round((inProgressTripsCount / totalTrips) * 100) : 0} 
                      showInfo={false} 
                      strokeColor="#1890ff" 
                    />
                  </Card>
                </Col>
                
                <Col xs={24} sm={6}>
                  <Card variant="borderless">
                    <Statistic
                      title="Tarix reyslar"
                      value={tripHistoryCount}
                      loading={loadingHistoryCount}
                      valueStyle={{ color: '#722ed1' }}
                      prefix={<HistoryOutlined />}
                    />
                    <Button 
                      type="link" 
                      href="/modules/accounting/triphistory" 
                      style={{ padding: 0, height: 'auto', marginTop: 8 }}
                    >
                      Tarixni ko`rish
                    </Button>
                  </Card>
                </Col>
                
                <Col xs={24} sm={6}>
                  <Card variant="borderless">
                    <Statistic
                      title="O'rtacha masofa"
                      value={avgDistance}
                      suffix="km"
                      valueStyle={{ color: '#eb2f96' }}
                      prefix={<EnvironmentOutlined />}
                    />
                    <div style={{ marginTop: 8, height: 22 }}></div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
  
  const InProgressTrips = () => {
    const inProgressTrips = filteredTrips.filter(trip => !trip.is_completed)
    
    return (
      <div className="in-progress-trips">
        <div className="section-header" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="view-controls">
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="table">
                <UnorderedListOutlined /> Jadval
              </Radio.Button>
              <Radio.Button value="card">
                <AppstoreOutlined /> Kartochka
              </Radio.Button>
            </Radio.Group>
          </div>
          
          <div className="filters" style={{ display: 'flex', gap: '8px' }}>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setTimeFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">Barcha vaqt</Select.Option>
              <Select.Option value="today">Bugun</Select.Option>
              <Select.Option value="week">Shu hafta</Select.Option>
              <Select.Option value="month">Shu oy</Select.Option>
            </Select>
            
            <RangePicker 
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
              allowClear
              placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            />
            
            <Tooltip title="Ma'lumotlarni yangilash">
              <Button 
                onClick={() => refetch()}
                icon={<ReloadOutlined />}
              />
            </Tooltip>
          </div>
        </div>
        
        <TripTable 
          trips={inProgressTrips} 
          loading={isLoading} 
          viewMode={viewMode}
          onDriverPayment={handleDriverPayment}
        />
      </div>
    )
  }
  
  const tabItems = [
    {
      key: "dashboard",
      label: (
        <span>
          <DashboardOutlined /> Dashboard
        </span>
      ),
      children: <TripDashboard />
    },
    {
      key: "in-progress",
      label: (
        <span>
          <CarOutlined /> Yo`ldagi reyslar
        </span>
      ),
      children: <InProgressTrips />
    },
    {
      key: "add",
      label: (
        <span>
          <PlusOutlined /> Yangi reys qo`shish
        </span>
      ),
      children: <TripAdd />
    },
    {
      key: "locations",
      label: (
        <span>
          <EnvironmentOutlined /> Manzillar
        </span>
      ),
      children: <LocationManagement />
    }
  ]

  return (
    <div className="freight-delivery-page">
      <Tabs defaultActiveKey="dashboard" items={tabItems} />
      
      <Modal
        title="Haydovchiga to'lov"
        open={isDriverPaymentModalVisible}
        onCancel={() => {
          setIsDriverPaymentModalVisible(false);
          setSelectedTripId(null);
          paymentForm.resetFields();
        }}
        footer={null}
        width={500}
        forceRender={true}
      >
        {selectedTripId && (
          <>
            {(() => {
              const trip = trips.find(t => t.id === selectedTripId);
              return trip ? (
                <div style={{ marginBottom: 20 }}>
                  <Text strong>Haydovchi: </Text>
                  <Text>{trip.driver?.fullname}</Text>
                  <br />
                  <Text strong>Reys ID: </Text>
                  <Text>#{trip.id}</Text>
                  <br />
                  <Text strong>To`lov summasi: </Text>
                  <Text>{trip.dp_price.toLocaleString()} {getCurrencySymbol(trip.dp_currency || 'USD')}</Text>
                </div>
              ) : null;
            })()}

            <Form
              form={paymentForm}
              layout="vertical"
              onFinish={handlePaymentSubmit}
            >
              <Form.Item
                name="amount"
                label="To'lov summasi"
                rules={[{ required: true, message: 'To\'lov summasini kiriting' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  prefix={<DollarOutlined />}
                  min={0}
                />
              </Form.Item>

              <Form.Item
                name="currency"
                label="Valyuta"
                rules={[{ required: true, message: 'Valyutani tanlang' }]}
              >
                {currenciesLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Spin size="small" style={{ marginRight: 8 }} />
                    <span>Valyutalar yuklanmoqda...</span>
                  </div>
                ) : (
                  <Select placeholder="Valyutani tanlang">
                    {currencies.map(currency => (
                      <Option key={`drv-payment-${currency.id}`} value={currency.id}>
                        {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                name="payment_date"
                label="To'lov sanasi"
                rules={[{ required: true, message: 'To\'lov sanasini kiriting' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder="To'lov sanasini tanlang"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="comments"
                label="Izoh"
              >
                <TextArea rows={3} placeholder="To'lov haqida qo'shimcha ma'lumot" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button onClick={() => {
                    setIsDriverPaymentModalVisible(false);
                    setSelectedTripId(null);
                    paymentForm.resetFields();
                  }}>
                    Bekor qilish
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={paymentLoading} 
                    icon={<CreditCardOutlined />}
                  >
                    To`lovni amalga oshirish
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  )
}
export default FreightDeliveryPage