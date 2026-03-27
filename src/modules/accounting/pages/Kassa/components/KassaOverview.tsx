'use client';
import React, { useState, useRef } from 'react';
import { Row, Col, Card, Typography, Statistic, Select, Button, Spin, Divider, Tooltip, DatePicker, Dropdown, Menu, Space } from 'antd';
import { 
  WalletOutlined, 
  DollarOutlined,
  ReloadOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  SyncOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { useCashOverview } from '../../../hooks/useCash';
import { useCurrencies } from '../../../hooks/useCurrencies';
import { Pie } from '@ant-design/charts';
import dayjs from 'dayjs';
import type { MenuProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const KassaOverview: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const { cashOverview, isLoading, refetch } = useCashOverview();
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const printRef = useRef<HTMLDivElement>(null);

  // Qayta yuklash funksiyasi
  const handleRefresh = () => {
    refetch();
  };

  // Sanani o'zgartirish funksiyasi
  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    // Bu yerda API ga so'rov yuborish kerak bo'ladi
    // Hozircha faqat refetch qilamiz
    if (dates) {
      refetch();
    }
  };

  // Miqdorni formatlash
  const formatCurrency = (amount: number, currency: string = selectedCurrency): string => {
    if (amount === undefined || amount === null) return '0';
    
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Expenses chart data
  const getExpensesChartData = () => {
    if (!cashOverview?.expenses) return [];

    const expenses = cashOverview.expenses;
    return [
      { type: 'Haydovchilar maoshi', value: expenses.salaries_usd || 0 },
      { type: 'Servis xarajatlari', value: expenses.dp_price_usd || 0 },
      { type: 'Boshqa xarajatlar', value: (expenses.total_expenses_usd || 0) - (expenses.salaries_usd || 0) - (expenses.dp_price_usd || 0) }
    ].filter(item => item.value > 0);
  };

  // Chart config
  const pieConfig = {
    data: getExpensesChartData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      },
    interactions: [
      {
        type: 'element-active',
    },
    ],
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: formatCurrency(datum.value, 'USD') };
      },
    },
  };

  // Sana oralig'ini formatlab ko'rsatish
  const getDateRangeText = () => {
    if (!dateRange) {
      return new Date().toLocaleDateString();
    }
    
    const [start, end] = dateRange;
    return `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')}`;
  };

  // Chop qilish funksiyasi
  const handlePrint = () => {
    window.print();
  };

  // Excel formatida export qilish (simulyatsiya)
  const handleExportExcel = () => {
    alert('Excel formatda yuklab olish funksiyasi ishga tushdi');
    // Bu yerda haqiqiy export funksiyasini chaqirish kerak
  };

  // PDF formatida export qilish (simulyatsiya)
  const handleExportPDF = () => {
    alert('PDF formatda yuklab olish funksiyasi ishga tushdi');
    // Bu yerda haqiqiy export funksiyasini chaqirish kerak
  };

  // Export menyu elementlari
  const exportMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Print',
      icon: <PrinterOutlined />,
      onClick: handlePrint,
    },
    {
      key: '2',
      label: 'Excel formatda saqlash',
      icon: <FileExcelOutlined />,
      onClick: handleExportExcel,
    },
    {
      key: '3',
      label: 'PDF formatda saqlash',
      icon: <FilePdfOutlined />,
      onClick: handleExportPDF,
    },
  ];

  return (
    <Spin spinning={isLoading || currenciesLoading} size="large">
      <div className="kassa-overview dashboard-style" ref={printRef}>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <Title level={4}>Kassa Boshqaruvi</Title>
            <Text type="secondary">Umumiy hisobot - {getDateRangeText()}</Text>
          </div>
          <div className="dashboard-actions non-printable">
                <RangePicker 
              onChange={handleDateRangeChange}
              style={{ marginRight: 16 }}
              placeholder={['Boshlanish', 'Tugash']}
              allowClear={true}
                  format="DD.MM.YYYY"
            />
                <Select
              defaultValue="USD"
              style={{ width: 120, marginRight: 16 }}
              onChange={(value) => setSelectedCurrency(value)}
              loading={currenciesLoading}
                >
              {currencies.length > 0 ? (
                currencies.map(currency => (
                  <Option key={currency.id} value={currency.currency}>
                    {currency.currency}
                  </Option>
                ))
              ) : (
                <>
                  <Option value="USD">USD</Option>
                  <Option value="UZS">UZS</Option>
                  <Option value="RUB">RUB</Option>
                  <Option value="EUR">EUR</Option>
                </>
              )}
                </Select>
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button 
                style={{ marginRight: 16 }}
                icon={<DownloadOutlined />}>
                Yuklab olish
              </Button>
            </Dropdown>
            <Tooltip title="Ma'lumotlarni yangilash">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isLoading}
              >
                Yangilash
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Asosiy statistika */}
        <Row gutter={[24, 24]} className="dashboard-stats">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="dashboard-stat-card total-stats">
              <Statistic
                title={<div className="stat-title">Jami mablag`` (USD)</div>}
                value={cashOverview?.cashbox?.total_in_usd || 0}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="USD"
              />
              <div className="stat-icon total-icon">
                <BankOutlined />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="dashboard-stat-card expenses-stats">
              <Statistic
                title={<div className="stat-title">Jami xarajatlar</div>}
                value={cashOverview?.expenses?.total_expenses_usd || 0}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
                suffix="USD"
              />
              <div className="stat-icon expenses-icon">
                <ArrowDownOutlined />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="dashboard-stat-card balance-stats">
              <Statistic
                title={<div className="stat-title">Qolgan balans</div>}
                value={cashOverview?.final_balance_usd || 0}
                precision={2}
                valueStyle={{ color: cashOverview?.final_balance_usd > 0 ? '#3f8600' : '#cf1322' }}
                prefix={cashOverview?.final_balance_usd > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="USD"
              />
              <div className="stat-icon balance-icon">
                <SyncOutlined />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card className="dashboard-stat-card">
              <Statistic
                title={<div className="stat-title">DP to`lovlari</div>}
                value={cashOverview?.expenses?.dp_price_usd || 0}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
                suffix="USD"
              />
              <div className="stat-icon dp-icon">
                <ArrowDownOutlined />
              </div>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left">Kassadagi valyutalar</Divider>

        {/* Valyutalar bo'yicha balanslar */}
        <Row gutter={[24, 24]} className="currency-balances">
          {currencies.length > 0 ? (
            currencies.map(currency => (
              <Col xs={24} sm={12} md={6} key={`currency-card-${currency.id}`}>
                <Card className={`currency-card ${currency.currency.toLowerCase()}-card`}>
                  <div className="currency-card-header">
                    <div className="currency-icon">
                      {currency.currency === 'USD' ? <DollarOutlined /> : <WalletOutlined />}
                    </div>
                    <div className="currency-title">{currency.currency}</div>
                  </div>
                  <div className="currency-amount">
                    {formatCurrency(cashOverview?.cashbox?.[currency.currency] || 0, currency.currency)}
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <>
              <Col xs={24} sm={12} md={6}>
                <Card className="currency-card usd-card">
                  <div className="currency-card-header">
                    <div className="currency-icon">
                      <DollarOutlined />
                    </div>
                    <div className="currency-title">USD</div>
                  </div>
                  <div className="currency-amount">
                    {formatCurrency(cashOverview?.cashbox?.USD || 0, 'USD')}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="currency-card uzs-card">
                  <div className="currency-card-header">
                    <div className="currency-icon">
                      <WalletOutlined />
                    </div>
                    <div className="currency-title">UZS</div>
                  </div>
                  <div className="currency-amount">
                    {formatCurrency(cashOverview?.cashbox?.UZS || 0, 'UZS')}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="currency-card rub-card">
                  <div className="currency-card-header">
                    <div className="currency-icon">
                      <WalletOutlined />
                    </div>
                    <div className="currency-title">RUB</div>
                  </div>
                  <div className="currency-amount">
                    {formatCurrency(cashOverview?.cashbox?.RUB || 0, 'RUB')}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="currency-card eur-card">
                  <div className="currency-card-header">
                    <div className="currency-icon">
                      <WalletOutlined />
                    </div>
                    <div className="currency-title">EUR</div>
                  </div>
                  <div className="currency-amount">
                    {formatCurrency(cashOverview?.cashbox?.EUR || 0, 'EUR')}
                  </div>
                </Card>
              </Col>
            </>
          )}
        </Row>

        <Divider orientation="left">Xarajatlar taqsimoti</Divider>

        {/* Xarajatlar chart */}
        <Row gutter={[24, 24]} className="expenses-chart">
          <Col xs={24}>
            <Card title="Xarajatlar taqsimoti" className="chart-card">
              <div className="chart-container">
                {getExpensesChartData().length > 0 ? (
                  <Pie {...pieConfig} />
                ) : (
                  <div className="empty-chart-message">
                    <Text type="secondary">Xarajatlar ma`lumotlari mavjud emas</Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left">Xarajatlar tafsiloti</Divider>

        {/* Xarajatlar */}
        <Row gutter={[24, 24]} className="expenses-breakdown">
          <Col xs={24} md={12}>
            <Card 
              title="Haydovchilar maoshi" 
              className="expense-detail-card"
              extra={<span className="expense-date">Joriy davr</span>}
            >
              <div className="expense-content">
                <div className="expense-icon salaries-icon">
                  <ArrowDownOutlined />
                </div>
                <div className="expense-stats">
                  <div className="expense-amount">
                    {formatCurrency(cashOverview?.expenses?.salaries_usd || 0, 'USD')}
                  </div>
                  <div className="expense-percent">
                    {cashOverview?.expenses?.total_expenses_usd
                      ? Math.round((cashOverview?.expenses?.salaries_usd / cashOverview?.expenses?.total_expenses_usd) * 100)
                      : 0}% jami xarajatlardan
                  </div>
                </div>
              </div>
            </Card>
                </Col>
          <Col xs={24} md={12}>
            <Card 
              title="Servis xarajatlari" 
              className="expense-detail-card"
              extra={<span className="expense-date">Joriy davr</span>}
            >
              <div className="expense-content">
                <div className="expense-icon dp-expense-icon">
                  <ArrowDownOutlined />
                </div>
                <div className="expense-stats">
                  <div className="expense-amount">
                    {formatCurrency(cashOverview?.expenses?.dp_price_usd || 0, 'USD')}
                  </div>
                  <div className="expense-percent">
                    {cashOverview?.expenses?.total_expenses_usd
                      ? Math.round((cashOverview?.expenses?.dp_price_usd / cashOverview?.expenses?.total_expenses_usd) * 100)
                      : 0}% jami xarajatlardan
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default KassaOverview; 