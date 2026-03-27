import React, { useState, useEffect } from 'react';
import { Table, Card, Avatar, Tag, Space, Typography, Badge, Empty, Spin, Alert, Row, Col, Input, Tooltip, Button, Radio, Tabs } from 'antd';
import { 
  UserOutlined, 
  CarOutlined, 
  ClockCircleOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  HistoryOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { DriverType } from '../../../../accounting/types/driver';
import axiosInstance, { formatImageUrl } from '@/api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface DriversOnRoadProps {
  drivers: DriverType[];
  loading: boolean;
  activeCars?: ActiveCar[];
  onEdit?: (driver: DriverType) => void;
  onDelete?: (driver: DriverType) => void;
  enableActions?: boolean;
}

interface ActiveCar {
  car_id: number;
  car_name: string;
  driver: {
    id: number;
    username: string;
    fullname: string;
    phone_number: string;
    photo: string | null;
    status: string;
    is_busy: boolean;
    rays_count: number;
  } | number;
  rays_id: number;
  start_time: string;
  chiqimliklar: any[];
  referenslar: any[];
  arizalar: any[];
  total_expense: number;
  details_expense: {
    chiqimlik: number;
    optol: number;
    balon: number;
    service: number;
  };
  from?: string;
  to?: string;
  distance?: number;
}

// Driver status types
enum DriverStatus {
  ON_ROAD = 'on_road',
  WAITING = 'waiting',
  ALL = 'all'
}

const DriversOnRoad: React.FC<DriversOnRoadProps> = ({
  drivers,
  loading: driversLoading,
  activeCars: propActiveCars,
  onEdit,
  onDelete,
  enableActions = false
}) => {
  const [activeCars, setActiveCars] = useState<ActiveCar[]>([]);
  const [waitingDrivers, setWaitingDrivers] = useState<DriverType[]>([]);
  const [loading, setLoading] = useState(!propActiveCars);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<DriverStatus>(DriverStatus.ALL);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Fetch active cars data if not provided as props
  useEffect(() => {
    if (propActiveCars && propActiveCars.length > 0) {
      console.log("Using provided active cars:", propActiveCars);
      setActiveCars(propActiveCars);
      
      // Identify waiting drivers
      if (drivers && drivers.length > 0) {
        const activeDriverIds = new Set(
          propActiveCars.map(car => 
            typeof car.driver === 'object' ? car.driver.id : car.driver
          )
        );
        
        const waiting = drivers.filter(driver => 
          !activeDriverIds.has(driver.id) && 
          (driver.status === 'active' || driver.status === 'driver') &&
          !driver.is_busy
        );
        
        setWaitingDrivers(waiting);
      }
      
      return;
    }
    
    const fetchActiveCars = async () => {
      try {
        setLoading(true);
        
        // Get active cars
        const carsResponse = await axiosInstance.get('/car-active/');
        console.log("Fetched active cars:", carsResponse.data);
        
        // Fetch additional ray information
        const enhancedData = await Promise.all(
          carsResponse.data.map(async (car) => {
            try {
              // Only fetch if we have a rays_id
              if (car.rays_id) {
                const rayDetails = await axiosInstance.get(`/ray/${car.rays_id}/`);
                return {
                  ...car,
                  from: rayDetails.data.from1 || 'Noma\'lum',
                  to: rayDetails.data.to_go || 'Noma\'lum',
                  distance: rayDetails.data.kilometer || 0
                };
              }
              return car;
            } catch (err) {
              console.error(`Error fetching ray details for ray ${car.rays_id}:`, err);
              return car;
            }
          })
        );
        
        setActiveCars(enhancedData);
        
        // Get all drivers to identify waiting drivers
        if (drivers.length === 0) {
          const driversResponse = await axiosInstance.get('/customusers/?status=driver');
          const allDrivers = driversResponse.data.results || [];
          
          // Extract active driver IDs
          const activeDriverIds = new Set(
            enhancedData.map(car => 
              typeof car.driver === 'object' ? car.driver.id : car.driver
            )
          );
          
          // Filter waiting drivers
          const waiting = allDrivers.filter(driver => 
            !activeDriverIds.has(driver.id) && 
            (driver.status === 'active' || driver.status === 'driver') &&
            !driver.is_busy
          );
          
          setWaitingDrivers(waiting);
        } else {
          // Use provided drivers list
          const activeDriverIds = new Set(
            enhancedData.map(car => 
              typeof car.driver === 'object' ? car.driver.id : car.driver
            )
          );
          
          const waiting = drivers.filter(driver => 
            !activeDriverIds.has(driver.id) && 
            (driver.status === 'active' || driver.status === 'driver') &&
            !driver.is_busy
          );
          
          setWaitingDrivers(waiting);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching active cars:', err);
        setError('Yo\'ldagi haydovchilar ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCars();
  }, [propActiveCars, drivers]);

  // Get driver by ID helper
  const getDriverById = (driverId: number) => {
    return drivers.find(d => d.id === driverId) || null;
  };

  // Handle edit action
  const handleEdit = (driverId: number) => {
    if (!onEdit) return;
    const driver = getDriverById(driverId);
    if (driver) onEdit(driver);
  };

  // Handle delete action
  const handleDelete = (driverId: number) => {
    if (!onDelete) return;
    const driver = getDriverById(driverId);
    if (driver) onDelete(driver);
  };

  // Calculate trip duration
  const getTripDuration = (startTime: string) => {
    if (!startTime) return 'Noma\'lum';
    
    const start = dayjs(startTime);
    const now = dayjs();
    
    // Use relative time for better display
    if (now.diff(start, 'days') > 0) {
      return start.fromNow(true);
    }
    
    const hours = now.diff(start, 'hour');
    const minutes = now.diff(start, 'minute') % 60;
    
    return `${hours} soat ${minutes} daqiqa`;
  };

  // Handle search input
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Handle status filter change
  const handleStatusChange = (e: any) => {
    setStatusFilter(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    
    // Set appropriate status filter based on tab
    if (key === 'on_road') {
      setStatusFilter(DriverStatus.ON_ROAD);
    } else if (key === 'waiting') {
      setStatusFilter(DriverStatus.WAITING);
    } else {
      setStatusFilter(DriverStatus.ALL);
    }
  };

  // Filter data based on search and status
  const getFilteredData = () => {
    let results = [...activeCars];
    
    // Apply status filter
    if (statusFilter === DriverStatus.ON_ROAD) {
      results = results.filter(car => !!car.rays_id);
    } else if (statusFilter === DriverStatus.WAITING) {
      // For waiting drivers, transform the waiting drivers array into activeCar-like format
      results = waitingDrivers.map(driver => ({
        driver: {
          id: driver.id,
          username: driver.username || '',
          fullname: driver.fullname,
          phone_number: driver.phone_number,
          photo: driver.photo,
          status: driver.status,
          is_busy: false,
          rays_count: driver.rays_count || 0
        },
        car_id: 0,
        car_name: 'Kutishda',
        rays_id: 0,
        start_time: driver.date || '',
        total_expense: 0,
        details_expense: {
          chiqimlik: 0,
          optol: 0,
          balon: 0,
          service: 0
        },
        chiqimliklar: [],
        referenslar: [],
        arizalar: []
      }));
    } else {
      // ALL - combine active cars and waiting drivers
      const waitingResults = waitingDrivers.map(driver => ({
        driver: {
          id: driver.id,
          username: driver.username || '',
          fullname: driver.fullname,
          phone_number: driver.phone_number,
          photo: driver.photo,
          status: driver.status,
          is_busy: false,
          rays_count: driver.rays_count || 0
        },
        car_id: 0,
        car_name: 'Kutishda',
        rays_id: 0,
        start_time: driver.date || '',
        total_expense: 0,
        details_expense: {
          chiqimlik: 0,
          optol: 0,
          balon: 0,
          service: 0
        },
        chiqimliklar: [],
        referenslar: [],
        arizalar: []
      }));
      
      results = [...results, ...waitingResults];
    }
    
    // Apply search text filter
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase().trim();
      
      results = results.filter(item => {
        // Driver data can be object or ID
        if (typeof item.driver === 'object') {
          return (
            item.driver.fullname?.toLowerCase().includes(lowerCaseSearch) ||
            item.driver.phone_number?.includes(searchText) ||
            (item.car_name || '').toLowerCase().includes(lowerCaseSearch) ||
            (item.from || '').toLowerCase().includes(lowerCaseSearch) ||
            (item.to || '').toLowerCase().includes(lowerCaseSearch)
          );
        }
        
        // Handle driver as ID number
        if (typeof item.driver === 'number') {
          const driverFromList = drivers.find(d => d.id === item.driver);
          if (driverFromList) {
            return (
              driverFromList.fullname?.toLowerCase().includes(lowerCaseSearch) ||
              driverFromList.phone_number?.includes(searchText) ||
              (item.car_name || '').toLowerCase().includes(lowerCaseSearch) ||
              (item.from || '').toLowerCase().includes(lowerCaseSearch) ||
              (item.to || '').toLowerCase().includes(lowerCaseSearch)
            );
          }
        }
        
        return (item.car_name || '').toLowerCase().includes(lowerCaseSearch);
      });
    }
    
    return results;
  };

  // Columns for the active cars table
  const columns = [
    {
      title: 'Haydovchi',
      key: 'driver',
      fixed: 'left' as const,
      width: 240,
      render: (_: unknown, record: ActiveCar) => {
        // Handle driver data which can be an object or ID
        const driverData = typeof record.driver === 'object' 
          ? record.driver 
          : drivers.find(d => d.id === record.driver);
        
        if (!driverData) {
          return <Text>Ma'lumot topilmadi</Text>;
        }
        
        return (
          <Space>
            <div style={{ position: 'relative' }}>
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#1890ff',
                }}
              >
                {driverData.fullname?.charAt(0)}
              </Avatar>
              <Badge 
                status={record.rays_id ? "processing" : "default"} 
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>
                {driverData.fullname}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {driverData.phone_number}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Mashina',
      key: 'car',
      width: 180,
      render: (_: unknown, record: ActiveCar) => (
        <Tag color={record.rays_id ? "blue" : "default"} icon={<CarOutlined />} style={{ padding: '4px 8px' }}>
          {record.car_name}
        </Tag>
      ),
    },
    {
      title: 'Yo\'nalish',
      key: 'direction',
      width: 180,
      render: (_: unknown, record: ActiveCar) => (
        record.from && record.to ? (
          <Tooltip title={`Masofa: ${record.distance || 0} km`}>
            <Space direction="vertical" size={0}>
              <Text>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {record.from} → {record.to}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.distance || 0} km
              </Text>
            </Space>
          </Tooltip>
        ) : record.rays_id ? (
          <Text type="secondary">Ma'lumot yo'q</Text>
        ) : (
          <Text type="secondary">Kutishda</Text>
        )
      ),
    },
    {
      title: 'Vaqt',
      key: 'time',
      width: 180,
      render: (_: unknown, record: ActiveCar) => (
        record.rays_id ? (
          <Space direction="vertical" size={0}>
            <Text>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              {dayjs(record.start_time).format('DD.MM.YYYY HH:mm')}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {getTripDuration(record.start_time)} yo&apos;lda
            </Text>
          </Space>
        ) : (
          <Text type="secondary">Kutishda</Text>
        )
      ),
    },
    {
      title: 'Xarajat',
      key: 'expense',
      width: 120,
      render: (_: unknown, record: ActiveCar) => (
        record.rays_id ? (
          <Text style={{ color: record.total_expense > 0 ? '#ff4d4f' : '#8c8c8c', fontWeight: 'bold' }}>
            <DollarOutlined style={{ marginRight: 4 }} /> 
            {record.total_expense ? record.total_expense.toLocaleString() : '0'} 
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: unknown, record: ActiveCar) => (
        record.rays_id ? (
          <Tag color="processing" icon={<CarOutlined />} style={{ padding: '4px 8px' }}>
            Yo&apos;lda
          </Tag>
        ) : (
          <Tag color="default" icon={<PauseCircleOutlined />} style={{ padding: '4px 8px' }}>
            Kutishda
          </Tag>
        )
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: ActiveCar) => {
        // Get driver ID
        const driverId = typeof record.driver === 'object' 
          ? record.driver.id 
          : record.driver;
        
        return enableActions ? (
          <Space size="small">
            {record.rays_id && (
              <Tooltip title="Tarix">
                <Button
                  icon={<HistoryOutlined />}
                  size="small"
                  onClick={() => window.open(`/modules/ceo/drivers/${driverId}/history`, '_blank')}
                />
              </Tooltip>
            )}
            <Tooltip title="Tahrirlash">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(driverId)}
              />
            </Tooltip>
            <Tooltip title="O'chirish">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(driverId)}
              />
            </Tooltip>
          </Space>
        ) : (
          <Button
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => window.open(`/modules/ceo/drivers/${driverId}/history`, '_blank')}
          >
            Batafsil
          </Button>
        );
      },
    },
  ];

  if (loading || driversLoading) {
    return (
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 16 }}>
            Haydovchilar ma&apos;lumotlari yuklanmoqda...
          </Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="Xatolik"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => window.location.reload()}>
              Qayta yuklash
            </Button>
          }
        />
      </Card>
    );
  }

  const filteredData = getFilteredData();
  
  // Statistics
  const onRoadCount = activeCars.filter(car => !!car.rays_id).length;
  const waitingCount = waitingDrivers.length;
  const totalExpenses = activeCars.reduce((sum, item) => sum + (item.total_expense || 0), 0);

  return (
    <div className="drivers-on-road">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            className="info-card" 
            style={{ 
              background: 'linear-gradient(to right, #1890ff, #69c0ff)',
              color: 'white',
              borderRadius: '8px',
              marginBottom: 16
            }}
          >
            <Space align="start">
              <InfoCircleOutlined style={{ fontSize: 24, color: 'white' }} />
              <div>
                <Text strong style={{ color: 'white', fontSize: '16px' }}>
                  Haydovchilar holati monitiringi
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  Barcha haydovchilar, yo&apos;ldagi haydovchilar va kutishdagi haydovchilar ma&apos;lumotlari
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ background: '#f6ffed', borderRadius: '8px' }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Yo&apos;ldagi haydovchilar</Text>
                <div>
                  <Text strong style={{ fontSize: '24px', color: '#52c41a' }}>{onRoadCount}</Text>
                </div>
              </div>
              <CarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ background: '#f9f0ff', borderRadius: '8px' }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Kutishdagi haydovchilar</Text>
                <div>
                  <Text strong style={{ fontSize: '24px', color: '#722ed1' }}>{waitingCount}</Text>
                </div>
              </div>
              <PauseCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ background: '#fff2e8', borderRadius: '8px' }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Jami xarajatlar</Text>
                <div>
                  <Text strong style={{ fontSize: '24px', color: '#fa541c' }}>{totalExpenses.toLocaleString()} USD</Text>
                </div>
              </div>
              <DollarOutlined style={{ fontSize: 24, color: '#fa541c' }} />
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Card 
        title={
          <Space>
            <CarOutlined style={{ color: '#1890ff' }} />
            <Title level={5} style={{ margin: 0 }}>Haydovchilar monitiringi</Title>
          </Space>
        }
        className="drivers-on-road-card"
        style={{ borderRadius: '8px' }}
        extra={
          <Space>
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              allowClear
            />
            <Radio.Group 
              value={statusFilter}
              onChange={handleStatusChange}
              buttonStyle="solid"
              optionType="button"
            >
              <Radio.Button value={DriverStatus.ALL}>Hammasi</Radio.Button>
              <Radio.Button value={DriverStatus.ON_ROAD}>Yo&apos;lda</Radio.Button>
              <Radio.Button value={DriverStatus.WAITING}>Kutishda</Radio.Button>
            </Radio.Group>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab={`Hammasi (${onRoadCount + waitingCount})`} key="all">
            {filteredData.length > 0 ? (
              <Table
                dataSource={filteredData}
                columns={columns}
                rowKey={(record) => `${typeof record.driver === 'object' ? record.driver.id : record.driver}-${record.rays_id || 0}`}
                pagination={{ 
                  pageSize: 10, 
                  showTotal: (total) => `Jami ${total} haydovchi`,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'] 
                }}
                scroll={{ x: 1100 }}
                rowClassName={(record) => record.rays_id ? 'on-road-row' : 'waiting-row'}
              />
            ) : (
              <Empty description="Haydovchilar topilmadi" />
            )}
          </TabPane>
          <TabPane tab={`Yo'lda (${onRoadCount})`} key="on_road">
            {filteredData.length > 0 ? (
              <Table
                dataSource={filteredData}
                columns={columns}
                rowKey={(record) => `${typeof record.driver === 'object' ? record.driver.id : record.driver}-${record.rays_id || 0}`}
                pagination={{ 
                  pageSize: 10, 
                  showTotal: (total) => `Jami ${total} haydovchi`,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'] 
                }}
                scroll={{ x: 1100 }}
                rowClassName="on-road-row"
              />
            ) : (
              <Empty description="Yo'ldagi haydovchilar topilmadi" />
            )}
          </TabPane>
          <TabPane tab={`Kutishda (${waitingCount})`} key="waiting">
            {filteredData.length > 0 ? (
              <Table
                dataSource={filteredData}
                columns={columns}
                rowKey={(record) => `${typeof record.driver === 'object' ? record.driver.id : record.driver}-${record.rays_id || 0}`}
                pagination={{ 
                  pageSize: 10, 
                  showTotal: (total) => `Jami ${total} haydovchi`,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'] 
                }}
                scroll={{ x: 1100 }}
                rowClassName="waiting-row"
              />
            ) : (
              <Empty description="Kutishdagi haydovchilar topilmadi" />
            )}
          </TabPane>
        </Tabs>
      </Card>
      
      <style jsx global>{`
        .on-road-row {
          background-color: #f6ffed;
        }
        .on-road-row:hover {
          background-color: #d9f7be !important;
        }
        .waiting-row {
          background-color: #fafafa;
        }
        .waiting-row:hover {
          background-color: #f0f0f0 !important;
        }
      `}</style>
    </div>
  );
};

export default DriversOnRoad; 