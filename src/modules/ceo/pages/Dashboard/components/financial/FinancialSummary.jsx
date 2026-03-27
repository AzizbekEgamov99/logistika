import React from 'react';
import { Row, Col, Card, Statistic, Typography, Divider } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  DollarCircleOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';

const { Title } = Typography;

const FinancialSummary = ({ 
  financialOverview, 
  monthlyIncome, 
  totalRevenue, 
  totalExpenses, 
  netProfit, 
  dateRange, 
  isLoading 
}) => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <Title level={4}><DollarCircleOutlined /> Moliyaviy ko'rsatkichlar</Title>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="dashboard-card financial-summary-card" loading={isLoading} variant="borderless">
            <Statistic
              title="Jami daromad (USD)"
              value={formatCurrency(totalRevenue)}
              valueStyle={{ color: '#3f8600', fontSize: '28px' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className="dashboard-card financial-summary-card" loading={isLoading} variant="borderless">
            <Statistic
              title="Jami xarajat (USD)"
              value={formatCurrency(totalExpenses)}
              valueStyle={{ color: '#cf1322', fontSize: '28px' }}
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className="dashboard-card financial-summary-card" loading={isLoading} variant="borderless">
            <Statistic
              title="Sof foyda (USD)"
              value={formatCurrency(netProfit)}
              valueStyle={{ 
                color: netProfit >= 0 ? '#3f8600' : '#cf1322', 
                fontSize: '28px' 
              }}
              prefix={netProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
            <div className="financial-metrics">
              {/* <div className="financial-metric">
                <div className="metric-title">
                  <PieChartOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                  Foydalilik darajasi
                </div>
                <div className="metric-value">
                  {totalRevenue > 0 ? 
                    `${Math.round((netProfit / totalRevenue) * 100)}%` : 
                    '0%'
                  }
                </div>
              </div> */}
              <Divider style={{ margin: '12px 0' }} />
              <div className="financial-metric">
                <div className="metric-title">
                  <LineChartOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  O'rtacha oylik daromad
                </div>
                <div className="metric-value">
                  {formatCurrency(totalRevenue / (monthlyIncome.length || 1))} USD
                </div>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div className="financial-period">
                <div className="period-label">Ma'lumotlar davri:</div>
                <div className="period-value">
                  {dateRange.startDate?.toLocaleDateString('uz-UZ')} - {dateRange.endDate?.toLocaleDateString('uz-UZ')}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialSummary; 