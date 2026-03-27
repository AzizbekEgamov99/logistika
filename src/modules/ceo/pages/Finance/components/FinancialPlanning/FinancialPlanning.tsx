import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  InputNumber, 
  Table, 
  Space, 
  Statistic, 
  Divider,
  Tooltip,
  Alert
} from 'antd';
import {
  DollarOutlined,
  LineChartOutlined, 
  BarChartOutlined,
  PlusOutlined, 
  SaveOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import moment from 'moment';
import { useCurrencies } from '../../../../../accounting/hooks/useCurrencies';
import { financeApi } from '../../../../api/finance/financeApi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ForecastItem {
  id: string;
  name: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  frequency: 'once' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface ProjectionData {
  month: string;
  income: number;
  expense: number;
  profit: number;
  cumulative: number;
}

const FinancialPlanning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('forecasting');
  const [forecastItems, setForecastItems] = useState<ForecastItem[]>([]);
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);
  const [projectionPeriod, setProjectionPeriod] = useState<number>(12); // months
  const [loading, setLoading] = useState<boolean>(false);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const { currencies } = useCurrencies();
  const [form] = Form.useForm();
  
  // For Forecast reports
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf('month'),
    moment().add(projectionPeriod, 'months')
  ]);
  
  // Sample forecast items for initial state
  const sampleForecastItems: ForecastItem[] = [
    {
      id: '1',
      name: 'Standard Trucking Contracts',
      category: 'Services',
      type: 'income',
      amount: 25000,
      frequency: 'monthly',
      startDate: moment().format('YYYY-MM-DD'),
      notes: 'Based on typical monthly contracts'
    },
    {
      id: '2',
      name: 'Vehicle Maintenance',
      category: 'Maintenance',
      type: 'expense',
      amount: 8000,
      frequency: 'monthly',
      startDate: moment().format('YYYY-MM-DD'),
      notes: 'Regular fleet maintenance expenses'
    },
    {
      id: '3',
      name: 'New Truck Purchase',
      category: 'Capital',
      type: 'expense',
      amount: 75000,
      frequency: 'once',
      startDate: moment().add(3, 'months').format('YYYY-MM-DD'),
      notes: 'Planned purchase of new truck'
    },
    {
      id: '4',
      name: 'Fuel',
      category: 'Operations',
      type: 'expense',
      amount: 12000,
      frequency: 'monthly',
      startDate: moment().format('YYYY-MM-DD'),
      notes: 'Monthly fuel costs for fleet'
    },
    {
      id: '5',
      name: 'Seasonal Contract Increase',
      category: 'Services',
      type: 'income',
      amount: 15000,
      frequency: 'quarterly',
      startDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      notes: 'Quarterly revenue spike from seasonal contracts'
    }
  ];
  
  useEffect(() => {
    // Initialize with sample data
    setForecastItems(sampleForecastItems);
    
    // Load historical financial data
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const endDate = moment().format('YYYY-MM-DD');
        const startDate = moment().subtract(12, 'months').format('YYYY-MM-DD');
        
        const stats = await financeApi.getFinancialStatistics({
          startDate,
          endDate
        });
        
        if (stats.income_by_period && stats.expenses_by_period) {
          const combinedData = stats.income_by_period.map((item: any) => {
            const matchingExpense = stats.expenses_by_period.find(
              (exp: any) => exp.period === item.period
            );
            
            return {
              month: item.period,
              income: item.value || 0,
              expense: matchingExpense?.value || 0,
              profit: (item.value || 0) - (matchingExpense?.value || 0)
            };
          });
          
          setHistoricalData(combinedData);
        }
      } catch (error) {
        console.error('Error fetching historical financial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, []);
  
  useEffect(() => {
    generateProjection();
  }, [forecastItems, projectionPeriod, dateRange]);
  
  const generateProjection = () => {
    const startMonth = dateRange[0];
    const months = projectionPeriod;
    
    const projection: ProjectionData[] = [];
    let cumulativeProfit = 0;
    
    for (let i = 0; i < months; i++) {
      const currentMonth = moment(startMonth).add(i, 'months');
      const monthKey = currentMonth.format('YYYY-MM');
      const monthLabel = currentMonth.format('MMM YYYY');
      
      const monthData: ProjectionData = {
        month: monthLabel,
        income: 0,
        expense: 0,
        profit: 0,
        cumulative: 0
      };
      
      // Calculate all incomes and expenses for this month
      forecastItems.forEach(item => {
        const itemStartDate = moment(item.startDate);
        const itemEndDate = item.endDate ? moment(item.endDate) : moment().add(100, 'years'); // Far future if no end date
        
        if (currentMonth.isBetween(itemStartDate, itemEndDate, 'month', '[]')) {
          // Item is active in this month
          
          if (item.frequency === 'once') {
            // One-time item only counts in its start month
            if (currentMonth.format('YYYY-MM') === itemStartDate.format('YYYY-MM')) {
              if (item.type === 'income') {
                monthData.income += item.amount;
              } else {
                monthData.expense += item.amount;
              }
            }
          } else if (item.frequency === 'monthly') {
            // Monthly items count every month
            if (item.type === 'income') {
              monthData.income += item.amount;
            } else {
              monthData.expense += item.amount;
            }
          } else if (item.frequency === 'quarterly') {
            // Quarterly items count every 3 months
            const monthDiff = currentMonth.diff(itemStartDate, 'months');
            if (monthDiff % 3 === 0) {
              if (item.type === 'income') {
                monthData.income += item.amount;
              } else {
                monthData.expense += item.amount;
              }
            }
          } else if (item.frequency === 'yearly') {
            // Yearly items count every 12 months
            const monthDiff = currentMonth.diff(itemStartDate, 'months');
            if (monthDiff % 12 === 0) {
              if (item.type === 'income') {
                monthData.income += item.amount;
              } else {
                monthData.expense += item.amount;
              }
            }
          }
        }
      });
      
      // Calculate monthly profit
      monthData.profit = monthData.income - monthData.expense;
      
      // Update cumulative profit
      cumulativeProfit += monthData.profit;
      monthData.cumulative = cumulativeProfit;
      
      projection.push(monthData);
    }
    
    setProjectionData(projection);
  };
  
  const handleAddForecastItem = (values: any) => {
    const newItem: ForecastItem = {
      id: `item-${Date.now()}`,
      name: values.name,
      category: values.category,
      type: values.type,
      amount: values.amount,
      frequency: values.frequency,
      startDate: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      endDate: values.dateRange && values.dateRange[1] ? values.dateRange[1].format('YYYY-MM-DD') : undefined,
      notes: values.notes
    };
    
    setForecastItems([...forecastItems, newItem]);
    form.resetFields();
  };
  
  const handleDeleteForecastItem = (id: string) => {
    setForecastItems(forecastItems.filter(item => item.id !== id));
  };
  
  const handleProjectionPeriodChange = (value: number) => {
    setProjectionPeriod(value);
    setDateRange([
      dateRange[0],
      moment(dateRange[0]).add(value, 'months')
    ]);
  };
  
  const handleSaveProjection = () => {
    // Here you would typically save to backend
    // For now, just show a success message
    alert('Forecast saved successfully!');
  };
  
  const handleExportReport = () => {
    // Here you would typically export to CSV/PDF
    // For now, just show a success message
    alert('Exported successfully!');
  };
  
  // Calculate forecast summary
  const forecastSummary = projectionData.reduce(
    (summary, month) => {
      summary.totalIncome += month.income;
      summary.totalExpense += month.expense;
      summary.totalProfit += month.profit;
      return summary;
    },
    { totalIncome: 0, totalExpense: 0, totalProfit: 0 }
  );
  
  // Chart configurations
  const cashFlowConfig = {
    data: projectionData,
    xField: 'month',
    yField: 'profit',
    seriesField: 'type',
    yAxis: {
      title: {
        text: 'Amount (USD)',
      },
    },
    color: '#1890ff',
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
    title: {
      text: 'Monthly Cash Flow Projection',
      style: {
        fontSize: 14,
      },
    },
  };
  
  const incomeExpenseConfig = {
    data: projectionData,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      title: {
        text: 'Amount (USD)',
      },
    },
    color: ['#52c41a', '#f5222d'],
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'middle',
    },
  };
  
  // Transform data for the grouped column chart
  const columnChartData = projectionData.flatMap(item => [
    { month: item.month, value: item.income, type: 'Income' },
    { month: item.month, value: item.expense, type: 'Expense' }
  ]);
  
  const forecastColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color={text === 'income' ? 'green' : 'red'}>{text === 'income' ? 'Income' : 'Expense'}</Tag>,
    },
    {
      title: 'Amount (USD)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: ForecastItem) => (
        <Text style={{ color: record.type === 'income' ? '#52c41a' : '#f5222d' }}>
          ${text.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text: string) => {
        switch (text) {
          case 'once': return 'One-time';
          case 'monthly': return 'Monthly';
          case 'quarterly': return 'Quarterly';
          case 'yearly': return 'Yearly';
          default: return text;
        }
      }
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text: string) => moment(text).format('DD MMM YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text?: string) => text ? moment(text).format('DD MMM YYYY') : 'Ongoing',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ForecastItem) => (
        <Button type="text" danger onClick={() => handleDeleteForecastItem(record.id)}>
          Delete
        </Button>
      ),
    },
  ];
  
  const projectionColumns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
      render: (text: number) => <Text style={{ color: '#52c41a' }}>${text.toLocaleString()}</Text>,
    },
    {
      title: 'Expense',
      dataIndex: 'expense',
      key: 'expense',
      render: (text: number) => <Text style={{ color: '#f5222d' }}>${text.toLocaleString()}</Text>,
    },
    {
      title: 'Monthly Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: (text: number) => (
        <Text style={{ color: text >= 0 ? '#52c41a' : '#f5222d' }}>
          ${text.toLocaleString()}
          {text >= 0 ? <ArrowUpOutlined style={{ marginLeft: 5 }} /> : <ArrowDownOutlined style={{ marginLeft: 5 }} />}
        </Text>
      ),
    },
    {
      title: 'Cumulative Profit',
      dataIndex: 'cumulative',
      key: 'cumulative',
      render: (text: number) => (
        <Text strong style={{ color: text >= 0 ? '#52c41a' : '#f5222d' }}>
          ${text.toLocaleString()}
        </Text>
      ),
    },
  ];
  
  return (
    <div className="financial-planning">
      <Card>
        <div className="financial-planning-header">
          <Title level={4}>
            <LineChartOutlined /> Financial Planning and Forecasting
          </Title>
          <Space>
            <Select 
              value={projectionPeriod} 
              onChange={handleProjectionPeriodChange}
              style={{ width: 140 }}
            >
              <Option value={3}>3 months</Option>
              <Option value={6}>6 months</Option>
              <Option value={12}>12 months</Option>
              <Option value={24}>24 months</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSaveProjection}
            >
              Save Forecast
            </Button>
            <Button 
              icon={<ExportOutlined />} 
              onClick={handleExportReport}
            >
              Export Report
            </Button>
          </Space>
        </div>
        
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Forecast Items" key="forecasting">
            <div className="forecast-inputs">
              <Alert
                message="Financial Forecasting Tool"
                description="Add your expected income and expense items to create financial projections. Each item can be one-time, monthly, quarterly, or yearly."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <Card title="Add Forecast Item" size="small" style={{ marginBottom: 16 }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleAddForecastItem}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter a name' }]}
                      >
                        <Input placeholder="e.g., Fleet Revenue" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                      >
                        <Select placeholder="Select category">
                          <Option value="Services">Services</Option>
                          <Option value="Operations">Operations</Option>
                          <Option value="Maintenance">Maintenance</Option>
                          <Option value="Payroll">Payroll</Option>
                          <Option value="Capital">Capital Expenditure</Option>
                          <Option value="Taxes">Taxes</Option>
                          <Option value="Other">Other</Option>
                        </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select a type' }]}
                      >
                        <Select placeholder="Select type">
                          <Option value="income">Income</Option>
                          <Option value="expense">Expense</Option>
                          </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="amount"
                        label="Amount (USD)"
                        rules={[{ required: true, message: 'Please enter an amount' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          precision={2}
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="frequency"
                        label="Frequency"
                        rules={[{ required: true, message: 'Please select a frequency' }]}
                      >
                        <Select placeholder="Select frequency">
                          <Option value="once">One-time</Option>
                          <Option value="monthly">Monthly</Option>
                          <Option value="quarterly">Quarterly</Option>
                          <Option value="yearly">Yearly</Option>
                        </Select>
                        </Form.Item>
                  </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="dateRange"
                        label="Date Range"
                        rules={[{ required: true, message: 'Please select date range' }]}
                      >
                        <RangePicker 
                          style={{ width: '100%' }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                        </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item
                        name="notes"
                        label="Notes"
                      >
                        <Input.TextArea rows={1} placeholder="Optional notes" />
                      </Form.Item>
                        </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label=" " colon={false}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<PlusOutlined />}
                          style={{ marginTop: 4 }}
                        >
                          Add Item
                        </Button>
                      </Form.Item>
                        </Col>
                      </Row>
                </Form>
                    </Card>
                  
              <div className="forecast-items">
                      <Table 
                  dataSource={forecastItems}
                        columns={forecastColumns} 
                  rowKey="id"
                        pagination={false}
                        size="small"
                  bordered
                />
              </div>
            </div>
              </TabPane>
              
          <TabPane tab="Projections" key="projections">
            <div className="financial-projections">
                <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card>
                    <Statistic
                      title="Projected Total Income"
                      value={forecastSummary.totalIncome}
                      precision={0}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<DollarOutlined />}
                      suffix="USD"
                    />
                    </Card>
                  </Col>
                <Col xs={24} md={8}>
                  <Card>
                          <Statistic
                      title="Projected Total Expenses"
                      value={forecastSummary.totalExpense}
                            precision={0}
                      valueStyle={{ color: '#f5222d' }}
                      prefix={<DollarOutlined />}
                      suffix="USD"
                          />
                  </Card>
                        </Col>
                <Col xs={24} md={8}>
                  <Card>
                          <Statistic
                      title="Projected Net Profit"
                      value={forecastSummary.totalProfit}
                            precision={0}
                      valueStyle={{ 
                        color: forecastSummary.totalProfit >= 0 ? '#52c41a' : '#f5222d' 
                      }}
                      prefix={<DollarOutlined />}
                      suffix="USD"
                    />
                    <div style={{ marginTop: 8 }}>
                      {forecastSummary.totalIncome > 0 && (
                        <Tooltip title="Profit Margin">
                          <Text type="secondary">
                            Margin: {((forecastSummary.totalProfit / forecastSummary.totalIncome) * 100).toFixed(1)}%
                          </Text>
                        </Tooltip>
                      )}
                      </div>
                    </Card>
                  </Col>
                </Row>
              
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                  <Card title="Monthly Profit Projection">
                    <div style={{ height: 300 }}>
                      <Line {...cashFlowConfig} data={projectionData} />
                              </div>
                    </Card>
                  </Col>
                <Col xs={24} lg={12}>
                  <Card title="Income vs. Expenses">
                    <div style={{ height: 300 }}>
                      <Column {...incomeExpenseConfig} data={columnChartData} />
                    </div>
                          </Card>
                        </Col>
              </Row>
              
              <Card style={{ marginTop: 16 }}>
                <Table
                  dataSource={projectionData}
                  columns={projectionColumns}
                  rowKey="month"
                  pagination={false}
                  size="small"
                  bordered
                  scroll={{ x: 'max-content' }}
                />
                          </Card>
            </div>
          </TabPane>
          
          <TabPane tab="Historical Analysis" key="historical">
            <div className="historical-analysis">
              <Alert
                message="Historical Performance"
                description="This section shows actual financial performance from the past 12 months for comparison with projections."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              {historicalData.length > 0 ? (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Card title="Historical vs Projected Performance">
                        <div style={{ height: 300 }}>
                          <Line 
                            data={[
                              ...historicalData.map(item => ({
                                ...item,
                                type: 'Historical'
                              })),
                              ...projectionData.slice(0, 6).map(item => ({
                                ...item,
                                type: 'Projected'
                              }))
                            ]}
                            xField="month"
                            yField="profit"
                            seriesField="type"
                            color={['#722ed1', '#1890ff']}
                            point={{
                              size: 5,
                              shape: 'diamond',
                            }}
                          />
                        </div>
                          </Card>
                        </Col>
                      </Row>
                  
                  <Card style={{ marginTop: 16 }}>
                    <Table
                      dataSource={historicalData}
                      columns={[
                        {
                          title: 'Month',
                          dataIndex: 'month',
                          key: 'month',
                        },
                        {
                          title: 'Income',
                          dataIndex: 'income',
                          key: 'income',
                          render: (text: number) => <Text style={{ color: '#52c41a' }}>${text.toLocaleString()}</Text>,
                        },
                        {
                          title: 'Expense',
                          dataIndex: 'expense',
                          key: 'expense',
                          render: (text: number) => <Text style={{ color: '#f5222d' }}>${text.toLocaleString()}</Text>,
                        },
                        {
                          title: 'Profit',
                          dataIndex: 'profit',
                          key: 'profit',
                          render: (text: number) => (
                            <Text style={{ color: text >= 0 ? '#52c41a' : '#f5222d' }}>
                              ${text.toLocaleString()}
                            </Text>
                          ),
                        }
                      ]}
                      rowKey="month"
                      pagination={false}
                      size="small"
                      bordered
                    />
                    </Card>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16 }}>Loading historical data...</div>
                </div>
              )}
            </div>
              </TabPane>
            </Tabs>
          </Card>
      
      <style jsx global>{`
        .financial-planning-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .forecast-inputs {
          margin-bottom: 24px;
        }
        
        .financial-projections {
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default FinancialPlanning; 