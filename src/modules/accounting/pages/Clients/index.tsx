import React, { useState, useCallback } from 'react'
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  Button,
  Table,
  Popconfirm,
  Tooltip,
  Input,
  Dropdown,
  Segmented,
} from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
  BarsOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { useClients } from '../../hooks/useClients'
import { Client } from '../../types/client'
import { ClientModal } from './components/ClientModal'
import styles from './styles/clients.module.css'

const { Content } = Layout
const { Title, Text } = Typography
const { Search } = Input

export const ClientsPage: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const { data, isLoading, createClient, updateClient, deleteClient } =
    useClients({
      page: currentPage,
      pageSize,
      search: searchQuery,
    })

  const clients = Array.isArray(data?.data) ? data.data : []
  const total = data?.total || clients.length

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const handleAddClient = useCallback(() => {
    setSelectedClient(null)
    setIsModalVisible(true)
  }, [])

  const handleViewClient = useCallback((client: Client) => {
    if (client.id) {
      const basePath = pathname ? pathname.split('/').slice(0, 3).join('/') : '/modules/accounting';
      router.push(`${basePath}/clients/${client.id}/history`);
    }
  }, [router, pathname])

  const handleEditClient = useCallback((client: Client) => {
    setSelectedClient(client)
    setIsModalVisible(true)
  }, [])

  const handleDeleteClient = useCallback(
    async (id: number) => {
      try {
        await deleteClient(id)
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    },
    [deleteClient],
  )

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const handleModalSubmit = useCallback(
    async (values: Partial<Client>) => {
      try {
        if (selectedClient?.id) {
          await updateClient({ id: selectedClient.id, data: values });
        } else {
          const clientData = {
            first_name: values.first_name,
            last_name: values.last_name,
            city: values.city,
            number: values.number,
            company: values.company || '',
            status: 'active'
          };
          await createClient(clientData);
        }
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error saving client:', error);
      }
    },
    [selectedClient, createClient, updateClient],
  );

  const handlePageChange = useCallback((page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
  }, [])

  const columns = [
    {
      title: '№',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mijoz',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (_, record: Client) => `${record.first_name} ${record.last_name}`
    },
    {
      title: 'Kompaniya',
      dataIndex: 'company',
      key: 'company',
      render: (company: string) => company || '-'
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
      title: 'Amallar',
      key: 'actions',
      render: (record: Client) => (
        <Space>
          <Tooltip title="Batafsil ko'rish">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewClient(record)}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditClient(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Mijozni o'chirishni xohlaysizmi?"
            onConfirm={() => record.id && handleDeleteClient(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const renderClientCards = () => (
    <Row gutter={[16, 16]} className={styles.cardsGrid}>
      {clients.map(client => (
        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={client.id}>
          <Card
            hoverable
            className={styles.clientCard}
            actions={[
              <Tooltip title="Batafsil ko'rish" key="view">
                <EyeOutlined onClick={() => handleViewClient(client)} />
              </Tooltip>,
              <Tooltip title="Tahrirlash" key="edit">
                <EditOutlined onClick={() => handleEditClient(client)} />
              </Tooltip>,
              <Popconfirm
                key="delete"
                title="Mijozni o'chirishni xohlaysizmi?"
                onConfirm={() => client.id && handleDeleteClient(client.id)}
                okText="Ha"
                cancelText="Yo'q"
              >
                <DeleteOutlined />
              </Popconfirm>,
            ]}
          >
            <div className={styles.cardContent}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
                className={styles.clientAvatar}
              />
              <div className={styles.clientInfo}>
                <Title level={5} className={styles.clientName}>
                  {`${client.first_name} ${client.last_name}`}
                </Title>
              </div>
              <div className={styles.clientDetails}>
                <div className={styles.detailItem}>
                  <Text type="secondary">Kompaniya:</Text>
                  <Text>{client.company || '-'}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text type="secondary">Telefon:</Text>
                  <Text>{client.number}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text type="secondary">Shahar:</Text>
                  <Text>{client.city}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )

  return (
    <Layout className={styles.clientsPage}>
      <Content className={styles.clientsContent}>
        <div className={styles.pageHeader}>
          <div>
            <Title level={4} className={styles.pageTitle}>
              Mijozlar boshqaruvi
            </Title>
            <Text type="secondary">
              Mijozlar ma&apos;lumotlarini ko&apos;ring va boshqaring
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClient}
            size="large"
          >
            Yangi mijoz qo`shish
          </Button>
        </div>

        <Row gutter={[16, 16]} className={styles.statsCards}>
          <Col xs={24} sm={12} md={8}>
            <Card className={styles.statCard}>
              <Space align="start">
                <Avatar
                  size={48}
                  className={styles.statIcon}
                  icon={<TeamOutlined />}
                />
                <div>
                  <Text type="secondary">Jami mijozlar</Text>
                  <Title level={3}>{total}</Title>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card className={styles.mainCard}>
          <div className={styles.tableControls}>
            <Input
              placeholder="Mijoz qidirish!!"
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className={styles.searchInput}
              prefix={<SearchOutlined className={styles.searchIcon} />}
              size="large"
            />
            <Space size="middle">
              <Segmented
                options={[
                  {
                    value: 'table',
                    icon: <BarsOutlined style={{ fontSize: '18px' }} />,
                  },
                  {
                    value: 'cards',
                    icon: <AppstoreOutlined style={{ fontSize: '18px' }} />,
                  },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as 'table' | 'cards')}
                size="large"
              />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '10',
                      label: '10 ta',
                      onClick: () => setPageSize(10),
                    },
                    {
                      key: '20',
                      label: '20 ta',
                      onClick: () => setPageSize(20),
                    },
                    {
                      key: '50',
                      label: '50 ta',
                      onClick: () => setPageSize(50),
                    },
                  ],
                }}
              >
                <Button size="large">
                  {pageSize} ta <DownOutlined style={{ fontSize: '14px' }} />
                </Button>
              </Dropdown>
            </Space>
          </div>
          {viewMode === 'table' ? (
            <Table
              columns={columns}
              dataSource={clients}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize,
                total,
                onChange: handlePageChange,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total) => `Jami ${total} ta`,
              }}
              className={styles.clientsTable}
            />
          ) : (
            <>
              {renderClientCards()}
              <div className={styles.cardsPagination}>
                <div className={styles.paginationInfo}>Jami {total} ta</div>
                <Button.Group>
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Oldingi
                  </Button>
                  <Button>{currentPage}</Button>
                  <Button
                    disabled={currentPage * pageSize >= total}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Keyingi
                  </Button>
                </Button.Group>
              </div>
            </>
          )}
        </Card>
      </Content>
      <ClientModal
        visible={isModalVisible}
        client={selectedClient}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </Layout>
  )
}

export default ClientsPage
