"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Input, Button, Modal, Form, Space, Tooltip, Statistic, Tag, Empty, Divider, Progress, Avatar, Tabs, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UserOutlined, DollarOutlined, 
   ExclamationCircleOutlined, HistoryOutlined, TrophyOutlined, BellOutlined, WalletOutlined } from '@ant-design/icons';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { clientApi } from '../../api/client/clientApi';
import { tripApi } from '../../api/trip/tripApi';
import { ClientData } from '../../types/client';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../../api/axiosInstance';

const {  Text } = Typography;
const { confirm } = Modal;

// Client debt interface
interface ClientDebt {
  client_id: number;
  fullname: string;
  client_company: string;
  expected_usd: number;
  paid_usd: number;
  remaining_usd: number;
}

export const Clients = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  // State for clients and trips data
  const [clientsData, setClientsData] = useState<{
    data: ClientData[];
    total: number;
    isLoading: boolean;
    error: string | null;
  }>({
    data: [],
    total: 0,
    isLoading: true,
    error: null
  });

  // State for client debts
  const [clientDebts, setClientDebts] = useState<{
    data: ClientDebt[];
    isLoading: boolean;
    error: string | null;
  }>({
    data: [],
    isLoading: true,
    error: null
  });

  const [tripsData, setTripsData] = useState<Array<Record<string, any>>>([]);

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setClientsData(prev => ({ ...prev, isLoading: true, error: null }));
        const response = await clientApi.getAllClients({
          search: searchTerm,
          page: 1,
          pageSize: 100
        });
        setClientsData({
          data: response.data,
          total: response.total,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClientsData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Mijozlar ma'lumotlarini yuklashda xatolik yuz berdi" 
        }));
      }
    };

    fetchClients();
  }, [searchTerm]);

  // Fetch client debts
  useEffect(() => {
    const fetchClientDebts = async () => {
      try {
        setClientDebts(prev => ({ ...prev, isLoading: true, error: null }));
        const response = await axiosInstance.get('/casa/all-debts/');
        setClientDebts({
          data: response.data || [],
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching client debts:', error);
        setClientDebts(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Mijozlar qarzdorlik ma'lumotlarini yuklashda xatolik yuz berdi" 
        }));
      }
    };

    fetchClientDebts();
  }, []);

  // Fetch trips data
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setTripsData([]);
        const response = await tripApi.getAllTrips();
        setTripsData(response.data || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, []);

  // Get top clients by revenue
  const getTopClients = (clients: ClientData[], trips: Array<Record<string, any>>) => {
    const clientRevenue: {[key: number]: number} = {};
    
    // Calculate total revenue for each client
    trips.forEach(trip => {
      if (trip.client_id && trip.cost) {
        const clientId = trip.client_id;
        if (!clientRevenue[clientId]) {
          clientRevenue[clientId] = 0;
        }
        clientRevenue[clientId] += trip.cost;
      }
    });
    
    // Map to array and sort by revenue
    const topClients = clients
      .filter(client => clientRevenue[client.id || 0])
      .map(client => ({
        ...client,
        revenue: clientRevenue[client.id || 0] || 0,
        tripCount: trips.filter(trip => trip.client_id === client.id).length
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return topClients;
  };
  
  // Handle row click to view client details
  const handleRowClick = (record: ClientData) => {
    if (record.id) {
      router.push(`/modules/ceo/clients/${record.id}`);
    }
  };

  // Client statistics
  const clientStats = useMemo(() => {
    if (!clientsData?.data) return { total: 0, active: 0, revenue: 0 };

    const clients = clientsData.data;
    const activeTrips = tripsData.filter(trip => trip.client_id && trip.status !== 'completed');
    const activeClientsSet = new Set(activeTrips.map(trip => trip.client_id));
    const activeClientsCount = activeClientsSet.size;
    
    const totalClientsRevenue = tripsData.reduce((sum, trip) => {
      return sum + (trip.cost || 0);
    }, 0);

    const recentClients = [...clients]
      .sort((a, b) => {
        const aTrips = tripsData.filter(trip => trip.client_id === a.id);
        const bTrips = tripsData.filter(trip => trip.client_id === b.id);
        
        const aLastTrip = aTrips.length > 0 
          ? Math.max(...aTrips.map(t => new Date(t.start_date || '').getTime()))
          : 0;
        
        const bLastTrip = bTrips.length > 0 
          ? Math.max(...bTrips.map(t => new Date(t.start_date || '').getTime()))
          : 0;
        
        return bLastTrip - aLastTrip;
      })
      .slice(0, 5);

    const activeClientsPercentage = clients.length > 0 
      ? (activeClientsCount / clients.length) * 100 
      : 0;

    return {
      total: clients.length,
      active: activeClientsCount,
      activePercentage: activeClientsPercentage,
      revenue: totalClientsRevenue,
      topClients: getTopClients(clients, tripsData),
      recentClients: recentClients
    };
  }, [clientsData, tripsData]);

  // Enhanced client data with debt information
  const enhancedClientsData = useMemo(() => {
    if (!clientsData?.data) return [];
    
    return clientsData.data.map(client => {
      const clientTrips = tripsData.filter(trip => trip.client_id === client.id);
      const totalSpent = clientTrips.reduce((sum, trip) => sum + (trip.cost || 0), 0);
      const lastTripDate = clientTrips.length > 0 
        ? new Date(Math.max(...clientTrips.map(t => new Date(t.start_date || '').getTime())))
        : null;
      
      // Find debt information for this client
      const debtInfo = clientDebts.data.find(debt => debt.client_id === client.id);
      
      return {
        ...client,
        tripCount: clientTrips.length,
        totalSpent,
        lastTripDate,
        status: clientTrips.some(trip => trip.status !== 'completed') ? 'active' : 'inactive',
        expectedAmount: debtInfo?.expected_usd || 0,
        paidAmount: debtInfo?.paid_usd || 0,
        remainingAmount: debtInfo?.remaining_usd || 0,
        hasDebt: debtInfo ? debtInfo.remaining_usd > 0 : false
      };
    });
  }, [clientsData, tripsData, clientDebts.data]);

  // Add sequential IDs to clients
  const clientsWithSequentialIds = useMemo(() => {
    return enhancedClientsData.map((client, index) => ({
      ...client,
      sequentialId: index + 1 // Add sequential ID starting from 1
    }));
  }, [enhancedClientsData]);

  // Handle modal actions
  const showModal = (client?: ClientData) => {
    if (client) {
      setEditingClient(client);
      form.setFieldsValue({
        first_name: client.first_name,
        last_name: client.last_name,
        number: client.number,
        city: client.city,
        company: client.company || ''
      });
    } else {
      setEditingClient(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (editingClient?.id) {
        await clientApi.updateClient(editingClient.id, values);
      } else {
        await clientApi.createClient(values);
      }
      setIsModalVisible(false);
      form.resetFields();
      
      // Refresh clients
      const response = await clientApi.getAllClients({
        search: searchTerm,
        page: 1,
        pageSize: 100
      });
      setClientsData({
        data: response.data,
        total: response.total,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Mijozni o\'chirishni istaysizmi?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bu amal qaytarilmaydi va barcha ma\'lumotlar yo\'qoladi.',
      okText: 'Ha',
      okType: 'danger',
      cancelText: 'Yo\'q',
      async onOk() {
        try {
          await clientApi.deleteClient(id);
          
          // Refresh clients
          const response = await clientApi.getAllClients({
            search: searchTerm,
            page: 1,
            pageSize: 100
          });
          setClientsData({
            data: response.data,
            total: response.total,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Error deleting client:', error);
        }
      },
    });
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Format currency function
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "0";
    return amount.toLocaleString();
  };

  // Column definitions for the clients table
  const getColumns = () => [
    {
      title: '#',
      dataIndex: 'sequentialId',
      key: 'sequentialId',
      width: 60,
    },
    {
      title: 'Mijoz ismi',
      dataIndex: 'first_name',
      key: 'fullName',
      render: (text: string, record: any) => (
        <div className="client-name">
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span>{`${record.first_name} ${record.last_name}`}</span>
          {record.hasDebt && (
            <Tag color="red" style={{ marginLeft: 8 }}>
              <WalletOutlined /> Qarzdor
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Kompaniya',
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => text || '-',
    },
    {
      title: 'Telefon',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Shahar',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Kutilayotgan to\'lov',
      dataIndex: 'expectedAmount',
      key: 'expectedAmount',
      align: 'right' as const,
      render: (amount: number) => `$${formatCurrency(amount)}`,
    },
    {
      title: 'To\'langan to\'lov',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      align: 'right' as const,
      render: (amount: number) => `$${formatCurrency(amount)}`,
    },
    {
      title: 'Qolgan to\'lov',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      align: 'right' as const,
      render: (amount: number, record: any) => (
        <span style={{ color: amount > 0 ? '#cf1322' : '#3f8600' }}>
          ${formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Harakatlar',
      key: 'actions',
      render: (_: any, record: ClientData) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                showModal(record);
              }}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  // Calculate debt statistics
  const debtStats = useMemo(() => {
    if (!clientDebts.data || clientDebts.data.length === 0) {
      return {
        totalDebt: 0,
        clientsWithDebt: 0,
        totalPaid: 0,
        totalExpected: 0
      };
    }

    const totalExpected = clientDebts.data.reduce((sum, debt) => sum + (debt.expected_usd || 0), 0);
    const totalPaid = clientDebts.data.reduce((sum, debt) => sum + (debt.paid_usd || 0), 0);
    const totalDebt = clientDebts.data.reduce((sum, debt) => sum + (debt.remaining_usd || 0), 0);
    const clientsWithDebt = clientDebts.data.filter(debt => debt.remaining_usd > 0).length;

    return {
      totalDebt,
      clientsWithDebt,
      totalPaid,
      totalExpected
    };
  }, [clientDebts.data]);

  // Dashboard content
  const renderDashboard = () => (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="Jami mijozlar"
              value={clientStats.total}
              prefix={<TeamOutlined />}
            />
            <Progress 
              percent={Math.round(clientStats.activePercentage)} 
              status="active" 
              strokeColor="#1890ff"
              size="small"
              style={{ marginTop: 16 }}
            />
            <div className="stat-description">
              <Text type="secondary">{clientStats.active} faol mijoz</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="Jami qarzdorlik"
              value={formatCurrency(debtStats.totalDebt)}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: debtStats.totalDebt > 0 ? '#cf1322' : '#3f8600' }}
            />
            <div className="stat-description">
              <Text type="secondary">{debtStats.clientsWithDebt} mijoz qarzi bor</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="To'langan summa"
              value={formatCurrency(debtStats.totalPaid)}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#3f8600' }}
            />
            <div className="stat-description">
              <Text type="secondary">Jami kutilgan: ${formatCurrency(debtStats.totalExpected)}</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="dashboard-card" bordered={false}>
            <Statistic
              title="O'rtacha to'lov"
              value={clientStats.total > 0 ? formatCurrency(debtStats.totalPaid / clientStats.total) : '0'}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div className="stat-description">
              <Text type="secondary">Har bir mijoz uchun</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<div><TrophyOutlined /> Qarzdor mijozlar</div>} 
            className="dashboard-card"
            extra={
              <Tooltip title="Batafsil ma'lumot">
                <Button type="link" onClick={() => setActiveTab('clients')}>
                  Barcha mijozlar
                </Button>
              </Tooltip>
            }
          >
            {clientDebts.isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Yuklanyapti...
              </div>
            ) : clientDebts.error ? (
              <Alert type="error" message={clientDebts.error} />
            ) : (
              <Table 
                dataSource={clientDebts.data
                  .filter(client => client.remaining_usd > 0)
                  .sort((a, b) => b.remaining_usd - a.remaining_usd)
                  .slice(0, 5)
                }
                rowKey="client_id"
                pagination={false}
                columns={[
                  {
                    title: 'Mijoz',
                    dataIndex: 'fullname',
                    key: 'fullname',
                    render: (text, record) => (
                      <div>
                        <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                        {text} 
                        <div>
                          <small style={{ color: '#8c8c8c' }}>{record.client_company || ''}</small>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Kutilgan summa',
                    dataIndex: 'expected_usd',
                    key: 'expected_usd',
                    align: 'right' as const,
                    render: (amount) => `$${formatCurrency(amount)}`
                  },
                  {
                    title: "To'langan",
                    dataIndex: 'paid_usd',
                    key: 'paid_usd',
                    align: 'right' as const,
                    render: (amount) => `$${formatCurrency(amount)}`
                  },
                  {
                    title: 'Qolgan summa',
                    dataIndex: 'remaining_usd',
                    key: 'remaining_usd',
                    align: 'right' as const,
                    render: (amount) => <span style={{ color: '#cf1322', fontWeight: 'bold' }}>${formatCurrency(amount)}</span>
                  },
                  {
                    title: 'Harakatlar',
                    key: 'actions',
                    render: (_, record) => (
                      <Button 
                        size="small" 
                        type="primary"
                        onClick={() => router.push(`/modules/ceo/clients/${record.client_id}`)}
                      >
                        Ko'rish
                      </Button>
                    )
                  }
                ]}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<div><HistoryOutlined /> So'nggi faol mijozlar</div>} 
            className="dashboard-card"
          >
            {clientsData.isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Yuklanyapti...
              </div>
            ) : clientsData.error ? (
              <Alert type="error" message={clientsData.error} />
            ) : clientStats.recentClients.length === 0 ? (
              <Empty description="Faol mijozlar mavjud emas" />
            ) : (
              <div>
                {clientStats.recentClients.map((client, index) => (
                  <div 
                    key={client.id} 
                    className="recent-client-item"
                    onClick={() => router.push(`/modules/ceo/clients/${client.id}`)}
                  >
                    <div className="recent-client-info">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <div className="recent-client-name">
                        {client.first_name} {client.last_name}
                        <div className="recent-client-company">{client.company || '-'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );

  // Clients table content
  const renderClientsTable = () => (
    <Card title="Mijozlar ro'yxati" bordered={false}>
      <div className="table-actions">
        <Input
          placeholder="Mijozni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300, marginBottom: 16 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Yangi mijoz
        </Button>
      </div>

      {clientsData.error && (
        <Alert
          message="Xatolik"
          description={clientsData.error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        dataSource={clientsWithSequentialIds}
        columns={getColumns()}
        rowKey="id"
        loading={clientsData.isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' }
        })}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingClient ? "Mijozni tahrirlash" : "Yangi mijoz qo'shish"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Bekor qilish
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
          >
            Saqlash
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="first_name"
            label="Ism"
            rules={[{ required: true, message: "Iltimos, mijozning ismini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Familiya"
            rules={[{ required: true, message: "Iltimos, mijozning familiyasini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="number"
            label="Telefon raqami"
            rules={[{ required: true, message: "Iltimos, mijozning telefon raqamini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="Shahar"
            rules={[{ required: true, message: "Iltimos, mijozning shahrini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="company"
            label="Kompaniya"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );

  return (
    <DashboardLayout title="Mijozlar boshqaruvi">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        items={[
          {
            key: "dashboard",
            label: (
              <span>
                <DollarOutlined /> Dashboard
              </span>
            ),
            children: renderDashboard()
          },
          {
            key: "clients",
            label: (
              <span>
                <TeamOutlined /> Mijozlar ro'yxati
              </span>
            ),
            children: renderClientsTable()
          }
        ]}
      />

      <style jsx global>{`
        .dashboard-card {
          height: 100%;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }
        
        .client-name {
          display: flex;
          align-items: center;
        }
        
        .stat-description {
          margin-top: 8px;
        }
        
        .table-actions {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .recent-client-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .recent-client-item:hover {
          background-color: #f9f9f9;
        }
        
        .recent-client-info {
          display: flex;
          align-items: center;
        }
        
        .recent-client-name {
          margin-left: 12px;
        }
        
        .recent-client-company {
          font-size: 12px;
          color: #8c8c8c;
        }
      `}</style>
    </DashboardLayout>
  );
}; 