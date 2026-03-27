'use client';
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Button, 
  Input, 
  Select, 
  Tabs, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Modal, 
  Form, 
  InputNumber, 
  DatePicker, 
  Avatar,
  Tooltip,
  Statistic,
  Divider,
  message
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  CreditCardOutlined, 
  CarOutlined, 
  FileTextOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  WalletOutlined,
  TeamOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { driverSalaryApi } from '@/modules/accounting/api/driverSalary/driverSalaryApi';
import axiosInstance from '@/api/axiosInstance';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';

const {  Text } = Typography;
const { Option } = Select;

interface DriverPaymentData {
  id: number;
  name: string;
  photo: string;
  totalEarned: number;
  pendingAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial';
  lastPaymentDate: string;
  trips: number;
  vehicleId: string;
}

interface DriverTripData {
  id: number;
  tripNumber: string;
  startDate: string;
  endDate: string;
  route: string;
  distance: number;
  payment: number;
  status: 'completed' | 'inProgress' | 'planned';
  isPaid: boolean;
}

interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  photo: string;
  car?: {
    id: number;
    car_number: string;
  };
}

interface Trip {
  id: number;
  trip_number: string;
  start_date: string;
  end_date: string;
  route_from: string;
  route_to: string;
  distance: number;
  payment_amount: number;
  status: string;
  is_paid: boolean;
}

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  payment_type: string;
  description: string;
  status: string;
  trip_id?: string;
}

const DriverPayments: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState<boolean>(false);
  const [currentDriver, setCurrentDriver] = useState<DriverPaymentData | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('all');

  // State for API data
  const [loading, setLoading] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [driverPayments, setDriverPayments] = useState<DriverPaymentData[]>([]);
  
  // Get currencies from the API using the useCurrencies hook
  const { currencies, loading: currenciesLoading } = useCurrencies();

  // State for Kassa management statistics
  const [kassaStats, setKassaStats] = useState({
    totalDriverPayments: 0,
    totalPendingPayments: 0,
    activeDrivers: 0,
    recentPayments: 0
  });

  // Fetch drivers data with date filter
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const driversResponse = await axiosInstance.get('/customusers/?status=driver');
        setDrivers(driversResponse.data);
        let startDate = '';
        let endDate = '';
        
        if (dateRange[0] && dateRange[1]) {
          startDate = dateRange[0].format('YYYY-MM-DD');
          endDate = dateRange[1].format('YYYY-MM-DD');
        }
        
        // Transform driver data for the table
        const transformedData = await Promise.all(driversResponse.data.map(async (driver: Driver) => {
          let pendingAmount = 0;
          let paidAmount = 0;
          let lastPaymentDate = '';
          let tripCount = 0;
          
          try {
            // Get trips for the driver with date filter
            const tripsParams = new URLSearchParams();
            tripsParams.append('driver', driver.id.toString());
            if (startDate) tripsParams.append('start_date', startDate);
            if (endDate) tripsParams.append('end_date', endDate);
            
            const tripsResponse = await axiosInstance.get(`/rays/?${tripsParams.toString()}`);
            tripCount = tripsResponse.data.length;
            
            // Calculate payments from trips
            tripsResponse.data.forEach((trip: any) => {
              const tripAmount = Number(trip.payment_amount || 0);
              if (trip.is_paid) {
                paidAmount += tripAmount;
              } else {
                pendingAmount += tripAmount;
              }
            });
            
            // Get payment history
            const paymentsResponse = await axiosInstance.get(`/driversalary/?driver=${driver.id}`);
            if (paymentsResponse.data.length > 0) {
              // Sort by paid_at date and get the latest
              const sortedPayments = [...paymentsResponse.data].sort((a, b) => 
                new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
              );
              lastPaymentDate = sortedPayments[0].paid_at;
              
              // Filter payments by date range if specified
              let filteredPayments = paymentsResponse.data;
              if (startDate && endDate) {
                filteredPayments = paymentsResponse.data.filter((payment: any) => {
                  const paymentDate = dayjs(payment.paid_at);
                  return paymentDate.isAfter(dateRange[0]) && paymentDate.isBefore(dateRange[1]);
                });
              }
              
              // Sum filtered payments
              const totalFiltered = filteredPayments.reduce((sum: number, payment: any) => 
                sum + Number(payment.amount), 0
              );
              
              paidAmount = totalFiltered;
            }
          } catch (error) {
            console.error(`Error fetching data for driver ${driver.id}:`, error);
          }
          
          const totalEarned = pendingAmount + paidAmount;
          
          let status: 'paid' | 'pending' | 'partial' = 'paid';
          if (pendingAmount > 0 && paidAmount === 0) {
            status = 'pending';
          } else if (pendingAmount > 0 && paidAmount > 0) {
            status = 'partial';
          }
          
          return {
            id: driver.id,
            name: `${driver.first_name} ${driver.last_name}`,
            photo: driver.photo || '',
            totalEarned,
            pendingAmount,
            paidAmount,
            status,
            lastPaymentDate: lastPaymentDate ? dayjs(lastPaymentDate).format('YYYY-MM-DD') : 'Mavjud emas',
            trips: tripCount,
            vehicleId: driver.car?.car_number || 'N/A'
          };
        }));
        
        setDriverPayments(transformedData);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        message.error('Haydovchilar ma\'lumotlarini yuklashda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrivers();
  }, [dateRange]);

  // Fetch trips data when a driver is selected for history
  useEffect(() => {
    if (currentDriver) {
      fetchDriverTrips(currentDriver.id);
      fetchPaymentHistory(currentDriver.id);
    }
  }, [currentDriver]);

  const fetchDriverTrips = async (driverId: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/rays/?driver=${driverId}`);
      
      // Transform the trips data for the UI
      const transformedTrips = response.data.map((trip: any) => ({
        id: trip.id,
        tripNumber: trip.trip_number || `TR-${trip.id}`,
        startDate: trip.start_date,
        endDate: trip.end_date,
        route: `${trip.route_from} - ${trip.route_to}`,
        distance: trip.distance || 0,
        payment: trip.payment_amount || 0,
        status: trip.status === 'completed' ? 'completed' : 
               trip.status === 'in_progress' ? 'inProgress' : 'planned',
        isPaid: trip.is_paid || false
      }));
      
      setTrips(transformedTrips);
    } catch (error) {
      console.error('Error fetching driver trips:', error);
      message.error('Reyslar ma\'lumotlarini yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (driverId: number) => {
    setLoading(true);
    try {
      // Fetch payment history from the driversalary endpoint
      const driverSalaries = await driverSalaryApi.getDriverSalariesByDriver(driverId);
      
      const transformedHistory = driverSalaries.map((payment: any) => ({
        id: payment.id,
        date: payment.paid_at,
        amount: payment.amount,
        payment_type: payment.currency,
        description: payment.comment || payment.title || '',
        status: 'completed',
        trip_id: payment.title || ''
      }));
      
      setPaymentHistory(transformedHistory);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      message.error('To\'lovlar tarixini yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (record: DriverPaymentData) => {
    setCurrentDriver(record);
    setIsPaymentModalVisible(true);
    form.setFieldsValue({
      driverName: record.name,
      pendingAmount: record.pendingAmount,
      paymentAmount: 0,
      paymentType: 'UZS',
      paymentDate: dayjs(),
      description: ''
    });
  };

  const handleViewHistory = (record: DriverPaymentData) => {
    setCurrentDriver(record);
    setIsHistoryModalVisible(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (!currentDriver) {
        message.error('Haydovchi tanlanmagan.');
        return;
      }
      
      // Create payment using the driverSalaryApi
      const paymentData = {
        driver: currentDriver.id,
        amount: values.paymentAmount.toString(),
        currency: values.paymentType,
        title: `To'lov ${dayjs(values.paymentDate).format('YYYY-MM-DD')}`,
        comment: values.description || `Haydovchi ${currentDriver.name} uchun to'lov`
      };
      
      const result = await driverSalaryApi.createDriverSalary(paymentData);
      
      // Update local state to reflect payment
      const updatedDriverPayments = driverPayments.map(driver => {
        if (driver.id === currentDriver.id) {
          const newPaidAmount = driver.paidAmount + Number(values.paymentAmount);
          const newPendingAmount = driver.pendingAmount - Number(values.paymentAmount);
          
          let newStatus: 'paid' | 'pending' | 'partial' = 'paid';
          if (newPendingAmount > 0 && newPaidAmount === 0) {
            newStatus = 'pending';
          } else if (newPendingAmount > 0 && newPaidAmount > 0) {
            newStatus = 'partial';
          }
          
          return {
            ...driver,
            paidAmount: newPaidAmount,
            pendingAmount: newPendingAmount,
            status: newStatus,
            lastPaymentDate: dayjs(result.paid_at).format('YYYY-MM-DD')
          };
        }
        return driver;
      });
      
      setDriverPayments(updatedDriverPayments);
      message.success('To\'lov muvaffaqiyatli saqlandi.');
      
      // If the payment history modal is open, refresh the payment history
      if (isHistoryModalVisible && currentDriver) {
        fetchPaymentHistory(currentDriver.id);
      }
      
      setIsPaymentModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting payment:', error);
      message.error('To\'lovni saqlashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = driverPayments.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchText.toLowerCase()) || 
                        driver.vehicleId.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || driver.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<DriverPaymentData> = [
    {
      title: 'Haydovchi',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DriverPaymentData) => (
        <Space>
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">{record.vehicleId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Umumiy daromad',
      dataIndex: 'totalEarned',
      key: 'totalEarned',
      render: (amount: number) => (
        <Text>
          {amount.toLocaleString()} UZS
        </Text>
      ),
    },
    {
      title: 'To\'lanmagan summa',
      dataIndex: 'pendingAmount',
      key: 'pendingAmount',
      render: (amount: number) => (
        <Text className={amount > 0 ? "transaction-amount-negative" : ""}>
          {amount.toLocaleString()} UZS
        </Text>
      ),
    },
    {
      title: 'To\'langan summa',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number) => (
        <Text className="transaction-amount-positive">
          {amount.toLocaleString()} UZS
        </Text>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';
        
        if (status === 'paid') {
          color = 'green';
          text = 'To\'langan';
        } else if (status === 'pending') {
          color = 'red';
          text = 'To\'lanmagan';
        } else if (status === 'partial') {
          color = 'orange';
          text = 'Qisman to\'langan';
        }
        
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Oxirgi to\'lov',
      dataIndex: 'lastPaymentDate',
      key: 'lastPaymentDate',
    },
    {
      title: 'Reyslar',
      dataIndex: 'trips',
      key: 'trips',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="To'lov qilish">
            <Button 
              type="primary" 
              icon={<CreditCardOutlined />} 
              size="small"
              onClick={() => handlePayment(record)}
              disabled={record.pendingAmount === 0}
            />
          </Tooltip>
          <Tooltip title="To'lovlar tarixi">
            <Button 
              icon={<FileTextOutlined />} 
              size="small"
              onClick={() => handleViewHistory(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tripColumns: ColumnsType<Trip> = [
    {
      title: 'Reys ID',
      dataIndex: 'trip_number',
      key: 'trip_number',
    },
    {
      title: 'Yo\'nalish',
      key: 'route',
      render: (_, record) => `${record.route_from} - ${record.route_to}`
    },
    {
      title: 'Sana',
      key: 'date',
      render: (_, record) => (
        <>{record.start_date} - {record.end_date}</>
      ),
    },
    {
      title: 'Masofa',
      dataIndex: 'distance',
      key: 'distance',
      render: (distance: number) => `${distance} km`,
    },
    {
      title: 'To\'lov',
      dataIndex: 'payment_amount',
      key: 'payment_amount',
      render: (payment: number) => `${payment.toLocaleString()} UZS`,
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';
        
        if (status === 'completed') {
          color = 'green';
          text = 'Bajarilgan';
        } else if (status === 'inProgress') {
          color = 'blue';
          text = 'Jarayonda';
        } else if (status === 'planned') {
          color = 'orange';
          text = 'Rejalashtirilgan';
        }
        
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'To\'lov holati',
      dataIndex: 'is_paid',
      key: 'is_paid',
      render: (is_paid: boolean) => (
        <Tag color={is_paid ? 'green' : 'red'}>
          {is_paid ? 'To\'langan' : 'To\'lanmagan'}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!record.is_paid && record.status === 'completed' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CreditCardOutlined />}
              onClick={() => {
                // Set up form for trip-specific payment
                if (currentDriver) {
                  form.setFieldsValue({
                    driverName: currentDriver.name,
                    pendingAmount: record.payment_amount,
                    paymentAmount: record.payment_amount,
                    paymentType: 'UZS',
                    paymentDate: dayjs(),
                    description: `Reys ${record.trip_number} uchun to'lov`
                  });
                  setIsPaymentModalVisible(true);
                }
              }}
            >
              To'lov qilish
            </Button>
          )}
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              // Batafsil ko'rish logikasi
              message.info(`Reys ${record.trip_number} tafsilotlari ko'rilmoqda`);
            }}
          >
            Batafsil
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTrips = trips.filter(trip => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return trip.status === 'completed';
    if (activeTab === 'inProgress') return trip.status === 'inProgress';
    if (activeTab === 'planned') return trip.status === 'planned';
    if (activeTab === 'paid') return trip.is_paid;
    if (activeTab === 'unpaid') return !trip.is_paid;
    return true;
  });

  const paymentHistoryColumns = [
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Reys ID',
      dataIndex: 'tripId',
      key: 'tripId',
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: any) => `${Number(amount).toLocaleString()} ${getCurrencyName(record.currency)}`,
    },
    {
      title: 'To\'lov turi',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => getCurrencyName(type),
    },
    {
      title: 'Izoh',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? 'Bajarilgan' : 'Jarayonda'}
        </Tag>
      ),
    }
  ];

  // Calculate Kassa statistics when driver data is loaded
  useEffect(() => {
    if (driverPayments.length > 0) {
      const totalPaid = driverPayments.reduce((sum, driver) => sum + driver.paidAmount, 0);
      const totalPending = driverPayments.reduce((sum, driver) => sum + driver.pendingAmount, 0);
      const activeDrivers = driverPayments.filter(driver => driver.trips > 0).length;
      
      // Get recent payments (in the last 30 days)
      const recentPayments = driverPayments.filter(
        driver => dayjs(driver.lastPaymentDate).isAfter(dayjs().subtract(30, 'day'))
      ).length;
      
      setKassaStats({
        totalDriverPayments: totalPaid,
        totalPendingPayments: totalPending,
        activeDrivers,
        recentPayments
      });
    }
  }, [driverPayments]);

  // Function to export data to Excel
  const exportToExcel = () => {
    try {
      // Create a CSV string
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      const headers = [
        "Haydovchi", 
        "Avtomobil raqami", 
        "Umumiy daromad (UZS)", 
        "To'lanmagan summa (UZS)", 
        "To'langan summa (UZS)", 
        "Holat", 
        "Oxirgi to'lov sanasi", 
        "Reyslar soni"
      ];
      csvContent += headers.join(",") + "\r\n";
      
      // Add data rows
      filteredDrivers.forEach(driver => {
        let status = '';
        if (driver.status === 'paid') status = "To'langan";
        else if (driver.status === 'pending') status = "To'lanmagan";
        else if (driver.status === 'partial') status = "Qisman to'langan";
        
        const row = [
          `"${driver.name}"`,
          `"${driver.vehicleId}"`,
          driver.totalEarned,
          driver.pendingAmount,
          driver.paidAmount,
          `"${status}"`,
          `"${driver.lastPaymentDate}"`,
          driver.trips
        ];
        csvContent += row.join(",") + "\r\n";
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Haydovchilar_to'lovlari_${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
      message.success("Ma'lumotlar Excel formatiga eksport qilindi");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Ma'lumotlarni eksport qilishda xatolik yuz berdi");
    }
  };

  // Get currency name from ID
  const getCurrencyName = (currencyId: number): string => {
    // Try to find the currency in the fetched currencies list
    const currency = currencies.find(c => c.id === currencyId);
    if (currency) return currency.currency;
    
    // Fallback to default mapping if not found in the currencies list
    const currencyMap: {[key: number]: string} = {
      1: 'RUB',
      2: 'USD',
      3: 'EUR',
      4: 'UZS'
    };
    
    return currencyMap[currencyId] || currencyId.toString();
  };

  return (
    <div className="driver-payments">
      {/* Kassa management statistics */}
      <Row gutter={[16, 16]} className="kassa-stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title="Jami to'lovlar"
              value={kassaStats.totalDriverPayments}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="UZS"
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title="To'lanmagan to'lovlar"
              value={kassaStats.totalPendingPayments}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WalletOutlined />}
              suffix="UZS"
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title="Faol haydovchilar"
              value={kassaStats.activeDrivers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title="Oxirgi 30 kundagi to'lovlar"
              value={kassaStats.recentPayments}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Haydovchilar bilan hisob-kitob</Divider>

      <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Haydovchi nomi yoki avtomobil raqami"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="Holat bo'yicha filtrlash"
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
          >
            <Option value="all">Barchasi</Option>
            <Option value="paid">To`langan</Option>
            <Option value="partial">Qisman to`langan</Option>
            <Option value="pending">To`lanmagan</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker.RangePicker 
            style={{ width: '100%' }}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            placeholder={['Boshlang\'ich sana', 'Tugash sanasi']}
          />
        </Col>
        <Col xs={24} sm={12} md={6} style={{ textAlign: 'right' }}>
          <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
              onClick={() => {
                message.info('Yangi to\'lov qo\'shish funktsiyasi qo\'shildi!');
                // Show driver selection modal logic would go here
              }}
          >
            Yangi to`lov qo`shish
          </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
            >
              Eksport
            </Button>
          </Space>
        </Col>
      </Row>

      <Card title="Haydovchilar bilan hisob-kitob" className="driver-payment-card">
        <Table 
          columns={columns} 
          dataSource={filteredDrivers} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          summary={pageData => {
            const totalPending = pageData.reduce((sum, driver) => sum + driver.pendingAmount, 0);
            const totalPaid = pageData.reduce((sum, driver) => sum + driver.paidAmount, 0);
            const totalEarned = pageData.reduce((sum, driver) => sum + driver.totalEarned, 0);
            
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Jami</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text strong>{totalEarned.toLocaleString()} UZS</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong className="transaction-amount-negative">
                      {totalPending.toLocaleString()} UZS
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <Text strong className="transaction-amount-positive">
                      {totalPaid.toLocaleString()} UZS
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} colSpan={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      <Divider orientation="left">Haydovchilar reyslari</Divider>

      <Card className="driver-trips-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: (
                <span>
                  <CarOutlined />
                  Barcha reyslar
                </span>
              )
            },
            {
              key: 'completed',
              label: (
                <span>
                  <CheckCircleOutlined />
                  Bajarilgan
                </span>
              )
            },
            {
              key: 'inProgress',
              label: (
                <span>
                  <ClockCircleOutlined />
                  Jarayonda
                </span>
              )
            },
            {
              key: 'paid',
              label: (
                <span>
                  <CreditCardOutlined />
                  To`langan
                </span>
              )
            },
            {
              key: 'unpaid',
              label: (
                <span>
                  <CreditCardOutlined />
                  To`lanmagan
                </span>
              )
            }
          ]}
        />
        <Table 
          columns={tripColumns} 
          dataSource={filteredTrips} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      {/* To'lov qo'shish modali */}
      <Modal
        title="To'lov qo'shish"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        forceRender={true}
        footer={[
          <Button key="cancel" onClick={() => setIsPaymentModalVisible(false)}>
            Bekor qilish
          </Button>,
          <Button key="submit" type="primary" onClick={handlePaymentSubmit} loading={loading}>
            To'lovni saqlash
          </Button>,
        ]}
      >
        <Form 
          form={form}
          layout="vertical"
        >
          <Form.Item 
            name="driverName" 
            label="Haydovchi"
            rules={[{ required: true, message: 'Haydovchi nomini kiriting!' }]}
          >
            <Input readOnly prefix={<UserOutlined />} />
          </Form.Item>
          
          <Form.Item 
            name="pendingAmount" 
            label="To'lanmagan summa"
          >
            <InputNumber 
              style={{ width: '100%' }}
              formatter={value => `${value} UZS`}
              parser={value => value!.replace(/\D/g, '')}
              readOnly
            />
          </Form.Item>
          
          <Form.Item 
            name="paymentAmount" 
            label="To'lov summasi"
            rules={[{ required: true, message: 'To\'lov summasini kiriting!' }]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              formatter={value => `${value} UZS`}
              parser={value => value!.replace(/\D/g, '') as any}
              min={1}
            />
          </Form.Item>
          
          <Form.Item 
            name="paymentType" 
            label="To'lov turi"
            rules={[{ required: true, message: 'To\'lov turini tanlang!' }]}
          >
            <Select loading={currenciesLoading}>
              {currencies.length > 0 ? (
                currencies.map(currency => (
                  <Option key={currency.id} value={currency.currency}>
                    {currency.currency} {currency.rate_to_uzs && `(${parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)`}
                  </Option>
                ))
              ) : (
                <>
                  <Option value="UZS">UZS ($)</Option>
                  <Option value="USD">USD (Dollar)</Option>
                  <Option value="RUB">RUB (Rubl)</Option>
                  <Option value="EUR">EUR (Yevro)</Option>
                </>
              )}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="paymentDate" 
            label="To'lov sanasi"
            rules={[{ required: true, message: 'To\'lov sanasini kiriting!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Izoh"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${currentDriver?.name} - To'lovlar tarixi`}
        open={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsHistoryModalVisible(false)}>
            Yopish
          </Button>,
        ]}
        width={800}
      >
        <Table 
          columns={paymentHistoryColumns} 
          dataSource={paymentHistory} 
          rowKey="id"
          pagination={false}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default DriverPayments; 