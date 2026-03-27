import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Button, Select, Table, Typography, Statistic, Divider } from 'antd';
import { DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface FinancialReportsProps {
  data: any;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ data }) => {
  const [reportType, setReportType] = useState('income-statement');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Function to generate report based on selected type and date range
  const generateReport = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Placeholder data for the income statement
  const incomeStatementData = [
    {
      key: '1',
      item: 'Daromad',
      amount: 1250000,
      type: 'header',
    },
    {
      key: '2',
      item: 'Transport xizmatlari',
      amount: 950000,
      type: 'subitem',
    },
    {
      key: '3',
      item: 'Qo\'shimcha xizmatlar',
      amount: 300000,
      type: 'subitem',
    },
    {
      key: '4',
      item: 'Xarajatlar',
      amount: 740000,
      type: 'header',
    },
    {
      key: '5',
      item: 'Yoqilg\'i',
      amount: 380000,
      type: 'subitem',
    },
    {
      key: '6',
      item: 'Texnik xizmat',
      amount: 150000,
      type: 'subitem',
    },
    {
      key: '7',
      item: 'Haydovchilar maoshi',
      amount: 210000,
      type: 'subitem',
    },
    {
      key: '8',
      item: 'Sof foyda',
      amount: 510000,
      type: 'total',
    },
  ];

  // Columns for income statement table
  const incomeStatementColumns = [
    {
      title: 'Modda',
      dataIndex: 'item',
      key: 'item',
      render: (text: string, record: any) => {
        if (record.type === 'header') {
          return <Text strong>{text}</Text>;
        } else if (record.type === 'total') {
          return <Text strong style={{ fontSize: 16 }}>{text}</Text>;
        }
        return <Text style={{ paddingLeft: 20 }}>{text}</Text>;
      },
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as 'right',
      render: (amount: number, record: any) => {
        if (record.type === 'header') {
          return <Text strong>{formatCurrency(amount)}</Text>;
        } else if (record.type === 'total') {
          return <Text strong style={{ fontSize: 16 }}>{formatCurrency(amount)}</Text>;
        } else if (record.item.includes('Xarajatlar') || record.key === '5' || record.key === '6' || record.key === '7') {
          return <Text type="danger">{formatCurrency(amount)}</Text>;
        }
        return <Text>{formatCurrency(amount)}</Text>;
      },
    },
  ];

  return (
    <div className="financial-reports">
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Select
              style={{ width: '100%' }}
              value={reportType}
              onChange={setReportType}
            >
              <Option value="income-statement">Daromad va xarajatlar hisoboti</Option>
              <Option value="balance-sheet">Balans hisoboti</Option>
              <Option value="cash-flow">Pul oqimi hisoboti</Option>
              <Option value="profitability">foyda tahlili</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker 
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates) {
                  setDateRange([dates[0]?.toDate()!, dates[1]?.toDate()!]);
                } else {
                  setDateRange(null);
                }
              }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              onClick={generateReport}
              loading={isLoading}
              style={{ width: '100%' }}
            >
              Hisobot yaratish
            </Button>
          </Col>
        </Row>
        
        <Divider />
        
        {reportType === 'income-statement' && (
          <div>
            <Title level={4}>Daromad va xarajatlar hisoboti</Title>
            <Text type="secondary">
              {dateRange 
                ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                : 'Joriy oy'}
            </Text>
            
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Jami daromad"
                  value={1250000}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Jami xarajat"
                  value={740000}
                  precision={0}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<DollarOutlined />}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Sof foyda"
                  value={510000}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<RiseOutlined />}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Col>
            </Row>
            
            <Table
              columns={incomeStatementColumns}
              dataSource={incomeStatementData}
              pagination={false}
              bordered
            />
          </div>
        )}
        
        {reportType === 'balance-sheet' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Title level={4}>Balans hisoboti</Title>
            <Text type="secondary">Bu bo'lim hali ishlab chiqilmoqda</Text>
          </div>
        )}
        
        {reportType === 'cash-flow' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Title level={4}>Pul oqimi hisoboti</Title>
            <Text type="secondary">Bu bo'lim hali ishlab chiqilmoqda</Text>
          </div>
        )}
        
        {reportType === 'profitability' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Title level={4}>foyda tahlili</Title>
            <Text type="secondary">Bu bo'lim hali ishlab chiqilmoqda</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinancialReports; 