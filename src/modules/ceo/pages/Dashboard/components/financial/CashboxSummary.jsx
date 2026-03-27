import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { formatCurrency } from '../../utils/formatters';

const { Title } = Typography;

const CashboxSummary = ({ cashbox, isLoading }) => {
  return (
    <Card variant="borderless" className="kpi-card">
      <div className="section-header">
        <Title level={5}>Kassa (USD)</Title>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="USD"
            value={formatCurrency(cashbox?.USD || 0)}
            loading={isLoading}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="RUB"
            value={formatCurrency(cashbox?.RUB || 0)}
            loading={isLoading}
            prefix="₽"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="UZS"
            value={formatCurrency(cashbox?.UZS || 0)}
            loading={isLoading}
            prefix="₹"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="EUR"
            value={formatCurrency(cashbox?.EUR || 0)}
            loading={isLoading}
            prefix="€"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="KZT"
            value={formatCurrency(cashbox?.KZT || 0)}
            loading={isLoading}
            prefix="₸"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CashboxSummary; 