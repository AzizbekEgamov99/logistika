import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spin, DatePicker } from 'antd';
import { RevenueStats } from './RevenueStats';
import { RevenueChart } from './RevenueChart';
import { PageHeader } from 'antd';
import { DollarOutlined, ToolOutlined, CarOutlined } from '@ant-design/icons';

// Mock data - replace with actual API calls in production
const mockRevenueStats = [
  {
    title: 'Total Revenue',
    currentValue: 5420000,
    previousValue: 4980000,
    icon: 'dollar',
    color: '#1890ff'
  },
  {
    title: 'Maintenance Costs',
    currentValue: 820000,
    previousValue: 790000,
    icon: 'tool',
    color: '#faad14'
  },
  {
    title: 'Fleet Revenue',
    currentValue: 3250000,
    previousValue: 2890000,
    icon: 'car',
    color: '#52c41a'
  }
];

const mockChartData = [
  { month: 'Jan', category: 'Revenue', value: 4200000 },
  { month: 'Feb', category: 'Revenue', value: 4500000 },
  { month: 'Mar', category: 'Revenue', value: 4800000 },
  { month: 'Apr', category: 'Revenue', value: 5100000 },
  { month: 'May', category: 'Revenue', value: 5420000 },
  { month: 'Jan', category: 'Expenses', value: 2100000 },
  { month: 'Feb', category: 'Expenses', value: 2300000 },
  { month: 'Mar', category: 'Expenses', value: 2400000 },
  { month: 'Apr', category: 'Expenses', value: 2600000 },
  { month: 'May', category: 'Expenses', value: 2820000 },
  { month: 'Jan', category: 'Profit', value: 2100000 },
  { month: 'Feb', category: 'Profit', value: 2200000 },
  { month: 'Mar', category: 'Profit', value: 2400000 },
  { month: 'Apr', category: 'Profit', value: 2500000 },
  { month: 'May', category: 'Profit', value: 2600000 }
];

const FinanceDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(mockChartData);
  const [statsData, setStatsData] = useState(mockRevenueStats);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // In a real application, you would fetch data based on the selected date range
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        // Here you would update with real data from your API
      }, 1000);
    }
  };
  
  return (
    <div className="finance-dashboard">
      <PageHeader
        title="Financial Dashboard"
        subTitle="Overview of company finances"
        extra={[
          <DatePicker.RangePicker 
            key="date-picker" 
            onChange={handleDateRangeChange} 
          />
        ]}
      />
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <RevenueStats stats={statsData} isLoading={loading} />
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <RevenueChart data={revenueData} isLoading={loading} />
        </Col>
      </Row>
    </div>
  );
};

export default FinanceDashboard; 