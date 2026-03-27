'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Row, Col, Spin, Badge, Alert, Divider, Button, Space, Tooltip, message, Empty } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CarOutlined,
  WalletOutlined,
  HistoryOutlined,
  BankOutlined,
  LineChartOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useCash } from '../../hooks/useCash';
import { useCurrencies } from '../../hooks/useCurrencies';
import Overview from './Overview';
import ClientAccounts from './ClientAccounts';
import DriverPayments from './DriverPayments';
import RaysTulovlar from './RaysTulovlar';
import CashTransactionList from '../../components/CashTransaction/CashTransactionList';
import './styles.css';

const { Title, Text } = Typography;

const KassaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { cashOverview, loading, isLoading, fetchCashOverview } = useCash();
  const { currencies, loading: currenciesLoading, error: currenciesError } = useCurrencies();

  useEffect(() => {
    if (currenciesError) {
      message.error('Valyuta kurslarini yuklashda xatolik yuz berdi');
    }
  }, [currenciesError]);

  const handleRefresh = () => {
    fetchCashOverview();
    setLastUpdated(new Date());
    message.success('Ma\'lumotlar yangilandi');
  };

  // Function to get currency symbol
  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'RUB': return '₽';
      case 'EUR': return '€';
      case 'UZS': return 'so\'m';
      default: return currencyCode;
    }
  };

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>Umumiy ko`rinish</span>
      ),
      icon: <DollarOutlined />,
      children: <Overview />
    },
    {
      key: 'clients',
      label: 'Qarzdorlar',
      icon: <UserOutlined />,
      children: <ClientAccounts />
    },
    {
      key: 'rays',
      label: 'Reyslar boyicha to`lovlar',
      icon: <CarOutlined />,
      children: <RaysTulovlar />
    },
    {
      key: 'drivers',
      label: 'Haydovchilardagi pullar',
      icon: <WalletOutlined />,
      children: <DriverPayments />
    },
    {
      key: 'transactions',
      label: 'Operatsiyalar tarixi',
      icon: <HistoryOutlined />,
      children: <CashTransactionList />
    }
  ];

  if (isLoading || loading || currenciesLoading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spin-content" style={{
          padding: '30px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
          height: 200,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Spin size="large" />
          <div style={{ marginTop: '15px' }}>Ma'lumotlar yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="kassa-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Title level={4}>
            <BankOutlined /> Kassa boshqaruvi
          </Title>
          <Text type="secondary">
            Kompaniya moliyaviy holati va hisobotlari
          </Text>
        </div>
        <div className="dashboard-actions">
          <Space>
            <Tooltip title="Yangilash">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
              >
                Yangilash
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>

      {cashOverview?.final_balance_usd < 0 && (
        <Alert
          message="Diqqat! Moliyaviy holat salbiy!"
          description="Hozirgi vaqtda kassada mablag' yetarli emas. Iltimos, balansni tekshiring."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[24, 24]} className="currency-stats">
        {currencies && currencies.length > 0 ? (
          currencies.map(currency => (
            <Col xs={24} sm={12} md={6} key={`currency-card-${currency.id}`}>
              <Card className={`currency-card ${currency.currency.toLowerCase()}-card`} hoverable>
                <div className="currency-card-header">
                  <span className="currency-icon">{getCurrencySymbol(currency.currency)}</span>
                  <div className="currency-title">{currency.currency}</div>
                </div>
                <div className="currency-amount">
                  {cashOverview?.cashbox?.[currency.currency]?.toLocaleString() || 0}
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="Valyuta ma'lumotlari mavjud emas" />
          </Col>
        )}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="summary-card total-card" hoverable>
            <div className="summary-card-title">Jami kassa </div>
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
              <span>Service xarajatlar: ${cashOverview?.expenses?.dp_price_usd?.toLocaleString() || 0}</span> |
              <span> Maosh: ${cashOverview?.expenses?.salaries_usd?.toLocaleString() || 0}</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="summary-card balance-card"
            hoverable
            style={{
              borderTop: cashOverview?.final_balance_usd >= 0 ? '4px solid #52c41a' : '4px solid #f5222d'
            }}
          >
            <div className="summary-card-title">Qolgan balans (USD)</div>
            <div
              className="summary-card-value"
              style={{
                color: cashOverview?.final_balance_usd >= 0 ? '#52c41a' : '#f5222d'
              }}
            >
              ${cashOverview?.final_balance_usd?.toLocaleString() || 0}
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="main-card" style={{ marginTop: 24 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <span>
                {item.icon} {item.label}
              </span>
            ),
            children: item.children
          }))}
          type="card"
          size="large"
          className="custom-tabs"
          tabBarExtraContent={
            <Text type="secondary" className="non-printable">
              So`nggi yangilanish: {lastUpdated.toLocaleTimeString()}
            </Text>
          }
        />
      </Card>

      <div className="dashboard-footer">
        <Divider />
        <Row justify="space-between" align="middle">
          <Col>
            <Text type="secondary">© {new Date().getFullYear()} RBL LOGISTCS | Kassa boshqaruv tizimi</Text>
          </Col>
          <Col>
            <Text type="secondary">
              Ma`lumotlar vaqti: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </Text>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default KassaPage; 