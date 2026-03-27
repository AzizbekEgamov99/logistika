import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, PercentageOutlined, WalletOutlined } from '@ant-design/icons';
import { FinancialSummary as FinancialSummaryType } from '../../mockData';

const { Title, Text } = Typography;

interface FinancialSummaryProps {
  summary: FinancialSummaryType;
}

// Format currency with fixed options to prevent hydration errors
const formatCurrency = (value: number): string => {
  // Use fixed options without relying on user's locale
  return "$" + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

// Format date period with fixed format to prevent hydration errors
const formatPeriod = (summary: FinancialSummaryType): string => {
  const { period, startDate, endDate } = summary;
  
  // Use fixed date format
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const startMonth = months[startDate.getMonth()];
  const startDay = startDate.getDate();
  
  const endMonth = months[endDate.getMonth()];
  const endDay = endDate.getDate();
  const endYear = endDate.getFullYear();
  
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
};

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const { 
    totalRevenue, 
    totalExpenses, 
    netProfit, 
    profitMargin,
    outstandingPayments
  } = summary;
  
  return (
    <Card>
      <Title level={5}>Moliyaviy Ko'rsatkichlar ({formatPeriod(summary)})</Title>
      <Divider />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="summary-card">
            <Statistic
              title="Umumiy Daromad"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Progress 
              percent={100} 
              showInfo={false} 
              status="success" 
              strokeColor="#3f8600" 
              trailColor="#f0f0f0"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="summary-card">
            <Statistic
              title="Umumiy Xarajatlar"
              value={totalExpenses}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Progress 
              percent={(totalExpenses / totalRevenue) * 100} 
              showInfo={false} 
              status="exception" 
              strokeColor="#cf1322" 
              trailColor="#f0f0f0"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="summary-card">
            <Statistic
              title="Sof Foyda"
              value={netProfit}
              precision={2}
              valueStyle={{ color: netProfit >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={netProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Progress 
              percent={(netProfit / totalRevenue) * 100} 
              showInfo={false} 
              status={netProfit >= 0 ? "success" : "exception"}
              strokeColor={netProfit >= 0 ? "#3f8600" : "#cf1322"}
              trailColor="#f0f0f0"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="summary-card">
            <Statistic
              title="foyda (%)"
              value={profitMargin}
              precision={1}
              valueStyle={{ color: profitMargin >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={<PercentageOutlined />}
              suffix="%"
            />
            <Progress 
              percent={profitMargin} 
              showInfo={false} 
              status={profitMargin >= 0 ? "success" : "exception"}
              strokeColor={profitMargin >= 0 ? "#3f8600" : "#cf1322"}
              trailColor="#f0f0f0"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="summary-card">
            <Statistic
              title="Qarz Miqdori"
              value={outstandingPayments}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix={<WalletOutlined />}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Progress 
              percent={(outstandingPayments / totalRevenue) * 100} 
              showInfo={false} 
              status="normal" 
              strokeColor="#faad14" 
              trailColor="#f0f0f0"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="summary-card">
            <Statistic
              title="Joriy Balans"
              value={totalRevenue - totalExpenses - outstandingPayments}
              precision={2}
              valueStyle={{ 
                color: (totalRevenue - totalExpenses - outstandingPayments) >= 0 ? '#1890ff' : '#cf1322' 
              }}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Progress 
              percent={100} 
              showInfo={false} 
              status="active" 
              strokeColor="#1890ff" 
              trailColor="#f0f0f0"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default FinancialSummary; 