import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Progress, Spin, Alert, Button, Divider } from 'antd';
import { 
  SyncOutlined, 
  DollarOutlined, 
  WalletOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';
import { cashApi } from '../../api/cash/cashApi';
import { CashOverview as ICashOverview } from '../../types/cash.types';
import './styles-clean.css';

const { Title, Text } = Typography;

const formatNumber = (value: number) => 
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Overview: React.FC = () => {
  const [overview, setOverview] = useState<ICashOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await cashApi.getCashOverview();
      setOverview(data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <div className="loading-text">Ma`lumotlar yuklanmoqda...</div>
      </div>
    );
  }

  if (!overview) {
    return (
      <Alert
        type="info"
        message="Ma'lumotlar mavjud emas"
        description="Kassa ma'lumotlari yuklanmadi. Qaytadan urinib ko'ring."
        action={
          <Button type="primary" onClick={fetchOverview} icon={<SyncOutlined />}>
            Qayta yuklash
          </Button>
        }
      />
    );
  }

  const totalInUSD = overview.cashbox.total_in_usd || 0;
  const totalExpenses = overview.expenses.total_expenses_usd || 0;
  const finalBalance = overview.final_balance_usd || 0;
  const dpPayments = overview.expenses.dp_price_usd || 0;
  const serviceExpenses = overview.expenses.salaries_usd || 0;
  const expenseRatio = Math.min(Math.round((totalExpenses / (totalInUSD + 0.01)) * 100), 100);
  return (
    <div className="overview-container">
      <div className="page-header">
        <div>
          <Title level={3}>Kassa holati</Title>
          <Text type="secondary">
            Kassadagi mablag`lar va xarajatlar to`g`risida umumiy ma`lumot
          </Text>
        </div>
        <Button 
          type="primary" 
          onClick={fetchOverview} 
          icon={<SyncOutlined />}
        >
          Yangilash
        </Button>
      </div>

      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <div className="stat-box income-box">
            <div className="stat-icon">
              <DollarOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-title">Jami mablag'</div>
              <div className="stat-value">${formatNumber(totalInUSD)}</div>
              <div className="stat-description">
                <ArrowUpOutlined /> Barcha kirimlar
              </div>
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <div className="stat-box expense-box">
            <div className="stat-icon">
              <ArrowDownOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-title">Jami xarajatlar</div>
              <div className="stat-value">${formatNumber(totalExpenses)}</div>
              <div className="stat-description">
                <ArrowDownOutlined /> {expenseRatio}% xarajat
              </div>
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <div className={`stat-box ${finalBalance >= 0 ? 'balance-positive-box' : 'balance-negative-box'}`}>
            <div className="stat-icon">
              {finalBalance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </div>
            <div className="stat-content">
              <div className="stat-title">Qolgan balans</div>
              <div className="stat-value">${formatNumber(finalBalance)}</div>
              <div className="stat-description">
                Hozirgi jami qolgan mablag'
              </div>
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <div className="stat-box service-box">
            <div className="stat-icon">
              <WalletOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-title">Service xarajatlari</div>
              <div className="stat-value">${formatNumber(dpPayments)}</div>
              <div className="stat-description">
                Mashina, furgon xarajatlari
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="section-container">
        <div className="section-header">
          <WalletOutlined /> Kassadagi valyutalar
        </div>
        
        <Card className="currency-section">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="currency-boxes">
                <div className="currency-box usd-box">
                  <div className="currency-info">
                    <span className="currency-name">USD</span>
                    <span className="currency-value">{formatNumber(overview.cashbox.USD || 0)}</span>
                  </div>
                  <div className="currency-symbol">$</div>
                </div>
                
                <div className="currency-box uzs-box">
                  <div className="currency-info">
                    <span className="currency-name">UZS</span>
                    <span className="currency-value">{formatNumber(overview.cashbox.UZS || 0)}</span>
                  </div>
                  <div className="currency-symbol">soʻm</div>
                </div>
                
                <div className="currency-box rub-box">
                  <div className="currency-info">
                    <span className="currency-name">RUB</span>
                    <span className="currency-value">{formatNumber(overview.cashbox.RUB || 0)}</span>
                  </div>
                  <div className="currency-symbol">₽</div>
                </div>
                
                <div className="currency-box eur-box">
                  <div className="currency-info">
                    <span className="currency-name">EUR</span>
                    <span className="currency-value">{formatNumber(overview.cashbox.EUR || 0)}</span>
                  </div>
                  <div className="currency-symbol">€</div>
                </div>
                <div className="currency-box eur-box">
                  <div className="currency-info">
                    <span className="currency-name">KZT</span>
                    <span className="currency-value">{formatNumber(overview.cashbox.KZT || 0)}</span>
                  </div>
                  <div className="currency-symbol">₸</div>
                </div>
              </div>
              
              <Divider />
              
              <div className="total-box">
                <span>Jami USD ekvivalenti:</span>
                <span className="total-value">${formatNumber(totalInUSD)}</span>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="analysis-section">
                <div className="analysis-title">Balans tahlili</div>
                
                <div className="analysis-item">
                  <div className="analysis-header">
                    <span>Jami mablag' (USD)</span>
                    <span className="analysis-value">${formatNumber(totalInUSD)}</span>
                  </div>
                  <Progress percent={100} strokeColor="#52c41a" showInfo={false} />
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-header">
                    <span>Jami xarajatlar</span>
                    <span className="analysis-value">${formatNumber(totalExpenses)}</span>
                  </div>
                  <Progress percent={expenseRatio} strokeColor="#ff4d4f" showInfo={false} />
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-header">
                    <span>Service xarajatlari</span>
                    <span className="analysis-value">${formatNumber(dpPayments)}</span>
                  </div>
                  <Progress 
                    percent={Math.round((dpPayments / (totalExpenses + 0.01)) * 100)} 
                    strokeColor="#1890ff" 
                    showInfo={false} 
                  />
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-header">
                    <span>Haydovchi oylik maoshlari</span>
                    <span className="analysis-value">${formatNumber(serviceExpenses)}</span>
                  </div>
                  <Progress 
                    percent={Math.round((serviceExpenses / (totalExpenses + 0.01)) * 100)} 
                    strokeColor="#722ed1" 
                    showInfo={false} 
                  />
                </div>
                
                <div className="analysis-item result-item">
                  <div className="analysis-header">
                    <span>Qolgan balans</span>
                    <span className={`analysis-value ${finalBalance >= 0 ? 'positive-value' : 'negative-value'}`}>
                      ${formatNumber(finalBalance)}
                    </span>
                  </div>
                  <Progress 
                    percent={Math.round((Math.abs(finalBalance) / (totalInUSD + 0.01)) * 100)} 
                    strokeColor={finalBalance >= 0 ? "#52c41a" : "#ff4d4f"} 
                    showInfo={false} 
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Overview;