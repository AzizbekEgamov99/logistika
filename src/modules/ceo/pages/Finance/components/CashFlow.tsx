import React, { useMemo } from 'react';
import { Row, Col, Empty, Spin, Tabs, Select } from 'antd';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import { useCurrencies } from '../../../../accounting/hooks/useCurrencies';

const { Option } = Select;
const { TabPane } = Tabs;

interface Transaction {
  id: number;
  amount: number;
  type: string;
  currency: string;
  created_at: string;
  [key: string]: unknown;
}

interface ChartItem {
  date: string;
  income: number;
  expense: number;
  balance?: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
  category: string;
}

interface CashFlowProps {
  transactions: Transaction[];
  loading?: boolean;
}

const CashFlow: React.FC<CashFlowProps> = ({ transactions = [], loading = false }) => {
  const [timeRange, setTimeRange] = React.useState<string>('month');
  const [currency, setCurrency] = React.useState<string>('USD');
  const { currencies, loading: currenciesLoading } = useCurrencies();

  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'RUB': return '₽';
      case 'EUR': return '€';
      case 'UZS': return 'so\'m';
      default: return currencyCode;
    }
  };

  // Process data for cash flow chart
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Group by date based on timeRange
    const groupedData: Record<string, ChartItem> = {};

    const formatDateByRange = (date: Date) => {
      switch (timeRange) {
        case 'week':
          return moment(date).format('ddd, DD');
        case 'month':
          return moment(date).format('DD-MMM');
        case 'year':
          return moment(date).format('MMM-YYYY');
        default:
          return moment(date).format('DD-MMM-YYYY');
      }
    };

    // Initialize with 0 values for all days in range
    const startDate = moment(sortedTransactions[0].created_at);
    const endDate = moment(sortedTransactions[sortedTransactions.length - 1].created_at);
    
    // Fill in days between start and end
    const currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      const dateKey = formatDateByRange(currentDate.toDate());
      groupedData[dateKey] = {
        date: dateKey,
        income: 0,
        expense: 0,
      };
      
      if (timeRange === 'week') {
        currentDate.add(1, 'day');
      } else if (timeRange === 'month') {
        currentDate.add(1, 'day');
      } else if (timeRange === 'year') {
        currentDate.add(1, 'month');
      } else {
        currentDate.add(1, 'day');
      }
    }

    // Fill with actual transaction data
    sortedTransactions.forEach(transaction => {
      const dateKey = formatDateByRange(new Date(transaction.created_at));
      
      // Skip transactions in other currencies if filtering
      if (currency !== 'ALL' && transaction.currency !== currency) {
        return;
      }
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
        };
      }

      const amount = transaction.amount || 0;
      
      if (transaction.type === 'income') {
        groupedData[dateKey].income += amount;
      } else if (transaction.type === 'expense' || transaction.type === 'debt') {
        groupedData[dateKey].expense += amount;
      }
    });

    // Convert to array and calculate balance
    const result = Object.values(groupedData).map((item, index, array) => {
      const previousBalance = index > 0 
        ? array[index - 1].income - array[index - 1].expense + (array[index - 1].balance || 0)
        : 0;
      
      return {
        ...item,
        balance: previousBalance + item.income - item.expense
      };
    });

    return result;
  }, [transactions, timeRange, currency]);

  // Transform data for line chart
  const lineData = useMemo(() => {
    if (!chartData.length) return [];

    const result: ChartDataPoint[] = [];
    
    // Add income data
    chartData.forEach(item => {
      result.push({
        date: item.date,
        value: item.income,
        category: 'Kirim',
      });
    });
    
    // Add expense data
    chartData.forEach(item => {
      result.push({
        date: item.date,
        value: item.expense,
        category: 'Chiqim',
      });
    });
    
    // Add balance data
    chartData.forEach(item => {
      result.push({
        date: item.date,
        value: item.balance || 0,
        category: 'Balans',
      });
    });
    
    return result;
  }, [chartData]);
  
  // Calculate total income, expense and balance
  const totals = useMemo(() => {
    if (!transactions.length) return { income: 0, expense: 0, balance: 0 };
    
    const filteredTransactions = currency === 'ALL' 
      ? transactions 
      : transactions.filter(t => t.currency === currency);
    
    return filteredTransactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.income += curr.amount || 0;
        } else if (curr.type === 'expense' || curr.type === 'debt') {
          acc.expense += curr.amount || 0;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions, currency]);
  
  // Update totals balance
  totals.balance = totals.income - totals.expense;

  // Ensure we always have at least USD available if no currencies are loaded
  const availableCurrencies = currencies.length > 0 
    ? currencies 
    : [{ id: 0, currency: 'USD', rate_to_uzs: '1' }];

  if (loading || currenciesLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!transactions.length) {
    return <Empty description="Ma'lumotlar mavjud emas" />;
  }

  const config = {
    data: lineData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      title: {
        text: `Miqdor (${currency})`,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#52c41a', '#f5222d', '#1890ff'],
    point: {
      size: 4,
      style: {
        lineWidth: 2,
      },
    },
  };

  return (
    <div className="cash-flow">
      <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Select
            value={timeRange}
            onChange={value => setTimeRange(value)}
            style={{ width: 120, marginRight: 16 }}
          >
            <Option value="week">Haftalik</Option>
            <Option value="month">Oylik</Option>
            <Option value="year">Yillik</Option>
          </Select>
          
          <Select
            value={currency}
            onChange={value => setCurrency(value)}
            style={{ width: 120 }}
            loading={currenciesLoading}
          >
            <Option value="ALL">Barcha</Option>
            {availableCurrencies.map(curr => (
              <Option key={curr.id} value={curr.currency}>
                {curr.currency}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <span style={{ marginRight: 8, color: '#52c41a', fontWeight: 'bold' }}>Kirim:</span>
              <span>{totals.income.toLocaleString()} {getCurrencySymbol(currency)}</span>
            </div>
            <div>
              <span style={{ marginRight: 8, color: '#f5222d', fontWeight: 'bold' }}>Chiqim:</span>
              <span>{totals.expense.toLocaleString()} {getCurrencySymbol(currency)}</span>
            </div>
            <div>
              <span style={{ marginRight: 8, color: '#1890ff', fontWeight: 'bold' }}>Balans:</span>
              <span style={{ color: totals.balance >= 0 ? '#52c41a' : '#f5222d' }}>
                {totals.balance.toLocaleString()} {getCurrencySymbol(currency)}
              </span>
            </div>
          </div>
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="line">
        <TabPane tab="Chiziqli grafik" key="line">
          <div style={{ height: 350 }}>
            {chartData.length > 0 ? (
              <Line {...config} />
            ) : (
              <Empty description="Ushbu valyuta uchun ma'lumotlar mavjud emas" />
            )}
          </div>
        </TabPane>
        <TabPane tab="Oylik tahlil" key="monthly">
          <div style={{ height: 350 }}>
            {chartData.length > 0 ? (
              <Line 
                {...config}
                data={lineData.filter(d => d.category !== 'Balans')}
                isStack={true}
              />
            ) : (
              <Empty description="Ushbu valyuta uchun ma'lumotlar mavjud emas" />
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CashFlow; 