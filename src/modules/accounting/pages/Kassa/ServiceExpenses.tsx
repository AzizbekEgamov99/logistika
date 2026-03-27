import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Row, Col, Statistic, Progress, 
  Typography, Empty, message, Button, Space, Tag,
  DatePicker, Select, Tooltip, Avatar, Tabs
} from 'antd';
import { 
  ToolOutlined, CarOutlined, FireOutlined, 
  ShoppingOutlined, ReloadOutlined, CarFilled,
  CalendarOutlined, DollarOutlined
} from '@ant-design/icons';
import { cashApi } from '../../api/cash/cashApi';
import { ServiceTotals, ServiceRecord } from '../../types/cash.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface VehicleServiceStats {
  carId: number;
  carName: string;
  servicesCount: number;
  totalSpent: number;
  lastService: string;
}

const ServiceExpenses: React.FC = () => {
  const [serviceTotals, setServiceTotals] = useState<ServiceTotals | null>(null);
  const [serviceData, setServiceData] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expenseType, setExpenseType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await cashApi.getServiceTotalsWithDate();
      
      if (response) {
        setServiceData(response.all_expenses);
        setServiceTotals(response);
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
      message.error('Xizmat xarajatlari ma\'lumotlarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

  // Filter expenses based on type, date range, and car
  const filteredExpenses = React.useMemo(() => {
    if (!serviceData.length) return [];
    
    let filtered = [...serviceData];
    
    // Filter by expense type
    if (expenseType !== 'all') {
      filtered = filtered.filter(expense => {
        // Map Russian type names to our internal types
        const typeMap: Record<string, string> = {
          'Техобслуживание': 'texnic',
          'Шиномонтаж': 'balon',
          'Шиномонтаж Фургон': 'balon_furgon',
          'Расход': 'chiqimlik',
          'Топливо': 'optol'
        };
        
        return typeMap[expense.type] === expenseType;
      });
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      
      filtered = filtered.filter(expense => {
        const expenseDate = dayjs(expense.created_at);
        return expenseDate.isAfter(startDate) && expenseDate.isBefore(endDate);
      });
    }
    
    // Filter by car
    if (selectedCarId !== null) {
      filtered = filtered.filter(expense => expense.car === selectedCarId);
    }
    
    return filtered;
  }, [serviceData, expenseType, dateRange, selectedCarId]);

  // Calculate vehicle statistics
  const vehicleStats = React.useMemo(() => {
    if (!serviceData.length) return [];
    
    const stats: Record<number, VehicleServiceStats> = {};
    
    serviceData.forEach(service => {
      if (!stats[service.car]) {
        stats[service.car] = {
          carId: service.car,
          carName: service.car_name,
          servicesCount: 0,
          totalSpent: 0,
          lastService: service.created_at
        };
      }
      
      stats[service.car].servicesCount++;
      stats[service.car].totalSpent += service.usd_value;
      
      // Update last service date if current is more recent
      const currentDate = new Date(service.created_at);
      const lastDate = new Date(stats[service.car].lastService);
      if (currentDate > lastDate) {
        stats[service.car].lastService = service.created_at;
      }
    });
    
    return Object.values(stats).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [serviceData]);

  // Handle date range change
  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateRange(dates);
  };

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    setExpenseType(value);
  };

  // Handle car selection
  const handleCarSelect = (carId: number | null) => {
    setSelectedCarId(carId);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setExpenseType('all');
    setDateRange(null);
    setSelectedCarId(null);
  };

  // Get color for service type
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'Техобслуживание': 'green',
      'Шиномонтаж': 'blue',
      'Шиномонтаж Фургон': 'cyan',
      'Расход': 'orange',
      'Топливо': 'purple'
    };
    return typeColors[type] || 'default';
  };

  // Get icon for service type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Техобслуживание': return <ToolOutlined />;
      case 'Шиномонтаж': return <CarOutlined />;
      case 'Шиномонтаж Фургон': return <CarFilled />;
      case 'Расход': return <FireOutlined />;
      case 'Топливо': return <ShoppingOutlined />;
      default: return null;
    }
  };

  // Format service type name for display
  const formatTypeName = (type: string): string => {
    const typeNames: Record<string, string> = {
      'Техобслуживание': 'Texnik xizmat',
      'Шиномонтаж': 'Balon xizmat',
      'Шиномонтаж Фургон': 'Furgon balon xizmat',
      'Расход': 'Chiqim xarajatlar',
      'Топливо': 'Yoqilg&apos;i xarajatlar'
    };
    return typeNames[type] || type;
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Umumiy ma\'lumot',
      children: (
        <>
          {/* Summary Cards */}
          <Row gutter={[16, 16]}>
            {serviceTotals && (
              <>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Card className="expense-card" bordered={false} style={{ background: '#f6ffed' }}>
                    <Statistic
                      title={<Space><ToolOutlined /> Texnik xizmat</Space>}
                      value={serviceTotals.totals_usd.texnic}
                      precision={2}
                      suffix="USD"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Card className="expense-card" bordered={false} style={{ background: '#e6f7ff' }}>
                    <Statistic
                      title={<Space><CarOutlined /> Balon xizmati</Space>}
                      value={serviceTotals.totals_usd.balon}
                      precision={2}
                      suffix="USD"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Card className="expense-card" bordered={false} style={{ background: '#f0f5ff' }}>
                    <Statistic
                      title={<Space><CarFilled /> Furgon balon</Space>}
                      value={serviceTotals.totals_usd.balon_furgon}
                      precision={2}
                      suffix="USD"
                      valueStyle={{ color: '#2f54eb' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Card className="expense-card" bordered={false} style={{ background: '#fff2e8' }}>
                    <Statistic
                      title={<Space><FireOutlined /> Chiqim xarajat</Space>}
                      value={serviceTotals.totals_usd.chiqimlik}
                      precision={2}
                      suffix="USD"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Card className="expense-card" bordered={false} style={{ background: '#f9f0ff' }}>
                    <Statistic
                      title={<Space><ShoppingOutlined /> Yoqilg&apos;i</Space>}
                      value={serviceTotals.totals_usd.optol}
                      precision={2}
                      suffix="USD"
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <Card className="expense-card" bordered={false} style={{ background: '#fcfcfc', border: '1px solid #f0f0f0' }}>
                    <Statistic
                      title={<Space><DollarOutlined /> Jami xarajat</Space>}
                      value={serviceTotals.totals_usd.total}
                      precision={2}
                      suffix="USD"
                      valueStyle={{ color: '#000000', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </>
            )}
          </Row>

          {/* Progress and Percentage */}
          {serviceTotals && (
            <Card style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Xarajatlar taqsimoti:</Text>
                  <Text strong style={{ fontSize: 16 }}>{serviceTotals.totals_usd.total.toFixed(2)} USD</Text>
                </div>
                <Progress 
                  percent={100} 
                  success={{ 
                    percent: (serviceTotals.totals_usd.texnic / serviceTotals.totals_usd.total) * 100 
                  }}
                  strokeColor={{
                    '0%': '#52c41a',
                    '25%': '#1890ff',
                    '40%': '#2f54eb',
                    '65%': '#fa8c16',
                    '100%': '#722ed1',
                  }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  <Tooltip title={`${serviceTotals.totals_usd.texnic.toFixed(2)} USD`}>
                    <Tag color="green">
                      Texnik: {((serviceTotals.totals_usd.texnic / serviceTotals.totals_usd.total) * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                  <Tooltip title={`${serviceTotals.totals_usd.balon.toFixed(2)} USD`}>
                    <Tag color="blue">
                      Balon: {((serviceTotals.totals_usd.balon / serviceTotals.totals_usd.total) * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                  <Tooltip title={`${serviceTotals.totals_usd.balon_furgon.toFixed(2)} USD`}>
                    <Tag color="cyan">
                      Furgon balon: {((serviceTotals.totals_usd.balon_furgon / serviceTotals.totals_usd.total) * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                  <Tooltip title={`${serviceTotals.totals_usd.chiqimlik.toFixed(2)} USD`}>
                    <Tag color="orange">
                      Chiqim: {((serviceTotals.totals_usd.chiqimlik / serviceTotals.totals_usd.total) * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                  <Tooltip title={`${serviceTotals.totals_usd.optol.toFixed(2)} USD`}>
                    <Tag color="purple">
                      Yoqilg&apos;i: {((serviceTotals.totals_usd.optol / serviceTotals.totals_usd.total) * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                </div>
              </div>
              
              {vehicleStats.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <Title level={5}>Transport vositalari bo&apos;yicha xarajatlar</Title>
                  <Row gutter={[16, 16]}>
                    {vehicleStats.slice(0, 4).map(vehicle => (
                      <Col xs={24} sm={12} md={6} key={vehicle.carId}>
                        <Card size="small" hoverable onClick={() => handleCarSelect(vehicle.carId)}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Space align="center">
                              <Avatar icon={<CarOutlined />} style={{ backgroundColor: '#1890ff' }} />
                              <Text strong>{vehicle.carName}</Text>
                            </Space>
                            <Statistic 
                              title="Jami xarajat" 
                              value={vehicle.totalSpent} 
                              precision={2}
                              suffix="USD" 
                              valueStyle={{ fontSize: '16px' }}
                            />
                            <Space>
                              <Tag color="blue">{vehicle.servicesCount} ta xizmat</Tag>
                              <Tag color="green">
                                <CalendarOutlined /> {dayjs(vehicle.lastService).format('DD.MM.YYYY')}
                              </Tag>
                            </Space>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card>
          )}
        </>
      )
    },
    {
      key: 'details',
      label: 'Batafsil ma\'lumot',
      children: (
        <Card 
          title="Xarajatlar ro'yxati" 
          extra={
            <Space>
              <Select 
                placeholder="Xarajat turi" 
                style={{ width: 180 }} 
                onChange={handleTypeChange}
                value={expenseType}
              >
                <Option value="all">Barcha xarajatlar</Option>
                <Option value="texnic">Texnik xizmat</Option>
                <Option value="balon">Balon xizmati</Option>
                <Option value="balon_furgon">Furgon balon xizmati</Option>
                <Option value="chiqimlik">Chiqim xarajatlari</Option>
                <Option value="optol">Yoqilg&apos;i xarajatlari</Option>
              </Select>
              
              <RangePicker 
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ width: 240 }}
                placeholder={['Boshlanish', 'Tugash']}
              />
              
              <Button onClick={handleResetFilters}>
                Filtrlarni tozalash
              </Button>
              
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={fetchServiceData}
              >
                Yangilash
              </Button>
            </Space>
          }
        >
          <Table
            dataSource={filteredExpenses}
            rowKey={(record) => `${record.car}-${record.created_at}-${record.id || Math.random().toString(36).substr(2, 9)}`}
            pagination={{ pageSize: 10 }}
            loading={loading}
            columns={[
              {
                title: 'Sana',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date: string) => (
                  <Space>
                    <CalendarOutlined />
                    {dayjs(date).format('DD.MM.YYYY')}
                  </Space>
                ),
                sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
              },
              {
                title: 'Transport',
                dataIndex: 'car_name',
                key: 'car_name',
                render: (name: string, record) => (
                  <Space>
                    <Avatar icon={<CarOutlined />} size="small" style={{ backgroundColor: '#1890ff' }} />
                    <Text>{name}</Text>
                    <Tag color="blue">{record.kilometer} km</Tag>
                  </Space>
                ),
                filters: Array.from(new Set(serviceData.map(item => item.car_name)))
                  .map(name => ({ text: name, value: name })),
                onFilter: (value, record) => record.car_name === value,
              },
              {
                title: 'Turi',
                dataIndex: 'type',
                key: 'type',
                render: (type: string) => (
                  <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
                    {formatTypeName(type)}
                  </Tag>
                ),
                filters: [
                  { text: 'Texnik xizmat', value: 'Техобслуживание' },
                  { text: 'Balon xizmat', value: 'Шиномонтаж' },
                  { text: 'Furgon balon', value: 'Шиномонтаж Фургон' },
                  { text: 'Chiqim', value: 'Расход' },
                  { text: 'Yoqilg&apos;i', value: 'Топливо' }
                ],
                onFilter: (value, record) => record.type === value,
              },
              {
                title: 'Summa',
                dataIndex: 'price',
                key: 'price',
                render: (price: number, record: ServiceRecord) => 
                  `${price.toLocaleString()} ${record.currency}`,
                sorter: (a, b) => a.price - b.price,
              },
              {
                title: 'USD qiymati',
                dataIndex: 'usd_value',
                key: 'usd_value',
                render: (value: number) => `${value.toLocaleString()} USD`,
                sorter: (a, b) => a.usd_value - b.usd_value,
              }
            ]}
            summary={(pageData) => {
              const total = pageData.reduce((sum, item) => sum + item.usd_value, 0);
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <strong>Jami:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <strong>{total.toFixed(2)} USD</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </Card>
      )
    },
    {
      key: 'vehicles',
      label: 'Transport vositalari',
      children: (
        <Card title="Transport vositalari bo&apos;yicha xarajatlar">
          {vehicleStats.length > 0 ? (
            <Row gutter={[16, 16]}>
              {vehicleStats.map(vehicle => (
                <Col xs={24} sm={12} md={8} lg={6} key={vehicle.carId}>
                  <Card 
                    hoverable 
                    className={selectedCarId === vehicle.carId ? 'vehicle-card-selected' : 'vehicle-card'}
                    onClick={() => handleCarSelect(vehicle.carId === selectedCarId ? null : vehicle.carId)}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <Avatar 
                        icon={<CarOutlined />} 
                        size={64} 
                        style={{ 
                          backgroundColor: selectedCarId === vehicle.carId ? '#1890ff' : '#f0f0f0',
                          color: selectedCarId === vehicle.carId ? '#ffffff' : '#1890ff'
                        }} 
                      />
                      <Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>{vehicle.carName}</Title>
                    </div>
                    
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Statistic
                          title="Jami xarajat"
                          value={vehicle.totalSpent}
                          precision={2}
                          suffix="USD"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Xizmatlar soni"
                          value={vehicle.servicesCount}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                    </Row>
                    
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">So&apos;nggi xizmat:</Text>
                      <div>
                        <Tag icon={<CalendarOutlined />} color="blue">
                          {dayjs(vehicle.lastService).format('DD.MM.YYYY')}
                        </Tag>
                      </div>
                    </div>
                    
                    {serviceData.some(service => service.car === vehicle.carId) && (
                      <div style={{ marginTop: 16 }}>
                        <Text type="secondary">Xizmat turlari:</Text>
                        <div style={{ marginTop: 8 }}>
                          {Array.from(new Set(serviceData
                            .filter(service => service.car === vehicle.carId)
                            .map(service => service.type)))
                            .map(type => (
                              <Tag 
                                key={type} 
                                color={getTypeColor(type)} 
                                icon={getTypeIcon(type)}
                                style={{ marginBottom: 5 }}
                              >
                                {formatTypeName(type)}
                              </Tag>
                            ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="Transport vositalari ma&apos;lumotlari mavjud emas" />
          )}
        </Card>
      )
    }
  ];

  return (
    <div className="service-expenses">
      <Tabs defaultActiveKey="overview" items={tabItems} />
    </div>
  );
};

export default ServiceExpenses; 