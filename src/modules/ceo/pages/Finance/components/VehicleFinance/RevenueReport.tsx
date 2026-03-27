import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Typography, Statistic, Empty } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CarOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import type { Vehicle, Trip } from './VehicleFinance';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export interface RevenueReportProps {
  vehicles: Vehicle[];
  trips: Trip[];
}

interface ChartData {
  name: string;
  revenue: number;
  profit: number;
}

const RevenueReport: React.FC<RevenueReportProps> = ({ vehicles, trips }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');
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

  // Process data for the chart
  const getChartData = (): ChartData[] => {
    // Filter vehicles based on selection
    const filteredVehicles = selectedVehicleId === 'all' 
      ? vehicles 
      : vehicles.filter(v => v.id === selectedVehicleId);
    
    // Map to chart data format
    return filteredVehicles.map(vehicle => ({
      name: vehicle.name,
      revenue: vehicle.totalRevenue,
      profit: vehicle.totalRevenue - vehicle.totalExpenses,
    }));
  };

  // Calculate total revenue for selected vehicles
  const getTotalRevenue = (): number => {
    const filteredVehicles = selectedVehicleId === 'all' 
      ? vehicles 
      : vehicles.filter(v => v.id === selectedVehicleId);
      
    return filteredVehicles.reduce((sum, vehicle) => sum + vehicle.totalRevenue, 0);
  };

  // Calculate total profit for selected vehicles
  const getTotalProfit = (): number => {
    const filteredVehicles = selectedVehicleId === 'all' 
      ? vehicles 
      : vehicles.filter(v => v.id === selectedVehicleId);
      
    return filteredVehicles.reduce((sum, vehicle) => 
      sum + (vehicle.totalRevenue - vehicle.totalExpenses), 0);
  };

  // Get trips data for the table
  const getTripsData = () => {
    // Filter trips based on vehicle selection
    return trips.filter(trip => 
      (selectedVehicleId === 'all' || trip.vehicleId === selectedVehicleId) &&
      (!dateRange || (
        trip.startDate >= dateRange[0] &&
        trip.startDate <= dateRange[1]
      ))
    );
  };

  // Table columns for trips
  const tripColumns = [
    {
      title: 'Sana',
      dataIndex: 'startDate',
      key: 'date',
      render: (date: Date) => date.toLocaleDateString(),
      sorter: (a: Trip, b: Trip) => a.startDate.getTime() - b.startDate.getTime(),
    },
    {
      title: 'Marshrut',
      key: 'route',
      render: (text: string, record: Trip) => `${record.origin} - ${record.destination}`,
    },
    {
      title: 'Transport',
      key: 'vehicle',
      render: (text: string, record: Trip) => {
        const vehicle = vehicles.find(v => v.id === record.vehicleId);
        return vehicle ? vehicle.name : 'Unknown';
      },
    },
    {
      title: 'Masofa (km)',
      dataIndex: 'distance',
      key: 'distance',
      sorter: (a: Trip, b: Trip) => a.distance - b.distance,
    },
    {
      title: 'Daromad',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => (
        <Text style={{ color: '#52c41a' }}>
          {formatCurrency(revenue)}
        </Text>
      ),
      sorter: (a: Trip, b: Trip) => a.revenue - b.revenue,
    },
    {
      title: 'Xarajat',
      dataIndex: 'expenses',
      key: 'expenses',
      render: (expenses: number) => (
        <Text style={{ color: '#f5222d' }}>
          {formatCurrency(expenses)}
        </Text>
      ),
      sorter: (a: Trip, b: Trip) => a.expenses - b.expenses,
    },
    {
      title: 'Foyda',
      key: 'profit',
      render: (text: string, record: Trip) => {
        const profit = record.revenue - record.expenses;
        return (
          <Text style={{ color: profit >= 0 ? '#52c41a' : '#f5222d' }}>
            {formatCurrency(profit)}
          </Text>
        );
      },
      sorter: (a: Trip, b: Trip) => 
        (a.revenue - a.expenses) - (b.revenue - b.expenses),
    },
  ];

  return (
    <div className="revenue-report">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedVehicleId}
                  onChange={setSelectedVehicleId}
                >
                  <Option value="all">Barcha transportlar</Option>
                  {vehicles.map(vehicle => (
                    <Option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                >
                  <Option value="week">Haftalik</Option>
                  <Option value="month">Oylik</Option>
                  <Option value="quarter">Choraklik</Option>
                  <Option value="year">Yillik</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} md={6}>
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
              <Col xs={24} sm={24} md={6} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={() => console.log('Generate report')}
                >
                  Hisobot yaratish
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Umumiy daromad"
              value={getTotalRevenue()}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Umumiy foyda"
              value={getTotalProfit()}
              precision={0}
              valueStyle={{ color: getTotalProfit() >= 0 ? '#52c41a' : '#f5222d' }}
              prefix={getTotalProfit() >= 0 ? <RiseOutlined /> : <FallOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="foyda"
              value={getTotalRevenue() > 0 ? (getTotalProfit() / getTotalRevenue()) * 100 : 0}
              precision={1}
              valueStyle={{ 
                color: getTotalProfit() >= 0 ? '#52c41a' : '#f5222d' 
              }}
              suffix="%"
            />
          </Card>
        </Col>
        
        <Col span={24}>
          <Card title="Daromadlar tahlili">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getChartData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(value)
                  }
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))} 
                />
                <Legend />
                <Bar dataKey="revenue" name="Daromad" fill="#52c41a" />
                <Bar dataKey="profit" name="Foyda" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col span={24}>
          <Card title="Reyslar bo'yicha daromadlar">
            {getTripsData().length === 0 ? (
              <Empty description="Daromad ma'lumotlari mavjud emas" />
            ) : (
              <Table
                columns={tripColumns}
                dataSource={getTripsData()}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueReport; 