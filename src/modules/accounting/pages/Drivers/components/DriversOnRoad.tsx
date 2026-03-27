import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Avatar, Tag, Space, Typography, Badge, 
  Empty, Spin, Alert, Row, Col, Input, Tabs, List, 
  Tooltip, Statistic, Progress, Divider, Timeline, Button, Dropdown
} from 'antd';
import { 
  UserOutlined, 
  CarOutlined, 
  ClockCircleOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  WarningOutlined,
  PieChartOutlined,
  DownOutlined
} from '@ant-design/icons';
import { DriverType } from '../../../types/driver';
import axiosInstance from '@/api/axiosInstance';
import dayjs from 'dayjs';
import { getDriverPhotoUrl } from '../photoUtils';

const { Text, Title, Paragraph } = Typography;

interface DriversOnRoadProps {
  drivers: DriverType[];
  loading: boolean;
  activeCars?: ActiveCar[];
}

interface ActiveCar {
  car_id: number;
  car_name: string;
  driver: {
    id: number;
    username: string;
    fullname: string;
    phone_number: string;
    photo: string | null;
    status: string;
    is_busy: boolean;
    rays_count: number;
    total_rays_usd: number;
  };
  rays_id: number;
  start_time: string;
  chiqimliklar: {
    id: number;
    driver_name: string;
    photo: string;
    price: number;
    description: string;
    created_at: string;
    driver: number;
    chiqimlar: number;
    currency: number;
  }[];
  referenslar: {
    id: number;
    driver_name: string;
    description: string;
    created_at: string;
    driver: number;
  }[];
  arizalar: {
    id: number;
    driver_name: string;
    description: string;
    created_at: string;
    driver: number;
  }[];
  total_expense_usd: number;
  details_expense_usd: {
    chiqimlik: number;
    optol: number;
    balon: number;
    balonfurgon: number;
    service: number;
  };
}

const DriversOnRoad: React.FC<DriversOnRoadProps> = ({
  loading: driversLoading,
  activeCars: propActiveCars
}) => {
  const [activeCars, setActiveCars] = useState<ActiveCar[]>([]);
  const [loading, setLoading] = useState(!propActiveCars);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  
  useEffect(() => {
    if (propActiveCars) {
      setActiveCars(propActiveCars);
      return;
    }
    
    const fetchActiveCars = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/car-active/');
        setActiveCars(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching active cars:', err);
        setError('Yo\'ldagi haydovchilar ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCars();
  }, [propActiveCars]);

  // Handle search filtering
  const getFilteredData = () => {
    if (!searchText) return activeCars;
    
    const lowercasedSearch = searchText.toLowerCase();
    return activeCars.filter(item => 
      item.driver.fullname.toLowerCase().includes(lowercasedSearch) ||
      item.driver.phone_number.includes(searchText) ||
      item.car_name.toLowerCase().includes(lowercasedSearch)
    );
  };

  // Format a currency value
  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('uz-UZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' ' + currency;
  };

  // Calculate total duration on road
  const calculateDuration = (startTime: string) => {
    const start = dayjs(startTime);
    const now = dayjs();
    const hours = now.diff(start, 'hour');
    const minutes = now.diff(start, 'minute') % 60;
    
    return `${hours} soat ${minutes} daqiqa`;
  };
  
  // Calculate expense percentage for progress bars
  const calculatePercentage = (value: number, total: number) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  // Render tab content for a record's details
  const renderDetailTabs = (record: ActiveCar) => {
    // Calculate total duration on road
    const duration = calculateDuration(record.start_time);
    
    // Calculate percentages for expense breakdown
    const expenses = record.details_expense_usd;
    const totalExpense = record.total_expense_usd || 0;
    
    return (
      <div className="detail-tabs-container" style={{ padding: '20px 0' }}>
        <Row gutter={[24, 24]}>
          {/* Overview Card */}
          <Col xs={24} lg={8}>
            <Card 
              title={<><CarOutlined /> Umumiy ma'lumot</>} 
              className="detail-card"
              variant="borderless"
              style={{ height: '100%', background: '#f8f9fa' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text type="secondary">Haydovchi:</Text>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                    <Avatar 
                      src={getDriverPhotoUrl(record.driver.photo) || undefined} 
                      size={48}
                      icon={!record.driver.photo && <UserOutlined />}
                    />
                    <div style={{ marginLeft: 12 }}>
                      <Text strong style={{ fontSize: 16 }}>{record.driver.fullname}</Text>
                      <div><Text type="secondary">{record.driver.phone_number}</Text></div>
                    </div>
                  </div>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="Reys ID" 
                      value={record.rays_id} 
                      prefix={<HistoryOutlined />} 
                      valueStyle={{ fontSize: 18 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Transport" 
                      value={record.car_name}
                      prefix={<CarOutlined />}
                      valueStyle={{ fontSize: 18 }}
                    />
                  </Col>
                </Row>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Yo'lga chiqqan vaqt:</Text>
                    <div style={{ margin: '4px 0' }}>
                      <Tag color="blue" icon={<ClockCircleOutlined />} style={{ padding: '4px 8px' }}>
                        {dayjs(record.start_time).format('DD.MM.YYYY HH:mm')}
                      </Tag>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">Yo'lda bo'lgan vaqt:</Text>
                    <div style={{ margin: '4px 0' }}>
                      <Tag color="orange" icon={<HistoryOutlined />} style={{ padding: '4px 8px' }}>
                        {duration}
                      </Tag>
                    </div>
                  </div>
                </Space>
              </Space>
            </Card>
          </Col>
          
          {/* Expenses Card */}
          <Col xs={24} lg={16}>
            <Card 
              title={<span><DollarOutlined /> Xarajat va ma'lumotlar</span>}
              className="detail-card"
              variant="borderless"
            >
              <Tabs defaultActiveKey="1" type="card" items={[
                {
                  key: "1",
                  label: (
                    <span>
                      <DollarOutlined /> Xarajatlar ({record.chiqimliklar.length})
                    </span>
                  ),
                  children: (
                    <>
                      <div className="expense-details" style={{ marginBottom: 20, background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                        <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                          <Text strong><DollarOutlined /> Xarajat tafsilotlari</Text>
                          <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{formatCurrency(totalExpense)}</Text>
                        </div>
                        
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                          <Text type="secondary">Barcha xarajatlar</Text>
                        </div>
                        
                        {/* Service expense */}
                        {expenses?.service > 0 && (
                          <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                            <Text>Xizmat</Text>
                            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(expenses.service)}</Text>
                          </div>
                        )}
                        
                        {/* Chiqimlik expense */}
                        {expenses?.chiqimlik > 0 && (
                          <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                            <Text>Chiqimlik</Text>
                            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(expenses.chiqimlik)}</Text>
                          </div>
                        )}
                        
                        {/* Optol expense */}
                        {expenses?.optol > 0 && (
                          <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                            <Text>Optol</Text>
                            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(expenses.optol)}</Text>
                          </div>
                        )}
                        
                        {/* Balon expense */}
                        {expenses?.balon > 0 && (
                          <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                            <Text>Balon</Text>
                            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(expenses.balon)}</Text>
                          </div>
                        )}
                        
                        {/* Balonfurgon expense */}
                        {expenses?.balonfurgon > 0 && (
                          <div style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Furgon balon</Text>
                            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(expenses.balonfurgon)}</Text>
                          </div>
                        )}
                      </div>
                      
                      {record.chiqimliklar.length > 0 ? (
                        <Timeline style={{ marginTop: 16 }}>
                          {record.chiqimliklar.map((item) => (
                            <Timeline.Item 
                              key={item.id} 
                              color="red" 
                              dot={<DollarOutlined style={{ fontSize: '16px' }} />}
                            >
                              <Card 
                                size="small" 
                                style={{ marginBottom: 8, borderLeft: '2px solid #ff4d4f' }}
                                variant="borderless"
                              >
                                <div style={{ marginBottom: 8 }}>
                                  <Text strong>{item.driver_name}</Text>
                                  <Text type="secondary" style={{ marginLeft: 8 }}>
                                    {dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}
                                  </Text>
                                </div>
                                <Paragraph>{item.description}</Paragraph>
                                <Tag color="red">{formatCurrency(item.price)}</Tag>
                              </Card>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      ) : (
                        <Empty description="Xarajatlar mavjud emas" />
                      )}
                    </>
                  )
                },
                {
                  key: "2",
                  label: (
                    <span>
                      <FileTextOutlined /> Referenslar ({record.referenslar.length})
                    </span>
                  ),
                  children: (
                    <>
                      {record.referenslar.length > 0 ? (
                        <Timeline style={{ marginTop: 16 }}>
                          {record.referenslar.map((item) => (
                            <Timeline.Item 
                              key={item.id} 
                              color="blue" 
                              dot={<FileTextOutlined style={{ fontSize: '16px' }} />}
                            >
                              <Card 
                                size="small" 
                                style={{ marginBottom: 8, borderLeft: '2px solid #1890ff' }}
                                variant="borderless"
                              >
                                <div style={{ marginBottom: 8 }}>
                                  <Text strong>{item.driver_name}</Text>
                                  <Text type="secondary" style={{ marginLeft: 8 }}>
                                    {dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}
                                  </Text>
                                </div>
                                <Paragraph>{item.description}</Paragraph>
                              </Card>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      ) : (
                        <Empty description="Referenslar mavjud emas" />
                      )}
                    </>
                  )
                },
                {
                  key: "3",
                  label: (
                    <span>
                      <MessageOutlined /> Arizalar ({record.arizalar.length})
                    </span>
                  ),
                  children: (
                    <>
                      {record.arizalar.length > 0 ? (
                        <Timeline style={{ marginTop: 16 }}>
                          {record.arizalar.map((item) => (
                            <Timeline.Item 
                              key={item.id} 
                              color="green" 
                              dot={<MessageOutlined style={{ fontSize: '16px' }} />}
                            >
                              <Card 
                                size="small" 
                                style={{ marginBottom: 8, borderLeft: '2px solid #52c41a' }}
                                variant="borderless"
                              >
                                <div style={{ marginBottom: 8 }}>
                                  <Text strong>{item.driver_name}</Text>
                                  <Text type="secondary" style={{ marginLeft: 8 }}>
                                    {dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}
                                  </Text>
                                </div>
                                <Paragraph>{item.description}</Paragraph>
                              </Card>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      ) : (
                        <Empty description="Arizalar mavjud emas" />
                      )}
                    </>
                  )
                }
              ]} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const columns = [
    {
      title: 'Haydovchi',
      key: 'driver',
      fixed: 'left',
      width: 240,
      render: (_: any, record: ActiveCar) => {
        return (
          <Space>
            <div style={{ position: 'relative' }}>
              <Avatar
                src={getDriverPhotoUrl(record.driver.photo) || undefined}
                size="large"
                icon={!record.driver.photo && <UserOutlined />}
                style={{
                  backgroundColor: record.driver.photo ? 'transparent' : '#1890ff',
                }}
              >
                {!record.driver.photo && record.driver.fullname?.charAt(0)}
              </Avatar>
              <Badge 
                status="processing" 
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>
                {record.driver.fullname}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {record.driver.phone_number}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Mashina',
      key: 'car',
      width: 180,
      render: (_: any, record: ActiveCar) => (
        <Tag color="blue" icon={<CarOutlined />} style={{ padding: '4px 8px' }}>
          {record.car_name}
        </Tag>
      ),
    },
    {
      title: 'Reys ID',
      dataIndex: 'rays_id',
      key: 'rays_id',
      width: 100,
      render: (id: number) => (
        <Tag color="cyan" style={{ fontWeight: 'bold' }}>#{id}</Tag>
      ),
    },
    {
      title: 'Boshlanish vaqti',
      key: 'start_time',
      width: 180,
      render: (_: any, record: ActiveCar) => (
        <Space direction="vertical" size={0}>
          <Text>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            {dayjs(record.start_time).format('DD.MM.YYYY HH:mm')}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {calculateDuration(record.start_time)} yo'lda
          </Text>
        </Space>
      ),
    },
    {
      title: 'Umumiy xarajat',
      key: 'total_expense',
      width: 160,
      render: (_: any, record: ActiveCar) => (
        <Text style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '15px' }}>
          <DollarOutlined style={{ marginRight: 4 }} /> 
          {formatCurrency(record.total_expense_usd || 0)}
        </Text>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: () => (
        <Tag color="processing" icon={<CarOutlined />} style={{ padding: '4px 8px', fontSize: '13px' }}>
          Yo`lda
        </Tag>
      ),
    },
  ];

  if (loading || driversLoading) {
    return (
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 16 }}>
            Yo`ldagi haydovchilar malumotlari yuklanmoqda...
          </Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="Xatolik"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => window.location.reload()}>
              Qayta yuklash
            </Button>
          }
        />
      </Card>
    );
  }

  const filteredData = getFilteredData();
  
  // Calculate total expenses
  const totalExpenses = filteredData.reduce((sum, item) => sum + (item.total_expense_usd || 0), 0);
  const activeDrivers = filteredData.length;

  return (
    <div className="drivers-on-road">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            className="info-card" 
            style={{ 
              background: 'linear-gradient(to right, #1890ff, #69c0ff)',
              color: 'white',
              borderRadius: '8px',
              marginBottom: 16
            }}
          >
            <Space align="start">
              <InfoCircleOutlined style={{ fontSize: 24, color: 'white' }} />
              <div>
                <Text strong style={{ color: 'white', fontSize: '16px' }}>
                  Yo`ldagi haydovchilar ma'lumotlar paneli
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  Bu yerda hozirda yo`lda bo`lgan haydovchilar va ularning reyslari haqida ma`lumot
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card variant="borderless" style={{ background: '#f6ffed', borderRadius: '8px' }}>
            <Statistic
              title={<span style={{ fontSize: '14px' }}>Yo'ldagi haydovchilar</span>}
              value={activeDrivers}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card variant="borderless" style={{ background: '#fff2e8', borderRadius: '8px' }}>
            <Statistic
              title={<span style={{ fontSize: '14px' }}>Umumiy xarajatlar</span>}
              value={totalExpenses}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card variant="borderless" style={{ background: '#e6f7ff', borderRadius: '8px' }}>
            <Statistic
              title={<span style={{ fontSize: '14px' }}>Joriy reys ID</span>}
              value={filteredData[0]?.rays_id || 0}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card variant="borderless" style={{ background: '#f9f0ff', borderRadius: '8px' }}>
            <Statistic
              title={<span style={{ fontSize: '14px' }}>Referenslar</span>}
              value={filteredData.reduce((sum, item) => sum + item.referenslar.length, 0)}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card 
        title={
          <Space>
            <CarOutlined style={{ color: '#1890ff' }} />
            <Title level={5} style={{ margin: 0 }}>Yo`ldagi haydovchilar ({filteredData.length})</Title>
          </Space>
        }
        className="drivers-on-road-card"
        style={{ borderRadius: '8px' }}
        extra={
          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
        }
      >
        {filteredData.length > 0 ? (
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="rays_id"
            pagination={{ 
              pageSize: 10, 
              showTotal: (total) => `Jami ${total} haydovchi`,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'] 
            }}
            scroll={{ x: 1200 }}
            expandable={{
              expandedRowRender: renderDetailTabs,
              expandRowByClick: true,
              columnWidth: 48,
              expandedRowKeys: expandedRows,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRows([record.rays_id]);
                } else {
                  setExpandedRows([]);
                }
              },
              expandIcon: ({ expanded, onExpand, record }) => (
                <Tooltip title={expanded ? "Yopish" : "Batafsil ma'lumot"}>
                  {expanded ? (
                    <ExclamationCircleOutlined 
                      onClick={(e) => onExpand(record, e)}
                      style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px' }}
                    />
                  ) : (
                    <InfoCircleOutlined 
                      onClick={(e) => onExpand(record, e)}
                      style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px' }}
                    />
                  )}
                </Tooltip>
              )
            }}
            rowClassName={() => 'driver-row'}
            className="custom-table"
          />
        ) : (
          <Empty 
            description={
              <Space direction="vertical" align="center">
                <Text>Yo`ldagi haydovchilar mavjud emas</Text>
                <Button type="primary" onClick={() => window.location.reload()}>
                  Qayta yuklash
                </Button>
              </Space>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
      
      <style jsx global>{`
        .driver-row:hover {
          background-color: #f0f7ff;
          transition: background-color 0.3s;
        }
        .custom-table .ant-table-row-expand-icon-cell {
          padding-right: 0;
        }
        .detail-card {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }
        .detail-tabs-container .ant-tabs-nav {
          margin-bottom: 16px;
        }
        .detail-tabs-container .ant-timeline {
          margin-top: 16px;
          margin-left: 8px;
        }
        .detail-tabs-container .ant-card-body {
          padding: 16px;
        }
        
        /* Expense details styling */
        .expense-details-table {
          padding: 4px 0;
        }
        .expense-row {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 2px 0;
          margin-bottom: 2px;
        }
        .expense-row:last-child {
          margin-bottom: 0;
        }
        .expense-row .ant-tag {
          margin-right: 8px;
          padding: 0 7px;
          line-height: 20px;
          font-weight: 500;
          font-size: 12px;
          min-width: 60px;
          text-align: center;
        }
        .expense-spacer {
          flex: 1;
        }
        .expense-value {
          font-weight: 500;
          text-align: right;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default DriversOnRoad; 