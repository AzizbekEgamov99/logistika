import React from 'react';
import { Row, Col, Card, Progress, Typography, Divider, Statistic } from 'antd';
import { CheckCircleOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ClientPaymentsSection = ({ clientPaymentData, isLoading }) => {
  // Ensure clientPaymentData is not null or undefined
  const data = clientPaymentData || { 
    percent_paid: 0, 
    percent_unpaid: 0,
    total_clients: 0,
    paid_clients: 0
  };
  
  return (
    <Card 
      title={
        <div className="section-header-with-icon">
          <UserOutlined style={{ marginRight: 8 }} />
          <span>Mijozlar to'lovlari</span>
        </div>
      }
      className="dashboard-card client-payment-card" 
      loading={isLoading} 
      variant="borderless"
    >
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={8}>
          <div className="payment-chart-container">
            <Progress
              type="dashboard"
              percent={data.percent_paid}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#52c41a',
              }}
              strokeWidth={8}
              format={percent => `${percent}%`}
              size={180}
            />
            <div className="chart-label">
              <Text strong>To'langan</Text>
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="Jami mijozlar"
                value={data.total_clients}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="To'lov qilgan mijozlar"
                value={data.paid_clients}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="To'langan (%)"
                value={data.percent_paid}
                suffix="%"
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="To'lanmagan (%)"
                value={data.percent_unpaid}
                suffix="%"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Col>
          </Row>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <div className="payment-summary">
            {data.total_clients > 0 ? (
              <div>
                <Text>
                  Jami <Text strong>{data.total_clients}</Text> mijozdan <Text strong style={{ color: '#52c41a' }}>{data.paid_clients}</Text> tasi to'lov qilgan.
                </Text>
                {data.percent_paid === 100 && (
                  <div className="success-message">
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} /> 
                    <Text strong style={{ color: '#52c41a' }}>Barcha mijozlar to'lovni amalga oshirgan!</Text>
                  </div>
                )}
              </div>
            ) : (
              <Text type="secondary">Hozirda mijozlar to'lovlari mavjud emas.</Text>
            )}
          </div>
        </Col>
      </Row>
      
      <style jsx global>{`
        .payment-chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        
        .chart-label {
          margin-top: 16px;
          text-align: center;
        }
        
        .section-header-with-icon {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
        }
        
        .success-message {
          display: flex;
          align-items: center;
          margin-top: 12px;
          padding: 8px 16px;
          background-color: rgba(82, 196, 26, 0.1);
          border-radius: 4px;
        }
        
        .payment-summary {
          margin-top: 8px;
        }
      `}</style>
    </Card>
  );
};

export default ClientPaymentsSection; 