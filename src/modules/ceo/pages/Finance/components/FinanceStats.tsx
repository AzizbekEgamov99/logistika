import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Select, Badge, Tooltip, Space, Divider } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { financeApi } from '../../../../api/finance/financeApi';
import { useCurrencies } from '../../../../../accounting/hooks/useCurrencies';

const { Title, Text } = Typography;
const { Option } = Select;

interface FinanceStatsProps {
  dateRange?: [string, string];
  refresh?: number;
}

const FinanceStats: React.FC<FinanceStatsProps> = ({ dateRange, refresh }) => {
  const [period, setPeriod] = useState<string>('month');
  const [stats, setStats] = useState<any>({
    currentPeriod: {
      revenue: 0,
      expenses: 0,
      profit: 0,
      avgTransactionValue: 0,
      transactionsCount: 0
    },
    previousPeriod: {
      revenue: 0,
      expenses: 0,
      profit: 0,
      avgTransactionValue: 0,
      transactionsCount: 0
    },
    trends: {
      revenue: 0,
      expenses: 0,
      profit: 0,
      avgTransactionValue: 0,
      transactionsCount: 0
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const { currencies, loading: currenciesLoading } = useCurrencies();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const endDate = dateRange && dateRange[1] ? new Date(dateRange[1]) : now;
        let startDate: Date;
        let previousStartDate: Date;
        let previousEndDate: Date;
        if (period === 'month') {
          startDate = dateRange && dateRange[0] 
            ? new Date(dateRange[0]) 
            : new Date(now.getFullYear(), now.getMonth(), 1);
          
          const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          endDate.getMonth() - startDate.getMonth();
          
          previousStartDate = new Date(startDate);
          previousStartDate.setMonth(previousStartDate.getMonth() - monthDiff);
          
          previousEndDate = new Date(endDate);
          previousEndDate.setMonth(previousEndDate.getMonth() - monthDiff);
        } else if (period === 'quarter') {
          const currentQuarter = Math.floor(now.getMonth() / 3);
          startDate = dateRange && dateRange[0]
            ? new Date(dateRange[0])
            : new Date(now.getFullYear(), currentQuarter * 3, 1);
          
          previousStartDate = new Date(startDate);
          previousStartDate.setMonth(previousStartDate.getMonth() - 3);
          
          previousEndDate = new Date(endDate);
          previousEndDate.setMonth(previousEndDate.getMonth() - 3);
        } else { // year
          startDate = dateRange && dateRange[0]
            ? new Date(dateRange[0])
            : new Date(now.getFullYear(), 0, 1);
          
          previousStartDate = new Date(startDate);
          previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
          
          previousEndDate = new Date(endDate);
          previousEndDate.setFullYear(previousEndDate.getFullYear() - 1);
        }

        // Format dates for API
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        
        // Fetch current period stats
        const currentStats = await financeApi.getFinancialStatistics({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          currency: selectedCurrency
        });
        
        // Fetch previous period stats
        const previousStats = await financeApi.getFinancialStatistics({
          startDate: formatDate(previousStartDate),
          endDate: formatDate(previousEndDate),
          currency: selectedCurrency
        });
        
        // Get transaction counts
        const currentTransactions = await financeApi.getAllTransactions({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          pageSize: 1,
          currency: selectedCurrency
        });
        
        const previousTransactions = await financeApi.getAllTransactions({
          startDate: formatDate(previousStartDate),
          endDate: formatDate(previousEndDate),
          pageSize: 1,
          currency: selectedCurrency
        });

        // Calculate current period values
        const currentPeriod = {
          revenue: currentStats.total_income || 0,
          expenses: currentStats.total_expenses || 0,
          profit: currentStats.net_profit || 0,
          avgTransactionValue: currentTransactions.total > 0 
            ? (currentStats.total_income || 0) / currentTransactions.total 
            : 0,
          transactionsCount: currentTransactions.total || 0
        };

        // Calculate previous period values
        const previousPeriod = {
          revenue: previousStats.total_income || 0,
          expenses: previousStats.total_expenses || 0,
          profit: previousStats.net_profit || 0,
          avgTransactionValue: previousTransactions.total > 0 
            ? (previousStats.total_income || 0) / previousTransactions.total 
            : 0,
          transactionsCount: previousTransactions.total || 0
        };

        // Calculate trend percentages
        const calculateTrend = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };

        const trends = {
          revenue: calculateTrend(currentPeriod.revenue, previousPeriod.revenue),
          expenses: calculateTrend(currentPeriod.expenses, previousPeriod.expenses),
          profit: calculateTrend(currentPeriod.profit, previousPeriod.profit),
          avgTransactionValue: calculateTrend(currentPeriod.avgTransactionValue, previousPeriod.avgTransactionValue),
          transactionsCount: calculateTrend(currentPeriod.transactionsCount, previousPeriod.transactionsCount)
        };

        setStats({
          currentPeriod,
          previousPeriod,
          trends
        });
      } catch (error) {
        console.error('Error fetching finance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange, period, refresh, selectedCurrency]);

  const renderTrendIndicator = (value: number) => {
    if (value === 0) return null;
    
    const isPositive = value > 0;
    const color = isPositive ? '#52c41a' : '#f5222d';
    // For expenses, negative trend is actually good
    const isGood = (s: string) => s === 'expenses' ? !isPositive : isPositive;
    
    return (
      <span style={{ color }}>
        {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'RUB': return '₽';
      case 'EUR': return '€';
      case 'UZS': return 'so\'m';
      default: return currencyCode;
    }
  };

  const renderStatCard = (title: string, value: number, trend: number, prefix?: React.ReactNode, suffix?: string, precision?: number) => (
    <Card className="stat-card" loading={loading}>
      <Statistic
        title={title}
        value={value}
        precision={precision || 0}
        prefix={prefix || <DollarOutlined />}
        suffix={suffix || getCurrencySymbol(selectedCurrency)}
        valueStyle={{ color: trend > 0 ? '#3f8600' : (trend < 0 ? '#cf1322' : 'inherit') }}
      />
      <div className="trend-value">
        {renderTrendIndicator(trend)}
        <Tooltip title={`Previous ${period}: ${stats.previousPeriod[title.toLowerCase().replace(/\s/g, '')] || 0} ${getCurrencySymbol(selectedCurrency)}`}>
          <span className="compare-text">vs previous {period}</span>
        </Tooltip>
      </div>
    </Card>
  );

  // Ensure we always have at least default currencies available if no currencies are loaded
  const availableCurrencies = currencies && currencies.length > 0 
    ? currencies 
    : [
        { id: 1, currency: 'USD', rate_to_uzs: '1' },
        { id: 2, currency: 'UZS', rate_to_uzs: '1' },
        { id: 3, currency: 'EUR', rate_to_uzs: '1' },
        { id: 4, currency: 'RUB', rate_to_uzs: '1' }
      ];

  return (
    <div className="finance-stats">
      <div className="finance-stats-header">
        <Title level={4}>
          <BarChartOutlined /> Moliyaviy ko'rsatkichlar
        </Title>
        <Space>
          <Select 
            value={period} 
            onChange={setPeriod}
            style={{ width: 120 }}
          >
            <Option value="month">Oylik</Option>
            <Option value="quarter">Choraklik</Option>
            <Option value="year">Yillik</Option>
          </Select>
          <Select
            value={selectedCurrency}
            onChange={setSelectedCurrency}
            loading={currenciesLoading}
            style={{ width: 120 }}
          >
            {availableCurrencies.map(currency => (
              <Option key={currency.id} value={currency.currency}>
                {currency.currency} {getCurrencySymbol(currency.currency)}
              </Option>
            ))}
          </Select>
        </Space>
      </div>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          {renderStatCard('Daromad', stats.currentPeriod.revenue, stats.trends.revenue, <DollarOutlined />)}
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          {renderStatCard('Xarajatlar', stats.currentPeriod.expenses, stats.trends.expenses, <DollarOutlined />)}
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          {renderStatCard('Foyda', stats.currentPeriod.profit, stats.trends.profit, <DollarOutlined />)}
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          {renderStatCard('Tranzaksiyalar', stats.currentPeriod.transactionsCount, stats.trends.transactionsCount, <BarChartOutlined />, 'ta', 0)}
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card loading={loading}>
            <Statistic
              title="Rentabellik"
              value={stats.currentPeriod.revenue > 0 ? (stats.currentPeriod.profit / stats.currentPeriod.revenue) * 100 : 0}
              precision={2}
              valueStyle={{ color: stats.trends.profit > 0 ? '#3f8600' : '#cf1322' }}
              suffix="%"
            />
            <div className="trend-value">
              {renderTrendIndicator(stats.trends.profit)}
              <Space>
                <Badge status={stats.currentPeriod.profit > 0 ? "success" : "error"} />
                <span>{stats.currentPeriod.profit > 0 ? "Foydali" : "Zararda"}</span>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      
      <style jsx global>{`
        .finance-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .stat-card {
          height: 100%;
        }
        
        .trend-value {
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .compare-text {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default FinanceStats; 