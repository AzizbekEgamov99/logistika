'use client';
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Space, 
  Tag,
  Progress,
  Avatar,
  Row,
  Col,
  Tabs,
  Modal,
  Divider,
  Statistic,
  Spin,
  Empty,
  Select,
  Badge,
  Segmented,
  List,
  Drawer,
  message
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  CarOutlined,
  TeamOutlined,
  PlusOutlined,
  ExportOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { useAllClientDebts } from '../../../hooks/useCash';
import { useClients } from '../../../hooks/useClients';
import { useRaysClientsMap } from '../../../hooks/useCash';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// Client status types
enum ClientStatus {
  ALL = 'all',
  DEBT = 'debt',
  PAID = 'paid'
}

// Filter/Sort options
type SortOption = 'name-asc' | 'name-desc' | 'debt-asc' | 'debt-desc' | 'recent';

const ClientAccounts: React.FC = () => {
  // State
  const [searchText, setSearchText] = useState<string>('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [clientStatus, setClientStatus] = useState<ClientStatus>(ClientStatus.ALL);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);

  // Data hooks
  const { clientDebts, isLoading: isDebtsLoading } = useAllClientDebts();
  const { data: clientsData, isLoading: isClientsLoading } = useClients();
  const { raysClientsMap, isLoading: isMapLoading } = useRaysClientsMap();

  const isLoading = isDebtsLoading || isClientsLoading || isMapLoading;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const showClientDetails = (client: any) => {
    setSelectedClient(client);
    setDrawerVisible(true);
  };

  // Find client's rays (trips)
  const getClientRays = (clientId: number) => {
    if (!raysClientsMap) return [];
    
    return raysClientsMap
      .filter(rayMap => rayMap.clients.some(client => client.id === clientId))
      .map(rayMap => rayMap.rays_details)
      .filter(Boolean);
  };

  // Process and combine client data
  const processedClients = useMemo(() => {
    // Return early if data isn't loaded
    if (!clientsData?.data || !clientDebts) return [];
    
    // Combine client info with debt info
    return clientsData.data.map(client => {
      const debtInfo = clientDebts.find(d => d.client__id === client.id);
      return {
        ...client,
        total_debt: debtInfo?.total_debt || 0,
        payment_status: debtInfo?.total_debt > 0 ? 'debt' : 'paid',
        last_payment_date: debtInfo?.last_payment_date || null
      };
    });
  }, [clientsData, clientDebts]);

  // Apply filters and sorting
  const displayedClients = useMemo(() => {
    if (!processedClients.length) return [];
    
    // Filter by status
    let filtered = [...processedClients];
    
    if (clientStatus === ClientStatus.DEBT) {
      filtered = filtered.filter(c => c.total_debt > 0);
    } else if (clientStatus === ClientStatus.PAID) {
      filtered = filtered.filter(c => c.total_debt <= 0);
    }
    
    // Apply search
    if (searchText) {
      filtered = filtered.filter(client => 
        (client.first_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (client.last_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (client.company || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (client.number || '').includes(searchText)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'name-asc':
        return filtered.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
      case 'name-desc':
        return filtered.sort((a, b) => `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`));
      case 'debt-asc':
        return filtered.sort((a, b) => a.total_debt - b.total_debt);
      case 'debt-desc':
        return filtered.sort((a, b) => b.total_debt - a.total_debt);
      case 'recent':
        return filtered.sort((a, b) => {
          if (!a.last_payment_date) return 1;
          if (!b.last_payment_date) return -1;
          return new Date(b.last_payment_date).getTime() - new Date(a.last_payment_date).getTime();
        });
      default:
        return filtered;
    }
  }, [processedClients, clientStatus, searchText, sortOption]);
  
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!processedClients.length) {
      return { totalClients: 0, totalDebt: 0, debtPercentage: 0, debtorsCount: 0 };
    }
    
    const debtors = processedClients.filter(c => c.total_debt > 0);
    const totalDebt = debtors.reduce((sum, client) => sum + client.total_debt, 0);
    
    return {
      totalClients: processedClients.length,
      totalDebt,
      debtPercentage: Math.round((debtors.length / processedClients.length) * 100),
      debtorsCount: debtors.length
    };
  }, [processedClients]);

  // Handle export options
  const handleExport = (type: 'excel' | 'print') => {
    if (type === 'excel') {
      message.success('Ma\'lumotlar Excel formatida yuklab olishga tayyorlanmoqda...');
    } else {
      window.print();
    }
    setExportModalVisible(false);
  };

  // Render client card for card view
  const renderClientCard = (client: any) => {
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`;
    const isDebtor = client.total_debt > 0;
    const debtColor = isDebtor ? '#ff4d4f' : '#52c41a';
    const statusText = isDebtor ? 'Qarzdor' : 'To\'langan';
    const statusColor = isDebtor ? 'error' : 'success';
    const trips = getClientRays(client.id);
    
    return (
      <Card 
        className={`client-card ${isDebtor ? 'client-card-debtor' : 'client-card-paid'}`}
        hoverable
        onClick={() => showClientDetails(client)}
      >
        <div className="client-card-header">
          <Avatar size={50} icon={<UserOutlined />} className="client-avatar" />
          <div className="client-card-info">
            <div className="client-name">{fullName}</div>
            <div className="client-company">{client.company || 'Shaxsiy mijoz'}</div>
          </div>
          <Badge 
            count={statusText} 
            style={{ 
              backgroundColor: isDebtor ? '#ff4d4f' : '#52c41a',
              fontSize: '12px',
              padding: '0 8px'
            }} 
          />
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div className="client-card-content">
          <div className="client-contact">
            {client.number && (
              <div className="client-phone">
                <PhoneOutlined /> {client.number}
              </div>
            )}
          </div>
          
          <div className="client-financial">
            <div className="client-debt-amount" style={{ color: debtColor }}>
              {formatCurrency(client.total_debt || 0)}
            </div>
            {trips.length > 0 && (
              <div className="client-trips">
                <CarOutlined /> {trips.length} reys
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="client-accounts">
      <Spin spinning={isLoading}>
        {/* Header with summary stats */}
        <Row gutter={[24, 24]} className="client-stats-row">
          <Col xs={24} sm={12} md={6}>
            <Card className="summary-card total-clients-card">
              <Statistic
                title="Jami mijozlar"
                value={summaryStats.totalClients}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="summary-card debtors-card">
              <Statistic
                title="Qarzdorlar soni"
                value={summaryStats.debtorsCount}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <div className="stat-percentage">
                {summaryStats.debtPercentage}% mijozlardan
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="summary-card debt-card">
              <Statistic
                title="Jami qarz summasi"
                value={summaryStats.totalDebt}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="USD"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="summary-card action-card">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                block
                style={{ marginBottom: 10 }}
              >
                Yangi mijoz qo`shish
              </Button>
              <Button 
                icon={<ExportOutlined />} 
                block
                onClick={() => setExportModalVisible(true)}
              >
                Hisobotni yuklab olish
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Filters and controls */}
        <Card className="filter-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <Input
                placeholder="Mijoz nomi, telefon yoki kompaniya bo'yicha qidirish..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                allowClear
              />
            </Col>
            <Col xs={12} md={5}>
              <Select
                placeholder="Status bo'yicha"
                style={{ width: '100%' }}
                value={clientStatus}
                onChange={value => setClientStatus(value)}
              >
                <Option value={ClientStatus.ALL}>Barcha mijozlar</Option>
                <Option value={ClientStatus.DEBT}>Faqat qarzdorlar</Option>
                <Option value={ClientStatus.PAID}>To`langan</Option>
              </Select>
            </Col>
            <Col xs={12} md={5}>
              <Select
                placeholder="Saralash"
                style={{ width: '100%' }}
                value={sortOption}
                onChange={value => setSortOption(value)}
              >
                <Option value="name-asc">Ism (A-Z)</Option>
                <Option value="name-desc">Ism (Z-A)</Option>
                <Option value="debt-desc">Qarz (Ko`p-oz)</Option>
                <Option value="debt-asc">Qarz (Oz-ko`p)</Option>
                <Option value="recent">So`nggi to`lovlar</Option>
              </Select>
            </Col>
            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Segmented
                options={[
                  {
                    value: 'card',
                    icon: <AppstoreOutlined />
                  },
                  {
                    value: 'table',
                    icon: <BarsOutlined />
                  }
                ]}
                value={viewMode}
                onChange={value => setViewMode(value as 'card' | 'table')}
              />
            </Col>
          </Row>
        </Card>

        {/* Main content */}
        <Card className="clients-content-card">
          {displayedClients.length > 0 ? (
            <>
              {viewMode === 'card' ? (
                <Row gutter={[16, 16]}>
                  {displayedClients.map(client => (
                    <Col xs={24} sm={12} md={8} lg={6} key={client.id}>
                      {renderClientCard(client)}
                    </Col>
                  ))}
                </Row>
              ) : (
                <Table
                  columns={[
    {
      title: 'Mijoz',
                      key: 'client',
                      render: (_, record) => (
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          <div>
                            <Text strong>{record.first_name} {record.last_name}</Text>
        <div>
                              <Text type="secondary">{record.company || 'Shaxsiy mijoz'}</Text>
                            </div>
        </div>
                        </Space>
      ),
    },
    {
                      title: 'Kontakt',
                      key: 'contact',
                      render: (_, record) => (
                        record.number ? (
                          <Space>
                            <PhoneOutlined />
                            <a href={`tel:${record.number}`}>{record.number}</a>
                          </Space>
                        ) : 'Ko\'rsatilmagan'
      ),
    },
    {
                      title: 'Qarz miqdori',
                      dataIndex: 'total_debt',
                      key: 'debt',
                      sorter: (a, b) => a.total_debt - b.total_debt,
                      render: (debt) => (
                        <Text strong style={{ color: debt > 0 ? '#ff4d4f' : '#52c41a' }}>
                          {formatCurrency(debt)}
        </Text>
      ),
    },
    {
                      title: 'Status',
      key: 'status',
                      render: (_, record) => {
                        if (record.total_debt <= 0) {
                          return <Tag color="success" icon={<CheckCircleOutlined />}>To`langan</Tag>;
                        } else {
                          return <Tag color="error" icon={<ClockCircleOutlined />}>Qarzdor</Tag>;
                        }
                      }
    },
    {
      title: 'Reyslar',
      key: 'trips',
                      render: (_, record) => {
                        const trips = getClientRays(record.id);
                        return trips.length > 0 ? 
                          <Tag color="processing" icon={<CarOutlined />}>{trips.length} reys</Tag> : 
                          <Tag>Yo`q</Tag>;
                      }
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
            <Button 
              type="primary" 
              size="small"
                          icon={<EyeOutlined />}
                          onClick={() => showClientDetails(record)}
                        >
                          Batafsil
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={displayedClients}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
              )}
            </>
          ) : (
            <Empty 
              description="Mijozlar topilmadi" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
      </Card>

        {/* Client Details Drawer */}
        <Drawer
          title="Mijoz ma'lumotlari"
          placement="right"
          width={750}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setDrawerVisible(false)} style={{ marginRight: 8 }}>
                Yopish
              </Button>
              <Button type="primary">
                Tahrirlash
              </Button>
            </div>
          }
        >
          {selectedClient && (
            <div className="client-details-content">
              <Row gutter={[24, 24]}>
                {/* Client header */}
                <Col span={24}>
                  <div className="client-header">
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div className="client-header-info">
                      <Title level={4}>
                        {selectedClient.first_name} {selectedClient.last_name}
                      </Title>
                      <Text type="secondary">{selectedClient.company || 'Shaxsiy mijoz'}</Text>
                      
                      <div className="client-badges">
                        {selectedClient.total_debt > 0 ? (
                          <Tag color="error" icon={<ClockCircleOutlined />}>Qarzdor</Tag>
                        ) : (
                          <Tag color="success" icon={<CheckCircleOutlined />}>To`langan</Tag>
                        )}
                        
                        {getClientRays(selectedClient.id).length > 0 && (
                          <Tag color="processing" icon={<CarOutlined />}>
                            {getClientRays(selectedClient.id).length} reys
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                
                {/* Financial info */}
                <Col xs={24} md={12}>
                  <Card title="Moliyaviy ma'lumotlar" bordered={false} className="detail-card financial-card">
                    <Statistic
                      title="Jami qarz miqdori"
                      value={selectedClient.total_debt || 0}
                      precision={2}
                      valueStyle={{ 
                        color: selectedClient.total_debt > 0 ? '#ff4d4f' : '#52c41a',
                        fontSize: '28px'
                      }}
                      prefix={<DollarOutlined />}
                      suffix="USD"
                    />
                    
                    {selectedClient.total_debt > 0 && (
                      <div className="payment-progress">
                        <Text>To`lov jarayoni:</Text>
                        <Progress 
                          percent={30} 
                          status="active" 
                          strokeColor={{ 
                            '0%': '#ff4d4f',
                            '100%': '#52c41a',
                          }}
                        />
                      </div>
                    )}
                    
                    <Divider />
                    
                    <Button type="primary" block>
                      To`lov qo`shish
                    </Button>
                  </Card>
                </Col>
                
                {/* Contact info */}
                <Col xs={24} md={12}>
                  <Card title="Aloqa ma'lumotlari" bordered={false} className="detail-card">
                    <List>
                      <List.Item>
                        <Space>
                          <PhoneOutlined /> 
                          <Text strong>Telefon:</Text>
                        </Space>
                        {selectedClient.number ? (
                          <a href={`tel:${selectedClient.number}`}>{selectedClient.number}</a>
                        ) : (
                          <Text type="secondary">Ko`rsatilmagan</Text>
                        )}
                      </List.Item>
                      
                      <List.Item>
                        <Space>
                          <MailOutlined /> 
                          <Text strong>Email:</Text>
                        </Space>
                        {selectedClient.email ? (
                          <a href={`mailto:${selectedClient.email}`}>{selectedClient.email}</a>
                        ) : (
                          <Text type="secondary">Ko`rsatilmagan</Text>
                        )}
                      </List.Item>
                      
                      <List.Item>
                        <Space>
                          <HomeOutlined /> 
                          <Text strong>Manzil:</Text>
                        </Space>
                        {selectedClient.address || <Text type="secondary">Ko`rsatilmagan</Text>}
                      </List.Item>
                    </List>
                  </Card>
                </Col>
                
                {/* Trips history */}
                <Col span={24}>
                  <Card 
                    title="Reyslar tarixi" 
                    bordered={false}
                    className="detail-card"
                    extra={<Text type="secondary">Jami: {getClientRays(selectedClient.id).length} ta reys</Text>}
                  >
                    {getClientRays(selectedClient.id).length > 0 ? (
        <Table 
                        size="small"
          pagination={false}
                        dataSource={getClientRays(selectedClient.id)}
                        columns={[
                          {
                            title: 'Reys ID',
                            dataIndex: 'id',
                            key: 'id',
                          },
                          {
                            title: 'Yo\'nalish',
                            key: 'route',
                            render: (_, record) => `${record.from1 || 'N/A'} → ${record.to_go || 'N/A'}`,
                          },
                          {
                            title: 'Sana',
                            dataIndex: 'created_at',
                            key: 'date',
                            render: (date) => dayjs(date).format('DD.MM.YYYY'),
                          },
                          {
                            title: 'Status',
                            dataIndex: 'is_completed',
                            key: 'status',
                            render: (isCompleted) => (
                              isCompleted ? 
                                <Tag color="success">Yakunlangan</Tag> : 
                                <Tag color="processing">Faol</Tag>
                            ),
                          },
                        ]}
                      />
                    ) : (
                      <Empty description="Reyslar mavjud emas" />
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Drawer>
        
        {/* Export Modal */}
        <Modal
          title="Hisobotni yuklab olish"
          visible={exportModalVisible}
          onCancel={() => setExportModalVisible(false)}
          footer={null}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              icon={<FileExcelOutlined />} 
              size="large" 
              block 
              onClick={() => handleExport('excel')}
            >
              Excel formatida yuklab olish
            </Button>
            <Button 
              icon={<PrinterOutlined />} 
              size="large" 
              block
              onClick={() => handleExport('print')}
            >
              Chop etish
            </Button>
          </Space>
      </Modal>
      </Spin>
    </div>
  );
};

export default ClientAccounts; 