import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Table, Typography, Statistic, Divider } from 'antd';
import { Pie } from '@ant-design/charts';
import { PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ToolOutlined, DollarOutlined, AreaChartOutlined, CarOutlined } from '@ant-design/icons';
import type { Vehicle, VehicleService, Trip } from './VehicleFinance';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export interface ExpensesReportProps {
  vehicles: Vehicle[];
  services: VehicleService[];
  trips: Trip[];
}

const ExpensesReport: React.FC<ExpensesReportProps> = ({ vehicles, services, trips }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter services based on date range and selected vehicle
  const filteredServices = services.filter(service => {
    // Filter by vehicle if one is selected
    if (selectedVehicle !== 'all' && String(service.vehicleId) !== selectedVehicle) {
      return false;
    }

    // Filter by date range if selected
    if (dateRange) {
      const serviceDate = new Date(service.date);
      return serviceDate >= dateRange[0] && serviceDate <= dateRange[1];
    }

    return true;
  });

  // Filter trips based on date range and selected vehicle
  const filteredTrips = trips.filter(trip => {
    // Filter by vehicle if one is selected
    if (selectedVehicle !== 'all' && String(trip.vehicleId) !== selectedVehicle) {
      return false;
    }

    // Filter by date range if selected
    if (dateRange) {
      const tripDate = new Date(trip.startDate);
      return tripDate >= dateRange[0] && tripDate <= dateRange[1];
    }

    return true;
  });

  // Calculate expenses statistics
  const totalServiceExpenses = filteredServices.reduce((sum, service) => sum + service.price, 0);
  const totalTripExpenses = filteredTrips.reduce((sum, trip) => sum + trip.expenses, 0);
  const totalExpenses = totalServiceExpenses + totalTripExpenses;

  // Calculate average expenses
  const avgServiceExpense = filteredServices.length > 0 ? totalServiceExpenses / filteredServices.length : 0;
  const avgTripExpense = filteredTrips.length > 0 ? totalTripExpenses / filteredTrips.length : 0;

  // Get expenses by category for pie chart
  const getExpensesByCategory = () => {
    const services = filteredServices;
    const expensesByCategory: Record<string, number> = {};
    
    services.forEach(service => {
      if (!expensesByCategory[service.serviceType]) {
        expensesByCategory[service.serviceType] = 0;
      }
      expensesByCategory[service.serviceType] += service.price;
    });
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name: getCategoryTranslation(name),
      value,
    }));
  };

  // Get expenses by vehicle for pie chart
  const getExpensesByVehicle = () => {
    const services = filteredServices;
    const expensesByVehicle: Record<string, number> = {};
    
    services.forEach(service => {
      if (!expensesByVehicle[service.vehicleId]) {
        expensesByVehicle[service.vehicleId] = 0;
      }
      expensesByVehicle[service.vehicleId] += service.price;
    });
    
    return Object.entries(expensesByVehicle).map(([vehicleId, value]) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      return {
        name: vehicle ? vehicle.name : 'Unknown',
        value,
      };
    });
  };

  // Get category translation in Uzbek
  const getCategoryTranslation = (category: string): string => {
    switch (category) {
      case 'maintenance':
        return 'Texnik xizmat';
      case 'repair':
        return 'Ta\'mirlash';
      case 'inspection':
        return 'Ko\'rik';
      default:
        return category;
    }
  };

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#45B39D'];

  // Table columns for expenses
  const expenseColumns = [
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => date.toLocaleDateString(),
      sorter: (a: VehicleService, b: VehicleService) => a.date.getTime() - b.date.getTime(),
    },
    {
      title: 'Transport',
      key: 'vehicle',
      render: (text: string, record: VehicleService) => {
        const vehicle = vehicles.find(v => v.id === record.vehicleId);
        return vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : 'Unknown';
      },
    },
    {
      title: 'Kategoria',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (type: string) => getCategoryTranslation(type),
      filters: [
        { text: 'Texnik xizmat', value: 'maintenance' },
        { text: 'Ta\'mirlash', value: 'repair' },
        { text: 'Ko\'rik', value: 'inspection' },
      ],
      onFilter: (value: string, record: VehicleService) => record.serviceType === value,
    },
    {
      title: 'Tavsif',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Narx',
      dataIndex: 'price',
      key: 'price',
      render: (cost: number) => (
        <Text style={{ color: '#f5222d' }}>
          {formatCurrency(cost)}
        </Text>
      ),
      sorter: (a: VehicleService, b: VehicleService) => a.price - b.price,
    },
  ];

  return (
    <div className="expenses-report">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedVehicle}
                  onChange={setSelectedVehicle}
                >
                  <Option value="all">Barcha transportlar</Option>
                  {vehicles.map(vehicle => (
                    <Option key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={16}>
                <RangePicker 
                  style={{ width: '100%' }}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange([dates[0]?.toDate()!, dates[1]?.toDate()!]);
                    } else {
                      setDateRange(null);
                    }
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24}>
          <Card>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Statistic
                  title="Jami xarajatlar"
                  value={totalExpenses}
                  precision={2}
                  valueStyle={{ color: '#f5222d' }}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
                <Divider />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="O'rtacha xarajat"
                      value={avgServiceExpense}
                      precision={2}
                      valueStyle={{ color: '#722ed1' }}
                      prefix={<ToolOutlined />}
                      suffix="USD"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Servislar soni"
                      value={filteredServices.length}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                </Row>
              </Col>
              
              <Col xs={24} md={16}>
                <Title level={5}>Xarajatlar tahlili</Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Card title="Kategoriya bo'yicha" size="small">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={getExpensesByCategory()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getExpensesByCategory().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  
                  {selectedVehicle === 'all' && (
                    <Col xs={24} sm={12}>
                      <Card title="Transport bo'yicha" size="small">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={getExpensesByVehicle()}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {getExpensesByVehicle().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col span={24}>
          <Card title="Xarajatlar ro'yxati">
            <Table
              columns={expenseColumns}
              dataSource={filteredServices}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Texnik xizmat xarajatlari"
              value={totalServiceExpenses}
              precision={2}
              prefix={<ToolOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Reys xarajatlari"
              value={totalTripExpenses}
              precision={2}
              prefix={<AreaChartOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="O'rtacha reys xarajati"
              value={avgTripExpense}
              precision={2}
              prefix={<CarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* Trip Expenses Table */}
      <h3>Reys xarajatlari</h3>
      {filteredTrips.length === 0 ? (
        <Empty description="Reys xarajatlari mavjud emas" />
      ) : (
        <Table
          dataSource={filteredTrips}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          columns={[
            {
              title: 'Transport',
              key: 'vehicle',
              render: (_, record) => {
                const vehicle = vehicles.find(v => String(v.id) === String(record.vehicleId));
                return vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : 'Nomalum';
              },
            },
            {
              title: 'Marshrutlar',
              key: 'route',
              render: (_, record) => `${record.origin} → ${record.destination}`,
            },
            {
              title: 'Sana',
              dataIndex: 'startDate',
              key: 'startDate',
              render: value => new Date(value).toLocaleDateString(),
            },
            {
              title: 'Masofa',
              dataIndex: 'distance',
              key: 'distance',
              render: value => `${value} km`,
            },
            {
              title: 'Xarajat',
              dataIndex: 'expenses',
              key: 'expenses',
              render: value => `$${value.toLocaleString()}`,
              sorter: (a, b) => a.expenses - b.expenses,
            },
          ]}
          summary={pageData => {
            const totalExpenses = pageData.reduce((sum, item) => sum + item.expenses, 0);
            
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <strong>Jami:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>${totalExpenses.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      )}
    </div>
  );
};

export default ExpensesReport; 