import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Form, InputNumber, Button, Select, Table, Typography, Statistic } from 'antd';
import { CalculatorOutlined, DollarOutlined, CarOutlined, BankOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/plots';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Sample vehicle investment data
const vehicleInvestments = [
  {
    key: '1',
    name: 'Yangi Scania yuk mashinasi',
    cost: 120000,
    lifespan: 10,
    annualRevenue: 35000,
    annualExpenses: 12000,
    roi: 19.2,
    status: 'proposed',
  },
  {
    key: '2',
    name: 'Refrigerator furgon',
    cost: 85000,
    lifespan: 8,
    annualRevenue: 28000,
    annualExpenses: 9000,
    roi: 22.4,
    status: 'approved',
  },
  {
    key: '3',
    name: 'Mercedes-Benz Actros',
    cost: 150000,
    lifespan: 12,
    annualRevenue: 42000,
    annualExpenses: 15000,
    roi: 18.0,
    status: 'active',
  },
  {
    key: '4',
    name: 'Volvo FH16',
    cost: 165000,
    lifespan: 10,
    annualRevenue: 45000,
    annualExpenses: 18000,
    roi: 16.4,
    status: 'active',
  },
];

// Format currency
const formatCurrency = (value: number): string => {
  return "$" + value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
};

const InvestmentAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roi');
  const [roiForm] = Form.useForm();
  const [assetComparisonForm] = Form.useForm();
  
  // Calculate ROI
  const calculateROI = (values: any) => {
    const { initialInvestment, annualRevenue, annualExpenses, investmentPeriod } = values;
    const annualProfit = annualRevenue - annualExpenses;
    const totalProfit = annualProfit * investmentPeriod;
    const roi = (totalProfit - initialInvestment) / initialInvestment * 100;
    
    return {
      totalRevenue: annualRevenue * investmentPeriod,
      totalExpenses: annualExpenses * investmentPeriod,
      totalProfit,
      roi,
      paybackPeriod: initialInvestment / annualProfit,
    };
  };
  
  // Demo values for ROI calculator
  const demoValues = {
    initialInvestment: 100000,
    annualRevenue: 35000,
    annualExpenses: 15000,
    investmentPeriod: 5,
  };
  
  const demoResults = calculateROI(demoValues);
  
  // Vehicle investment table columns
  const vehicleColumns = [
    {
      title: 'Transport vositasi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Boshlang\'ich xarajat',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => formatCurrency(cost),
      sorter: (a: any, b: any) => a.cost - b.cost,
    },
    {
      title: 'Xizmat muddati (yil)',
      dataIndex: 'lifespan',
      key: 'lifespan',
    },
    {
      title: 'Yillik daromad',
      dataIndex: 'annualRevenue',
      key: 'annualRevenue',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Yillik xarajatlar',
      dataIndex: 'annualExpenses',
      key: 'annualExpenses',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'ROI (%)',
      dataIndex: 'roi',
      key: 'roi',
      render: (roi: number) => <span style={{ color: roi > 15 ? '#3f8600' : '#cf1322' }}>{roi.toFixed(1)}%</span>,
      sorter: (a: any, b: any) => a.roi - b.roi,
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'proposed':
            color = '#1890ff';
            text = 'Taklif qilingan';
            break;
          case 'approved':
            color = '#faad14';
            text = 'Tasdiqlangan';
            break;
          case 'active':
            color = '#52c41a';
            text = 'Faol';
            break;
          case 'completed':
            color = '#d9d9d9';
            text = 'Yakunlangan';
            break;
        }
        
        return <span style={{ color }}>{text}</span>;
      },
      filters: [
        { text: 'Taklif qilingan', value: 'proposed' },
        { text: 'Tasdiqlangan', value: 'approved' },
        { text: 'Faol', value: 'active' },
        { text: 'Yakunlangan', value: 'completed' },
      ],
      onFilter: (value: string, record: any) => record.status === value,
    },
  ];
  
  // Prepare pie chart data
  const investmentDistributionData = [
    { type: 'Scania yuk mashinasi', value: 120000 },
    { type: 'Refrigerator furgon', value: 85000 },
    { type: 'Mercedes-Benz Actros', value: 150000 },
    { type: 'Volvo FH16', value: 165000 },
  ];
  
  const pieConfig = {
    data: investmentDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      formatter: (datum: any) => `${datum.type}: ${formatCurrency(datum.value)}`,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: formatCurrency(datum.value),
      }),
    },
    interactions: [{ type: 'element-active' }],
  };
  
  return (
    <div className="investment-analysis">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ marginBottom: 16 }}>
            <Title level={4}>Investitsiya tahlili</Title>
            <Text type="secondary">Transport vositalariga sarmoya kiritish uchun strategik qarorlar qabul qilish</Text>
          </Card>
        </Col>
        
        <Col span={24}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={<span><CalculatorOutlined /> ROI Hisoblagichi</span>}
                key="roi"
              >
                <Row gutter={[16, 16]}>
                  <Col span={24} md={8}>
                    <Card title="Investitsiya rentabelligini hisoblash" bordered={false}>
                      <Form
                        layout="vertical"
                        form={roiForm}
                        initialValues={demoValues}
                      >
                        <Form.Item 
                          label="Boshlang'ich investitsiya" 
                          name="initialInvestment"
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                          />
                        </Form.Item>
                        
                        <Form.Item 
                          label="Yillik daromad" 
                          name="annualRevenue"
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                          />
                        </Form.Item>
                        
                        <Form.Item 
                          label="Yillik xarajatlar" 
                          name="annualExpenses"
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                          />
                        </Form.Item>
                        
                        <Form.Item 
                          label="Investitsiya muddati (yil)" 
                          name="investmentPeriod"
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                            max={20}
                          />
                        </Form.Item>
                        
                        <Form.Item>
                          <Button type="primary" block>
                            Hisoblash
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                  
                  <Col span={24} md={16}>
                    <Card title="Natijalar" bordered={false}>
                      <Row gutter={16}>
                        <Col span={24} md={12}>
                          <Statistic
                            title="Jami daromad"
                            value={demoResults.totalRevenue}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatCurrency(value as number)}
                          />
                          <Statistic
                            title="Jami xarajatlar"
                            value={demoResults.totalExpenses}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatCurrency(value as number)}
                            style={{ marginTop: 16 }}
                          />
                          <Statistic
                            title="Jami foyda"
                            value={demoResults.totalProfit}
                            precision={0}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatCurrency(value as number)}
                            style={{ marginTop: 16 }}
                          />
                        </Col>
                        <Col span={24} md={12}>
                          <Statistic
                            title="Investitsiya rentabelligi (ROI)"
                            value={demoResults.roi}
                            precision={2}
                            valueStyle={{ color: demoResults.roi > 15 ? '#3f8600' : '#cf1322' }}
                            suffix="%"
                          />
                          <Statistic
                            title="Qoplanish muddati"
                            value={demoResults.paybackPeriod}
                            precision={1}
                            valueStyle={{ color: demoResults.paybackPeriod < 5 ? '#3f8600' : '#cf1322' }}
                            suffix={` yil`}
                            style={{ marginTop: 16 }}
                          />
                        </Col>
                      </Row>
                      
                      <div style={{ marginTop: 24 }}>
                        <Title level={5}>Tahlil</Title>
                        <Paragraph>
                          <Text strong>
                            {demoResults.roi > 15 
                              ? 'Bu investitsiya samarali!' 
                              : 'Bu investitsiya takror ko\'rib chiqilishi kerak.'}
                          </Text>
                        </Paragraph>
                        <Paragraph>
                          {demoResults.roi > 15 
                            ? `Ushbu investitsiya ${demoResults.paybackPeriod.toFixed(1)} yilda o'zini qoplaydi va undan keyin sof foyda keltiradi.`
                            : 'Kutilgan ROI juda past. Boshqa imkoniyatlarni ko\'rib chiqing yoki xarajatlarni kamaytirish yo\'llarini toping.'}
                        </Paragraph>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane
                tab={<span><CarOutlined /> Transport investitsiyalari</span>}
                key="vehicles"
              >
                <Row gutter={[16, 16]}>
                  <Col span={24} md={16}>
                    <Card title="Transport vositalariga investitsiyalar" bordered={false}>
                      <Table
                        columns={vehicleColumns}
                        dataSource={vehicleInvestments}
                        pagination={false}
                      />
                    </Card>
                  </Col>
                  
                  <Col span={24} md={8}>
                    <Card title="Investitsiya taqsimoti" bordered={false}>
                      <div style={{ height: 300 }}>
                        <Pie {...pieConfig} />
                      </div>
                    </Card>
                  </Col>
                  
                  <Col span={24}>
                    <Card title="Investitsiya tavsiyalari" bordered={false}>
                      <Row gutter={[16, 16]}>
                        <Col span={24} md={8}>
                          <Card type="inner" title="Eng yuqori ROI">
                            <Statistic
                              title="Refrigerator furgon"
                              value={22.4}
                              precision={1}
                              valueStyle={{ color: '#3f8600' }}
                              suffix="%"
                            />
                            <Text>
                              Refrijerator furgonlar uchun talab yuqori va yuqori foyda ko'rsatadi.
                            </Text>
                          </Card>
                        </Col>
                        <Col span={24} md={8}>
                          <Card type="inner" title="Optimal qoplanish muddati">
                            <Statistic
                              title="Scania yuk mashinasi"
                              value={5.2}
                              precision={1}
                              valueStyle={{ color: '#1890ff' }}
                              suffix="yil"
                            />
                            <Text>
                              Scania yuk mashinasi investitsiya qiymatini tez qoplash imkonini beradi.
                            </Text>
                          </Card>
                        </Col>
                        <Col span={24} md={8}>
                          <Card type="inner" title="Tavsiya etilgan aralash investitsiya">
                            <ul>
                              <li>60% - Refrigerator furgonlar</li>
                              <li>30% - Scania yuk mashinasi</li>
                              <li>10% - Maxsus transport</li>
                            </ul>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane
                tab={<span><BankOutlined /> Strategik investitsiyalar</span>}
                key="strategic"
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title="Strategik investitsiya imkoniyatlari" bordered={false}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={tableCellStyle}>Investitsiya turi</th>
                            <th style={tableCellStyle}>Tavsiya</th>
                            <th style={tableCellStyle}>Taxminiy xarajat</th>
                            <th style={tableCellStyle}>Kutilgan ROI</th>
                            <th style={tableCellStyle}>Qoplanish muddati</th>
                            <th style={tableCellStyle}>Ustuvorlik</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={tableCellStyle}>Logistika markazi</td>
                            <td style={tableCellStyle}>Toshkent viloyatida yangi logistika markazini qurish</td>
                            <td style={tableCellStyle}>{formatCurrency(500000)}</td>
                            <td style={tableCellStyle}>18.5%</td>
                            <td style={tableCellStyle}>5.4 yil</td>
                            <td style={tableCellStyle}>Yuqori</td>
                          </tr>
                          <tr>
                            <td style={tableCellStyle}>GPS kuzatuvi</td>
                            <td style={tableCellStyle}>Barcha transport vositalarini GPS kuzatuv tizimlari bilan jihozlash</td>
                            <td style={tableCellStyle}>{formatCurrency(75000)}</td>
                            <td style={tableCellStyle}>24.8%</td>
                            <td style={tableCellStyle}>4.0 yil</td>
                            <td style={tableCellStyle}>O'rta</td>
                          </tr>
                          <tr>
                            <td style={tableCellStyle}>Texnologik yechimlar</td>
                            <td style={tableCellStyle}>Logistika boshqaruvi uchun dasturiy ta'minot ishlab chiqish</td>
                            <td style={tableCellStyle}>{formatCurrency(120000)}</td>
                            <td style={tableCellStyle}>32.1%</td>
                            <td style={tableCellStyle}>3.1 yil</td>
                            <td style={tableCellStyle}>Yuqori</td>
                          </tr>
                          <tr>
                            <td style={tableCellStyle}>Malaka oshirish</td>
                            <td style={tableCellStyle}>Haydovchilar va logistika xodimlari uchun o'quv dasturi</td>
                            <td style={tableCellStyle}>{formatCurrency(45000)}</td>
                            <td style={tableCellStyle}>22.5%</td>
                            <td style={tableCellStyle}>4.4 yil</td>
                            <td style={tableCellStyle}>O'rta</td>
                          </tr>
                        </tbody>
                      </table>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Cell style for table
const tableCellStyle = {
  border: '1px solid #f0f0f0',
  padding: '8px 12px',
};

export default InvestmentAnalysis; 