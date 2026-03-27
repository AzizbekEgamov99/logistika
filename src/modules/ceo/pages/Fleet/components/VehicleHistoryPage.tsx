'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Row, Col, Typography, Tag, Space, Empty, Tabs, Collapse, Pagination, Table, Image } from 'antd';
import { 
  CarOutlined, 
  HistoryOutlined,
  ToolOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  DashboardOutlined,
  DownOutlined,
  UpOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import axiosInstance, { formatImageUrl } from '../../../../../api/axiosInstance';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// CSS styles for maintenance view (copy from accounting module)
const maintenanceStyles = `
  .carHistoryContainer {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    margin-top: 16px;
  }
  
  .tabsContainer {
    margin-top: 20px;
  }
  
  .maintenanceRecord {
    background-color: #f8f9ff;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 6px;
    border-left: 4px solid #1890ff;
  }
  
  .tireRecord {
    background-color: #f6ffed;
    border-left-color: #52c41a;
  }
  
  .serviceRecord {
    background-color: #f9f0ff;
    border-left-color: #722ed1;
  }
  
  .expenseRecord {
    background-color: #fff7e6;
    border-left-color: #fa8c16;
  }

  .referenceRecord {
    background-color: #fcf4f6;
    border-left-color: #eb2f96;
  }

  .applicationRecord {
    background-color: #e6fffb;
    border-left-color: #13c2c2;
  }
  
  .recordIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 16px;
  }
  
  .recordDate {
    color: #8c8c8c;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  
  .recordDetails {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
  }
  
  .recordItem {
    display: flex;
    align-items: center;
  }
  
  .recordLabel {
    min-width: 90px;
    color: #8c8c8c;
  }
  
  .recordValue {
    font-weight: 500;
  }
  
  .priceValue {
    color: #f5222d;
    font-weight: 500;
  }
  
  .countTag {
    background-color: #f0f0f0;
    color: #595959;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 12px;
    margin-left: 8px;
  }
  
  .sectionHeader {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .sectionTitle {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }
  
  .typeBadge {
    display: inline-block;
    padding: 2px 8px;
    margin-right: 8px;
    border-radius: 4px;
    color: white;
    font-size: 12px;
  }
  
  .recordsContainer {
    max-height: 500px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .collapseHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  
  .collapseTitle {
    display: flex;
    align-items: center;
  }
  
  .sectionBadge {
    margin-left: 8px;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  .showMoreButton {
    display: block;
    text-align: center;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .showMoreButton:hover {
    background-color: #e6f7ff;
  }
  
  .paginationContainer {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
  
  .carImageContainer {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  
  .carImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .carImage:hover {
    transform: scale(1.05);
  }
  
  .carDetailItem {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
`;

interface VehicleHistoryPageProps {
  id?: string;
}

const VehicleHistoryPage = ({ id }: VehicleHistoryPageProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('reyslar');
  const [vehicleType, setVehicleType] = useState<'car' | 'furgon'>('car');
  
  const router = useRouter();
  const pathname = usePathname();

  const [oilExpanded, setOilExpanded] = useState(true);
  const [tireExpanded, setTireExpanded] = useState(true);
  const [serviceExpanded, setServiceExpanded] = useState(true);
  
  const [oilPage, setOilPage] = useState(1);
  const [tirePage, setTirePage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  
  const [showAllOil, setShowAllOil] = useState(false);
  const [showAllTire, setShowAllTire] = useState(false);
  const [showAllService, setShowAllService] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  
  const pageSize = 5;
  
  // Add styles to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(maintenanceStyles));
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Extract vehicle ID from props or URL path on mount
  useEffect(() => {
    if (id) {
      setVehicleId(id);
    } else if (pathname) {
      const urlParts = pathname.split('/');
      const pathId = urlParts[urlParts.length - 2];
      setVehicleId(pathId);
    }
  }, [pathname, id]);

  // Determine vehicle type (car or furgon) based on URL
  useEffect(() => {
    if (pathname?.includes('furgon')) {
      setVehicleType('furgon');
    } else {
      setVehicleType('car');
    }
  }, [pathname]);

  // Fetch data when ID is available
  useEffect(() => {
    if (vehicleId) {
      fetchData();
    }
  }, [vehicleId, vehicleType]);

  // Fetch vehicle data
  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      
      // Use different endpoints for car and furgon history
      if (vehicleType === 'furgon') {
        response = await axiosInstance.get(`/history/${vehicleId}/furgon-history/`);
      } else {
        response = await axiosInstance.get(`/history/${vehicleId}/car-history/`);
      }
      
      setData(response.data);
      console.log('Vehicle history data:', response.data);
    } catch (error) {
      console.error('Error fetching vehicle history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format utilities
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
      .replace('UZS', 'so\'m');
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Mavjud emas';
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (e) {
      return dateString;
    }
  };

  // Get transmission text
  const getTransmissionText = (transmission) => {
    if (!transmission) return '';
    
    switch(transmission?.toLowerCase()) {
      case 'manual': return 'Mexanika';
      case 'automatic': return 'Avtomat';
      default: return transmission;
    }
  };
  
  // Get fuel type text
  const getFuelText = (fuel) => {
    if (!fuel) return '';
    
    switch(fuel?.toLowerCase()) {
      case 'benzin': return 'Benzin';
      case 'diesel': return 'Dizel';
      case 'gas': return 'Gaz';
      default: return fuel;
    }
  };
  
  // Pagination handlers
  const handleOilPageChange = (page) => {
    setOilPage(page);
  };
  
  const handleTirePageChange = (page) => {
    setTirePage(page);
  };
  
  const handleServicePageChange = (page) => {
    setServicePage(page);
  };
  
  const handleExpensePageChange = (page) => {
    setExpensePage(page);
  };
  
  // Calculate pagination
  const getPaginatedItems = (items, page, showAll) => {
    if (showAll) return items;
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  };

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout title="Transport tarix" subtitle="Yuklanmoqda...">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Xatolik" subtitle="Ma'lumot topilmadi">
        <Card>
          <Empty description="Transport ma'lumotlari topilmadi" />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button 
              type="primary" 
              icon={<RollbackOutlined />} 
              onClick={() => router.push('/modules/ceo/fleet')}
            >
              Transportlar sahifasiga qaytish
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  // Destructure data with the correct property names
  const { 
    car, 
    furgon,
    optol = [], 
    bolon = [], 
    texnic = [],
    total_usd = 0,
    details_expense_usd = { optol: 0, bolon: 0, texnic: 0 },
    rays_history = [],
    rays_count = 0
  } = data;
  
  // Get the vehicle object based on type
  const vehicle = vehicleType === 'furgon' ? furgon : car;
  
  // Define trips columns for the table
  const columns = [
    {
      title: 'Reys №',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <strong>#{id}</strong>
    },
    {
      title: 'Qayerdan',
      dataIndex: 'from1',
      key: 'from1',
    },
    {
      title: 'Qayerga',
      dataIndex: 'to_go',
      key: 'to_go',
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date)
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'success' : status === 'in_progress' ? 'processing' : 'default'}>
          {status === 'completed' ? 'Yakunlangan' : status === 'in_progress' ? 'Jarayonda' : 'Rejalashtirilgan'}
        </Tag>
      ),
    }
  ];

  return (
    <DashboardLayout 
      title={vehicleType === 'car' ? 'Avtomobil tarix' : 'Furgon tarix'} 
      subtitle={vehicle?.name || vehicle?.car_number || 'Transport vositasi'}
    >
      <Card
        title={
          <Space>
            <KeyOutlined style={{ color: '#1890ff' }} />
            <span>Transport ma'lumotlari</span>
          </Space>
        }
        extra={
          <Tag color={vehicle?.is_busy ? 'red' : 'green'} style={{ fontSize: '14px', padding: '4px 12px' }}>
            {vehicle?.is_busy ? 'Band' : "Bo'sh"}
          </Tag>
        }
      >
        <Row gutter={[24, 24]}>
          {/* Car Image */}
          {vehicle?.photo && (
            <Col xs={24} md={8}>
              <div className="carImageContainer">
                <Image 
                  src={formatImageUrl(vehicle.photo)} 
                  alt={vehicle.name} 
                  className="carImage"
                  width={300}
                  height={225}
                />
              </div>
            </Col>
          )}
          
          {/* Car Details - 2 columns */}
          <Col xs={24} md={vehicle?.photo ? 16 : 24}>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <div className="carDetailItem">
                  <Text type="secondary"><CarOutlined /> Model:</Text>
                  <Text strong>{vehicle?.name}</Text>
                </div>
                
                <div className="carDetailItem">
                  <Text type="secondary">Davlat raqami:</Text>
                  <Text strong>{vehicle?.car_number}</Text>
                </div>
            
                <div className="carDetailItem">
                  <Text type="secondary"><CalendarOutlined /> Ishlab chiqarilgan:</Text>
                  <Text strong>{vehicle?.year} yil</Text>
                </div>
            
                <div className="carDetailItem">
                  <Text type="secondary"><DashboardOutlined /> Kilometr:</Text>
                  <Text strong>{formatNumber(vehicle?.kilometer || 0)} km</Text>
                </div>
              </Col>
          
              <Col xs={24} md={12}>
                <div className="carDetailItem">
                  <Text type="secondary">Dvigatel:</Text>
                  <Text strong>{vehicle?.engine}</Text>
                </div>
                
                <div className="carDetailItem">
                  <Text type="secondary">Transmissiya:</Text>
                  <Text strong>{getTransmissionText(vehicle?.transmission)}</Text>
                </div>
                
                <div className="carDetailItem">
                  <Text type="secondary">Yoqilg'i turi:</Text>
                  <Text strong>{getFuelText(vehicle?.fuel)}</Text>
                </div>
            
                <div className="carDetailItem">
                  <Text type="secondary">Quvvati:</Text>
                  <Text strong>{vehicle?.power}</Text>
                </div>
              </Col>
            </Row>
            
            <div style={{ marginTop: '12px' }}>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                Sig'im: {vehicle?.capacity}
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* Tabs for content */}
      <div className="carHistoryContainer">
        <Tabs 
          type="card" 
          activeKey={activeTab}
          onChange={setActiveTab}
          className="tabsContainer"
        >
          <TabPane 
            tab={<span><HistoryOutlined /> Reyslar tarixi ({rays_count})</span>}
            key="reyslar"
          >
            <div style={{ padding: '16px 0' }}>
              <h3 style={{ marginBottom: '16px' }}>Reyslar tarixi</h3>
              
              <Card 
                title={
                  <Space>
                    <HistoryOutlined style={{ color: '#1890ff' }} />
                    <span>Reyslar tarixi</span>
                  </Space>
                }
              >
                {rays_history && rays_history.length > 0 ? (
                  <Table 
                    columns={columns}
                    dataSource={rays_history}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    bordered
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <Text>Reyslar tarixi mavjud emas</Text>
                  </div>
                )}
              </Card>
            </div>
          </TabPane>
          
          <TabPane 
            tab={<span><ToolOutlined /> Texnik xizmat tarixi</span>}
            key="texnik"
          >
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[16, 16]}>
                <Col span={24} md={18}>
                  <Collapse 
                    defaultActiveKey={['oil', 'tire', 'service']}
                    ghost
                    expandIconPosition="end"
                  >
                    {/* Moy almashtirish tarixi */}
                    <Panel 
                      key="oil" 
                      header={
                        <div className="collapseHeader">
                          <div className="collapseTitle">
                            <ExperimentOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                            <h3 className="sectionTitle">Moy almashtirish tarixi</h3>
                            <span className="sectionBadge" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
                              {optol.length} dona
                            </span>
                          </div>
                        </div>
                      }
                    >
                      {optol.length > 0 ? (
                        <div>
                          <div className="recordsContainer">
                            {getPaginatedItems(optol, oilPage, showAllOil).map((item, index) => (
                              <div key={`oil-${index}`} className="maintenanceRecord">
                                <div className="recordDate">
                                  <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                                </div>
                                <div className="recordDetails">
                                  <div className="recordItem">
                                    <span className="recordLabel">Kilometr:</span>
                                    <span className="recordValue">{formatNumber(item.kilometr || 0)} km</span>
                                  </div>
                                  <div className="recordItem">
                                    <span className="recordLabel">Narxi:</span>
                                    <span className="priceValue">{formatCurrency(item.price || 0)}</span>
                                  </div>
                                  <div className="recordItem">
                                    <span className="recordLabel">Izoh:</span>
                                    <span className="recordValue">{item.description || 'Izoh mavjud emas'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {optol.length > pageSize && !showAllOil && (
                            <div 
                              className="showMoreButton"
                              onClick={() => setShowAllOil(true)}
                            >
                              <DownOutlined style={{ marginRight: '5px' }} /> 
                              Hammasi ko'rsatish ({optol.length})
                            </div>
                          )}
                          
                          {showAllOil && optol.length > pageSize && (
                            <div 
                              className="showMoreButton"
                              onClick={() => setShowAllOil(false)}
                            >
                              <UpOutlined style={{ marginRight: '5px' }} /> 
                              Yig'ish
                            </div>
                          )}
                          
                          {!showAllOil && optol.length > pageSize && (
                            <div className="paginationContainer">
                              <Pagination 
                                simple 
                                current={oilPage} 
                                pageSize={pageSize} 
                                total={optol.length} 
                                onChange={handleOilPageChange}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Empty description="Moy almashtirish ma'lumotlari mavjud emas" />
                      )}
                    </Panel>
                    
                    {/* Shina almashtirish tarixi */}
                    <Panel 
                      key="tire" 
                      header={
                        <div className="collapseHeader">
                          <div className="collapseTitle">
                            <ToolOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                            <h3 className="sectionTitle">Shina almashtirish tarixi</h3>
                            <span className="sectionBadge" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
                              {bolon.length} dona
                            </span>
                          </div>
                        </div>
                      }
                    >
                      {bolon.length > 0 ? (
                        <div>
                          <div className="recordsContainer">
                            {getPaginatedItems(bolon, tirePage, showAllTire).map((item, index) => (
                              <div key={`tire-${index}`} className="maintenanceRecord tireRecord">
                                <div className="recordDate">
                                  <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                                </div>
                                <div className="recordDetails">
                                  <div className="recordItem">
                                    <span className="recordLabel">Kilometr:</span>
                                    <span className="recordValue">{formatNumber(item.kilometr || 0)} km</span>
                                  </div>
                                  <div className="recordItem">
                                    <span className="recordLabel">Narxi:</span>
                                    <span className="priceValue">{formatCurrency(item.price || 0)}</span>
                                  </div>
                                  <div className="recordItem">
                                    <span className="recordLabel">Izoh:</span>
                                    <span className="recordValue">{item.description || 'Izoh mavjud emas'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {bolon.length > pageSize && !showAllTire && (
                            <div 
                              className="showMoreButton"
                              onClick={() => setShowAllTire(true)}
                            >
                              <DownOutlined style={{ marginRight: '5px' }} /> 
                              Hammasi ko'rsatish ({bolon.length})
                            </div>
                          )}
                          
                          {showAllTire && bolon.length > pageSize && (
                            <div 
                              className="showMoreButton"
                              onClick={() => setShowAllTire(false)}
                            >
                              <UpOutlined style={{ marginRight: '5px' }} /> 
                              Yig'ish
                            </div>
                          )}
                          
                          {!showAllTire && bolon.length > pageSize && (
                            <div className="paginationContainer">
                              <Pagination 
                                simple 
                                current={tirePage} 
                                pageSize={pageSize} 
                                total={bolon.length} 
                                onChange={handleTirePageChange}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Empty description="Shina almashtirish ma'lumotlari mavjud emas" />
                      )}
                    </Panel>
                    
                    {/* Texnik xizmat tarixi */}
                    <Panel 
                      key="service" 
                      header={
                        <div className="collapseHeader">
                          <div className="collapseTitle">
                            <ToolOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                            <h3 className="sectionTitle">Texnik xizmat tarixi</h3>
                            <span className="sectionBadge" style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
                              {texnic.length} dona
                            </span>
                          </div>
                        </div>
                      }
                    >
                      {texnic.length > 0 ? (
                        <div>
                          <div className="recordsContainer">
                            {getPaginatedItems(texnic, servicePage, showAllService).map((item, index) => (
                              <div key={`service-${index}`} className="maintenanceRecord serviceRecord">
                                <div className="recordDate">
                                  <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                                </div>
                                <div className="recordDetails">
                                  <div className="recordItem">
                                    <span className="recordLabel">Kilometr:</span>
                                    <span className="recordValue">{formatNumber(item.kilometr || 0)} km</span>
                                  </div>
                                  <div className="recordItem">
                                    <span className="recordLabel">Narxi:</span>
                                    <span className="priceValue">{formatCurrency(item.price || 0)}</span>
                                  </div>
                                  <div className="recordItem">
                                    <span className="recordLabel">Izoh:</span>
                                    <span className="recordValue">{item.description || 'Izoh mavjud emas'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {texnic.length > pageSize && !showAllService && (
                            <div 
                              className="showMoreButton"
                              onClick={() => setShowAllService(true)}
                            >
                              <DownOutlined style={{ marginRight: '5px' }} /> 
                              Hammasi ko'rsatish ({texnic.length})
                            </div>
                          )}
                          
                          {showAllService && texnic.length > pageSize && (
                            <div 
                              className="showMoreButton"
                              onClick={() => setShowAllService(false)}
                            >
                              <UpOutlined style={{ marginRight: '5px' }} /> 
                              Yig'ish
                            </div>
                          )}
                          
                          {!showAllService && texnic.length > pageSize && (
                            <div className="paginationContainer">
                              <Pagination 
                                simple 
                                current={servicePage} 
                                pageSize={pageSize} 
                                total={texnic.length} 
                                onChange={handleServicePageChange}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Empty description="Texnik xizmat ma'lumotlari mavjud emas" />
                      )}
                    </Panel>
                  </Collapse>
                </Col>
                
                <Col span={24} md={6}>
                  <Card title="Xarajatlar" style={{ position: 'sticky', top: '24px' }}>
                    <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text type="secondary">Moy almashtirish</Text>
                      <div>
                        <Text strong>{formatCurrency(details_expense_usd?.optol || 0)}</Text>
                      </div>
                    </div>
                    <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text type="secondary">Shina almashtirish</Text>
                      <div>
                        <Text strong>{formatCurrency(details_expense_usd?.bolon || 0)}</Text>
                      </div>
                    </div>
                    <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text type="secondary">Texnik xizmat</Text>
                      <div>
                        <Text strong>{formatCurrency(details_expense_usd?.texnic || 0)}</Text>
                      </div>
                    </div>
                    <div style={{ padding: '12px 0', marginTop: '8px' }}>
                      <Title level={5} style={{ margin: 0 }}>Jami xarajat</Title>
                      <div>
                        <Title level={3} style={{ margin: '4px 0 0 0', color: '#f5222d' }}>
                          {formatCurrency(total_usd || 0)}
                        </Title>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VehicleHistoryPage; 