import React from 'react';
import { Row, Col, Card } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

interface CashOverview {
  cashbox?: {
    total_in_usd?: number;
  };
  expenses?: {
    total_expenses_usd?: number;
    dp_price_usd?: number;
    salaries_usd?: number;
  };
  final_balance_usd?: number;
}

interface SummaryCardsProps {
  cashOverview: CashOverview | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ cashOverview }) => {
  return (
    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
      <Col xs={24} sm={12} md={8}>
        <Card className="summary-card total-card" hoverable>
          <div className="summary-card-title">Jami kassa</div>
          <div className="summary-card-value">
            ${cashOverview?.cashbox?.total_in_usd?.toLocaleString() || 0}
          </div>
          <LineChartOutlined className="summary-card-icon" />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card className="summary-card expenses-card" hoverable>
          <div className="summary-card-title">Jami xarajatlar</div>
          <div className="summary-card-value">
            ${cashOverview?.expenses?.total_expenses_usd?.toLocaleString() || 0}
          </div>
          <div className="summary-card-subtitle">
            <span>Service: ${cashOverview?.expenses?.dp_price_usd?.toLocaleString() || 0}</span> |
            <span> Maosh: ${cashOverview?.expenses?.salaries_usd?.toLocaleString() || 0}</span>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={8}>
        <Card
          className="summary-card balance-card"
          hoverable
          style={{
            borderTop: cashOverview?.final_balance_usd && cashOverview.final_balance_usd >= 0 
              ? '4px solid #52c41a' 
              : '4px solid #f5222d'
          }}
        >
          <div className="summary-card-title">Qolgan balans (USD)</div>
          <div
            className="summary-card-value"
            style={{
              color: cashOverview?.final_balance_usd && cashOverview.final_balance_usd >= 0 
                ? '#52c41a' 
                : '#f5222d'
            }}
          >
            ${cashOverview?.final_balance_usd?.toLocaleString() || 0}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards; 