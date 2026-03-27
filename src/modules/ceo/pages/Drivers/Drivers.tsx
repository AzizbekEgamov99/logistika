'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Tabs,
  Statistic,
  Progress,
  Avatar,
  Input,
  Modal,
  Tooltip,
  Empty,
  Select,
  message,
  Form,
  Badge,
  Divider,
  Spin,
  Alert,
} from 'antd'
import {
  UserOutlined,
  CarOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  DashboardOutlined,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  BarsOutlined,
  SettingOutlined,
  ExportOutlined,
  ImportOutlined,
  PieChartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DownloadOutlined,
  CalendarOutlined,
  PhoneOutlined,
  DollarOutlined,
  IdcardOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useRouter } from 'next/navigation'
import { useCEODrivers } from '../../hooks/useCEODrivers'
import { DriverType } from '../../../accounting/types/driver'
import DriversOnRoad from './components/DriversOnRoad'
import axiosInstance from '@/api/axiosInstance'
import { baseURL, formatImageUrl } from '../../../../api/axiosInstance'; 
import { motion } from 'framer-motion'
import './styles/Drivers.css'
import DriverModal from './components/DriverModal'
import DriversDashboard from './components/dashboard/DriversDashboard'
import DriverFilters from './components/DriverFilters'
import DriverHistoryPage from './components/DriverHistoryPage'
import DriverTable from './components/table/DriverTable'
import dynamic from 'next/dynamic'

const { Text, Title } = Typography
const { confirm } = Modal
const { Option } = Select
const { TabPane } = Tabs

// Create a client-side only component for date formatting
const DateDisplay = dynamic(() => Promise.resolve(
  ({ dateString }: { dateString: string }) => {
    if (!dateString) return <span>Mavjud emas</span>;
    return <span>{new Date(dateString).toLocaleDateString()}</span>
  }
), { ssr: false });

/**
 * Enhanced Drivers management component
 */
const Drivers: React.FC = () => {
  // State for driver form and modal
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<DriverType | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loadingActiveCars, setLoadingActiveCars] = useState(false)
  const [upcomingExpiries, setUpcomingExpiries] = useState<DriverType[]>([])
  const [driverAlerts, setDriverAlerts] = useState<
    { driver: DriverType; message: string }[]
  >([])
  const [searchText, setSearchText] = useState('')
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    status: 'all' as string,
    is_busy: undefined as boolean | undefined,
    page: 1,
    pageSize: 10
  })
  const [exportLoading, setExportLoading] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [selectedDriverRows, setSelectedDriverRows] = useState<React.Key[]>([])

  // Use enhanced driver hook
  const {
    drivers,
    driversOnRoad,
    waitingDrivers,
    isLoading,
    createDriver,
    updateDriver,
    deleteDriver,
    updateFilters,
    activeDriversCount,
    inactiveDriversCount,
    activeDriversPercentage,
    driversOnRoadCount,
    driversOnRoadPercentage,
    waitingDriversCount,
    total,
    filters
  } = useCEODrivers()

  const router = useRouter()

  // Fetch active cars for "yo'ldagi haydovchilar"
  useEffect(() => {
    const fetchActiveCars = async () => {
      try {
        setLoadingActiveCars(true)
        // We don't need to store these as we get them from the hook
        await axiosInstance.get('/car-active/')
      } catch (error) {
        console.error('Error fetching active cars:', error)
      } finally {
        setLoadingActiveCars(false)
      }
    }

    fetchActiveCars()
  }, [])

  useEffect(() => {
    if (!drivers || drivers.length === 0) return

    const today = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)

    const expiringDrivers = drivers.filter((driver) => {
      if (!driver.license_expiry) return false

      const expiryDate = new Date(driver.license_expiry)
      return expiryDate > today && expiryDate < thirtyDaysLater
    })

    setUpcomingExpiries(expiringDrivers)

    // Generate alerts for system
    const alerts = [
      ...expiringDrivers.map((driver) => ({
        driver,
        message: `${driver.fullname || driver.first_name + ' ' + driver.last_name} litsenziyasi ${new Date(driver.license_expiry!).toLocaleDateString()} da tugaydi`,
      })),
      ...drivers
        .filter(
          (driver) =>
            driver.status === 'driver' &&
            driver.status_updated_at &&
            new Date().getTime() -
            new Date(driver.status_updated_at).getTime() >
            7 * 24 * 60 * 60 * 1000,
        )
        .map((driver) => ({
          driver,
          message: `${driver.fullname || driver.first_name + ' ' + driver.last_name} 7 kundan ortiq vaqt davomida safarda`,
        })),
    ]

    setDriverAlerts(alerts)
  }, [drivers])

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setSearchFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Update filters in the hook
    updateFilters(newFilters);
  }

  // Handle search input change
  const handleSearch = (value: string) => {
    setSearchText(value)

    // Update local filters state
    const newFilters = {
      search: value,
      status: searchFilters.status,
      is_busy: searchFilters.is_busy,
      page: 1, // Reset to first page on new search
      pageSize: searchFilters.pageSize // Keep the current page size
    };

    setSearchFilters(newFilters);

    // Update filters in the hook
    updateFilters(newFilters);
  }

  // Driver CRUD operations
  const handleAddDriver = useCallback(() => {
    setModalMode('create')
    setSelectedDriver(null)
    setIsModalVisible(true)
  }, [])
  
  const handleEditDriver = useCallback((driver: DriverType) => {
    if (!driver) return

    setModalMode('edit')
    setSelectedDriver(driver)
    setIsModalVisible(true)
  }, [])

  /**
   * View driver details
   */
  const handleViewDriver = useCallback(
    (driver: DriverType) => {
      if (driver && driver.id) {
        router.push(`/modules/ceo/drivers/${driver.id}/history`)
      } else {
        console.error('Cannot navigate to driver history: Invalid driver ID')
      }
    },
    [router],
  )

  /**
   * Handle driver deletion with confirmation
   */
  const handleDeleteDriver = async (driver: DriverType) => {
    try {
      await deleteDriver(driver.id);
      message.success("Haydovchi muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.error('Delete error:', error);
      message.error("Haydovchini o'chirishda xatolik yuz berdi");
    }
  };

  const handleModalSubmit = useCallback(
    async (values: Partial<DriverType>) => {
      try {
        if (modalMode === 'create') {
          await createDriver(values)
          message.success("Haydovchi muvaffaqiyatli qo'shildi")
        } else if (modalMode === 'edit' && selectedDriver) {
          await updateDriver(selectedDriver.id, values as any)
          message.success("Haydovchi ma'lumotlari yangilandi")
        }
        setIsModalVisible(false)
      } catch (error) {
        console.error('Form submission error:', error)
        throw error
      }
    },
    [modalMode, selectedDriver, createDriver, updateDriver],
  )

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key)
  }, [])

  /**
   * Export drivers to CSV
   */
  const handleExportDrivers = async () => {
    try {
      setExportLoading(true);
      // Export functionality
      const selectedDriverData = selectedDriverRows.length > 0
        ? drivers.filter(driver => selectedDriverRows.includes(driver.id))
        : drivers;
      
      // Convert to CSV
      const headers = [
        'ID', 'Ism', 'Telefon', 'Status', 'Guvohnoma', 'Yo\'nalish', 'Reyslar soni', 'To\'langan oyliklar'
      ];
      
      const rows = selectedDriverData.map(driver => [
        driver.id,
        driver.fullname,
        driver.phone_number,
        driver.status,
        driver.license_number || '',
        driver.address || '',
        driver.rays_count || 0,
        driver.total_rays_usd || 0
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `haydovchilar_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('Haydovchilar ma\'lumotlari eksport qilindi');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Eksport qilishda xatolik yuz berdi');
    } finally {
      setExportLoading(false);
    }
  };

  // Handle print driver info
  const handlePrintDriverInfo = (driver: DriverType) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Haydovchi ma'lumotlari - ${driver.fullname}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .driver-details { margin-bottom: 30px; }
              .section { margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Haydovchi ma'lumotlari</h1>
            </div>
            <div class="driver-details">
              <h2>${driver.fullname}</h2>
              <p>ID: ${driver.id}</p>
              <p>Telefon: ${driver.phone_number}</p>
              <p>Status: ${driver.status}</p>
              <p>Guvohnoma: ${driver.license_number || 'Mavjud emas'}</p>
              <p>Guvohnoma muddati: ${driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : 'Mavjud emas'}</p>
              <p>Yo'nalish: ${driver.address || 'Mavjud emas'}</p>
            </div>
            <div class="section">
              <h3>Statistika</h3>
              <p>Reyslar soni: ${driver.rays_count || 0}</p>
              <p>To'langan oyliklar: ${driver.total_rays_usd || 0}$</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Call driver
  const handleCallDriver = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Pagination configuration
  const paginationConfig = {
    pageSize: searchFilters.pageSize, 
    showSizeChanger: true,
    total: total,
    current: searchFilters.page,
    onChange: (page: number, pageSize: number) => {
      handleFilterChange({
        ...searchFilters,
        page,
        pageSize
      });
    }
  };

  // Row selection configuration
  const rowSelectionConfig = {
    selectedRowKeys: selectedDriverRows,
    onChange: setSelectedDriverRows
  };

  return (
    <DashboardLayout
      title="Haydovchilar boshqaruvi"
      subtitle="Haydovchilarni boshqarish"
    >
      <div className="drivers-actions" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddDriver}
              >
                Yangi haydovchi qo`shish
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            {driverAlerts.length > 0 && (
              <Alert
                message={`${driverAlerts.length} ta ogohlantirish mavjud`}
                type="warning"
                showIcon
                style={{ display: 'inline-block' }}
                action={
                  <Button size="small">Ko'rish</Button>
                }
              />
            )}
          </Col>
        </Row>
      </div>

      <Card className="drivers-container">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          className="drivers-tabs"
          items={[
            {
              key: 'dashboard',
              label: (
                <span><DashboardOutlined /> Dashboard</span>
              ),
              children: (
                <DriversDashboard 
                  drivers={drivers} 
                  driversOnRoad={driversOnRoad} 
                  isLoading={isLoading} 
                  onTabChange={handleTabChange}
                />
              ),
            },
            {
              key: 'list',
              label: (
                <span><TeamOutlined /> Haydovchilar ro`yxati</span>
              ),
              children: (
                <>
                  <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 16 }}>
                    <Col xs={24} md={12}>
                      <Input.Search
                        placeholder="Ism yoki telefon bo'yicha qidirish..."
                        allowClear
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                  </Row>

                  <Table
                    columns={[
                      {
                        title: 'Haydovchi',
                        key: 'driver',
                        width: 240,
                        render: (_: any, record: DriverType) => (
                          <Space>
                            <div style={{ position: 'relative' }}>
                              <Avatar
                                size="large"
                                icon={<UserOutlined />}
                                style={{
                                  backgroundColor: '#1890ff',
                                }}
                              >
                                {record.fullname?.charAt(0)}
                              </Avatar>

                              {record.is_busy && (
                                <Badge
                                  status="success"
                                  style={{ position: 'absolute', bottom: 0, right: 0 }}
                                />
                              )}
                            </div>
                            <div>
                              <div 
                                style={{ fontWeight: 500, cursor: 'pointer' }}
                                onClick={() => handleViewDriver(record)}
                              >
                                {record.fullname}
                              </div>
                              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                {record.phone_number}
                              </div>
                            </div>
                          </Space>
                        ),
                      },
                      {
                        title: 'Status',
                        key: 'status',
                        width: 120,
                        render: (_: any, record: DriverType) => {
                          if (record.is_busy) {
                            return (
                              <Tag color="success" icon={<CarOutlined />}>Yo'lda</Tag>
                            )
                          } else {
                            return (
                              <Tag color="default" icon={<ClockCircleOutlined />}>Kutishda</Tag>
                            )
                          }
                        },
                      },
                      {
                        title: 'Reyslar',
                        key: 'trips',
                        width: 100,
                        render: (_: any, record: DriverType) => (
                          <Text>{record.rays_count || 0}</Text>
                        ),
                      },
                      {
                        title: "To`langan oyliklar",
                        key: "total_rays_usd",
                        width: 100,
                        render: (_: any, record: DriverType) => (
                          <Text>{record.total_rays_usd || 0}$</Text>
                        ),
                      },
                      {
                        title: 'Amallar',
                        key: 'action',
                        width: 180,
                        render: (_: any, record: DriverType) => (
                          <Space size="middle">
                            <Tooltip title="Tahrirlash">
                              <Button
                                type="primary"
                                size="small"
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDriver(record);
                                }}
                                style={{ backgroundColor: '#52c41a' }}
                              />
                            </Tooltip>
                            <Tooltip title="O'chirish">
                              <Button
                                type="primary"
                                danger
                                size="small"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDriver(record);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Qo'ng'iroq qilish">
                              <Button
                                type="default"
                                size="small"
                                shape="circle"
                                icon={<PhoneOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCallDriver(record.phone_number);
                                }}
                              />
                            </Tooltip>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={drivers}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ 
                      pageSize: searchFilters.pageSize, 
                      showSizeChanger: true,
                      current: searchFilters.page,
                      onChange: (page, pageSize) => {
                        handleFilterChange({
                          ...searchFilters,
                          page,
                          pageSize
                        });
                      }
                    }}
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </>
              ),
            },
            {
              key: 'on-road',
              label: (
                <span><CarOutlined /> Yo`ldagi haydovchilar</span>
              ),
              children: (
                <>
                  <Title level={5} style={{ marginBottom: 16 }}>Hozirda yo'lda bo'lgan haydovchilar</Title>
                  <Table
                    columns={[
                      {
                        title: 'Haydovchi',
                        key: 'driver',
                        width: 240,
                        render: (_: any, record: DriverType) => (
                          <Space>
                            <Avatar
                              size="large"
                              icon={<UserOutlined />}
                            >
                              {record.fullname?.charAt(0)}
                            </Avatar>
                            <div>
                              <div 
                                style={{ fontWeight: 500, cursor: 'pointer' }}
                                onClick={() => handleViewDriver(record)}
                              >
                                {record.fullname}
                              </div>
                              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                {record.phone_number}
                              </div>
                            </div>
                          </Space>
                        ),
                      },
                      {
                        title: "Yo'nalish",
                        key: "address",
                        width: 140,
                        render: (_: any, record: DriverType) => (
                          <Text>{record.address || 'Mavjud emas'}</Text>
                        ),
                      },
                      {
                        title: 'Reyslar',
                        key: 'trips',
                        width: 100,
                        render: (_: any, record: DriverType) => (
                          <Text>{record.rays_count || 0}</Text>
                        ),
                      },
                      {
                        title: 'Amallar',
                        key: 'action',
                        width: 180,
                        render: (_: any, record: DriverType) => (
                          <Space size="middle">
                            <Tooltip title="Tahrirlash">
                              <Button
                                type="primary"
                                size="small"
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDriver(record);
                                }}
                                style={{ backgroundColor: '#52c41a' }}
                              />
                            </Tooltip>
                            <Tooltip title="O'chirish">
                              <Button
                                type="primary"
                                danger
                                size="small"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDriver(record);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Qo'ng'iroq qilish">
                              <Button
                                type="default"
                                size="small"
                                shape="circle"
                                icon={<PhoneOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCallDriver(record.phone_number);
                                }}
                              />
                            </Tooltip>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={driversOnRoad}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    scroll={{ x: 'max-content' }}
                    locale={{ emptyText: "Yo'lda bo'lgan haydovchilar mavjud emas" }}
                  />
                </>
              ),
            },
            // {
            //   key: 'waiting',
            //   label: (
            //     <span><ClockCircleOutlined /> Kutayotgan haydovchilar!!1</span>
            //   ),
            //   children: (
            //     <>
            //       <Title level={5} style={{ marginBottom: 16 }}>Hozirda kutishdagi haydovchilar</Title>
            //       <Table
            //         columns={[
            //           {
            //             title: 'Haydovchi',
            //             key: 'driver',
            //             width: 240,
            //             render: (_: any, record: DriverType) => (
            //               <Space>
            //                 <Avatar
            //                   src={record.photo}
            //                   size="large"
            //                   icon={!record.photo && <UserOutlined />}
            //                 >
            //                   {!record.photo && record.fullname?.charAt(0)}
            //                 </Avatar>
            //                 <div>
            //                   <div 
            //                     style={{ fontWeight: 500, cursor: 'pointer' }}
            //                     onClick={() => handleViewDriver(record)}
            //                   >
            //                     {record.fullname}
            //                   </div>
            //                   <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            //                     {record.phone_number}
            //                   </div>
            //                 </div>
            //               </Space>
            //             ),
            //           },
            //           {
            //             title: "Yo'nalish",
            //             key: "address",
            //             width: 140,
            //             render: (_: any, record: DriverType) => (
            //               <Text>{record.address || 'Mavjud emas'}</Text>
            //             ),
            //           },
            //           {
            //             title: 'Reyslar',
            //             key: 'trips',
            //             width: 100,
            //             render: (_: any, record: DriverType) => (
            //               <Text>{record.rays_count || 0}</Text>
            //             ),
            //           },
            //           {
            //             title: 'Amallar',
            //             key: 'action',
            //             width: 180,
            //             render: (_: any, record: DriverType) => (
            //               <Space size="middle">
            //                 <Tooltip title="Tahrirlash">
            //                   <Button
            //                     type="primary"
            //                     size="small"
            //                     shape="circle"
            //                     icon={<EditOutlined />}
            //                     onClick={(e) => {
            //                       e.stopPropagation();
            //                       handleEditDriver(record);
            //                     }}
            //                     style={{ backgroundColor: '#52c41a' }}
            //                   />
            //                 </Tooltip>
            //                 <Tooltip title="O'chirish">
            //                   <Button
            //                     type="primary"
            //                     danger
            //                     size="small"
            //                     shape="circle"
            //                     icon={<DeleteOutlined />}
            //                     onClick={(e) => {
            //                       e.stopPropagation();
            //                       handleDeleteDriver(record);
            //                     }}
            //                   />
            //                 </Tooltip>
            //                 <Tooltip title="Qo'ng'iroq qilish">
            //                   <Button
            //                     type="default"
            //                     size="small"
            //                     shape="circle"
            //                     icon={<PhoneOutlined />}
            //                     onClick={(e) => {
            //                       e.stopPropagation();
            //                       handleCallDriver(record.phone_number);
            //                     }}
            //                   />
            //                 </Tooltip>
            //               </Space>
            //             ),
            //           },
            //         ]}
            //         dataSource={waitingDrivers}
            //         rowKey="id"
            //         loading={isLoading}
            //         pagination={{ pageSize: 10 }}
            //         size="middle"
            //         locale={{ emptyText: "Kutishdagi haydovchilar mavjud emas" }}
            //       />
            //     </>
            //   ),
            // },
          ]}
        />
      </Card>

      <DriverModal
        visible={isModalVisible}
        mode={modalMode}
        driver={selectedDriver}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
      />
    </DashboardLayout>
  )
}

export default Drivers
