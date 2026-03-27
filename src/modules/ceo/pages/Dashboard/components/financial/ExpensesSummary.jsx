import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { formatCurrency } from '../../utils/formatters';

const { Title } = Typography;

const ExpensesSummary = ({ expenses, isLoading }) => {
  return (
    <Card variant="borderless" className="kpi-card">
      <div className="section-header">
        <Title level={5}>Xarajatlar (USD)</Title>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic 
            title="Service Xarajatlar" 
            value={formatCurrency(expenses?.dp_price_usd || 0)} 
            loading={isLoading}
            prefix="$"
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col span={12}>
          <Statistic 
            title="Oyliklar" 
            value={formatCurrency(expenses?.salaries_usd || 0)} 
            loading={isLoading}
            prefix="$"
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ExpensesSummary; 