'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Row, Col, Typography, Tag, Space, Empty, Tabs, Collapse, Pagination, Table } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  CarOutlined,
  HistoryOutlined,
  ToolOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  RollbackOutlined,
  DashboardOutlined,
  CalendarOutlined,
  DownOutlined,
  UpOutlined,
  KeyOutlined
} from '@ant-design/icons';
import axiosInstance, { formatImageUrl } from '../../../../../../api/axiosInstance';
import styles from '../../Cars.module.css';
import Image from 'next/image';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// CSS styles for maintenance view
const maintenanceStyles = `
  .carHistoryContainer {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
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
`;

const CarHistoryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carId, setCarId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('reyslar');

  const router = useRouter();
  const pathname = usePathname();

  const [oilPage, setOilPage] = useState(1);
  const [tirePage, setTirePage] = useState(1);
  const [servicePage, setServicePage] = useState(1);

  const [showAllOil, setShowAllOil] = useState(false);
  const [showAllTire, setShowAllTire] = useState(false);
  const [showAllService, setShowAllService] = useState(false);

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

  // Extract car ID from URL path on mount
  useEffect(() => {
    if (pathname) {
      const urlParts = pathname.split('/');
      const id = urlParts[urlParts.length - 2];
      setCarId(id);
    }
  }, [pathname]);

  // Fetch data after we have the car ID
  useEffect(() => {
    if (!carId) return;

    const fetchData = async () => {
      try {
        // Fetch car history data from the correct endpoint
        const response = await axiosInstance.get(`/history/${carId}/car-history/`);
        setData(response.data);
        console.log('Car history data:', response.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  // Get transmission text
  const getTransmissionText = (transmission) => {
    if (!transmission) return '';

    switch (transmission.toLowerCase()) {
      case 'manual': return 'Mexanika';
      case 'automatic': return 'Avtomat';
      default: return transmission;
    }
  };

  // Get fuel type text
  const getFuelText = (fuel) => {
    if (!fuel) return '';

    switch (fuel.toLowerCase()) {
      case 'benzin': return 'Benzin';
      case 'diesel': return 'Dizel';
      case 'gas': return 'Gaz';
      default: return fuel;
    }
  };

  // Define trips columns for the table
  const columns = [
    {
      title: 'Reys',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <strong>#{id}</strong>
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date)
    }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || !data.car) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text style={{ fontSize: '16px', display: 'block', marginBottom: '20px' }}>
          Ma`lumot topilmadi
        </Text>
        <Button
          onClick={() => router.push('/modules/accounting/cars')}
          type="primary"
          icon={<RollbackOutlined />}
        >
          Mashinalar ro`yxatiga qaytish
        </Button>
      </div>
    );
  }

  // Destructure data with the correct property names
  const {
    car,
    optol = [],
    bolon = [],
    texnic = [],
    total_usd = 0,
    details_expense_usd = { optol: 0, bolon: 0, texnic: 0 },
    rays_history = [],
    rays_count = 0
  } = data;

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

  // Calculate pagination
  const getPaginatedItems = (items, page, showAll) => {
    if (showAll) return items;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.container}>
      {/* Header with back button */}
      <div className={styles.pageHeader}>
        <Title level={3} className={styles.pageTitle}>
          <CarOutlined className={styles.titleIcon} />
          {car.name}
        </Title>
        <Button
          onClick={() => {
            router.push('/modules/accounting/cars');
          }}
          icon={<RollbackOutlined />}
          size="large"
        >
          Orqaga
        </Button>
      </div>
      <Card
        className={styles.card}
        hoverable
        style={{ marginBottom: '24px' }}
        title={
          <Space>
            <KeyOutlined style={{ color: '#1890ff' }} />
            <span>Mashina ma`lumotlari</span>
          </Space>
        }
        extra={
          <Tag color={car.is_busy ? 'red' : 'green'} style={{ fontSize: '14px', padding: '4px 12px' }}>
            {car.is_busy ? 'Band' : "Bo'sh"}
          </Tag>
        }
      >
        <Row gutter={[24, 24]}>
          {/* Car Image */}
          {car.photo && (
            <Col xs={24} md={8}>
              <div className={styles.carImageContainer}>
                <Image
                  src={formatImageUrl(car.photo) || ''}
                  alt={car.name}
                  className={styles.carImage}
                  width={300}
                  height={225}
                />
              </div>
            </Col>
          )}

          {/* Car Details - 2 columns */}
          <Col xs={24} md={car.photo ? 16 : 24}>
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <div className={styles.carDetailItem}>
                  <Text type="secondary"><CarOutlined /> Model:</Text>
                  <Text strong>{car.name}</Text>
                </div>

                <div className={styles.carDetailItem}>
                  <Text type="secondary">Davlat raqami:</Text>
                  <Text strong>{car.car_number}</Text>
                </div>

                <div className={styles.carDetailItem}>
                  <Text type="secondary"><CalendarOutlined /> Ishlab chiqarilgan:</Text>
                  <Text strong>{car.year} yil</Text>
                </div>

                <div className={styles.carDetailItem}>
                  <Text type="secondary"><DashboardOutlined /> Kilometr:</Text>
                  <Text strong>{formatNumber(car.mileage)} km</Text>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className={styles.carDetailItem}>
                  <Text type="secondary">Dvigatel:</Text>
                  <Text strong>{car.engine}</Text>
                </div>

                <div className={styles.carDetailItem}>
                  <Text type="secondary">Transmissiya:</Text>
                  <Text strong>{getTransmissionText(car.transmission)}</Text>
                </div>

                <div className={styles.carDetailItem}>
                  <Text type="secondary">Yoqilg`i turi:</Text>
                  <Text strong>{getFuelText(car.fuel)}</Text>
                </div>

                <div className={styles.carDetailItem}>
                  <Text type="secondary">Quvvati:</Text>
                  <Text strong>{car.power}</Text>
                </div>
              </Col>
            </Row>

            <div style={{ marginTop: '12px' }}>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                Sig`im: {car.capacity}
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
                id="reyslar-tarixi"
                className={styles.card}
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
                    className={styles.table}
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
                        {getPaginatedItems(optol, oilPage, showAllOil).map(item => (
                          <div key={`oil-${item.id}`} className="maintenanceRecord">
                            <div className="recordDate">
                              <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                            </div>
                            <div className="recordDetails">
                              <div className="recordItem">
                                <span className="recordLabel">Kilometr:</span>
                                <span className="recordValue">{formatNumber(item.kilometr)} km</span>
                              </div>
                              <div className="recordItem">
                                <span className="recordLabel">Narxi:</span>
                                <span className="priceValue">{formatCurrency(item.price)}</span>
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
                          Hammasi ko`rsatish ({optol.length})
                        </div>
                      )}

                      {showAllOil && optol.length > pageSize && (
                        <div
                          className="showMoreButton"
                          onClick={() => setShowAllOil(false)}
                        >
                          <UpOutlined style={{ marginRight: '5px' }} />
                          Yig`ish
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
                    <Empty description="Moy almashtirish tarixi mavjud emas" />
                  )}
                </Panel>

                {/* Balon almashtirish tarixi */}
                <Panel
                  key="tire"
                  header={
                    <div className="collapseHeader">
                      <div className="collapseTitle">
                        <ToolOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <h3 className="sectionTitle">Balon almashtirish tarixi</h3>
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
                        {getPaginatedItems(bolon, tirePage, showAllTire).map(item => (
                          <div key={`tire-${item.id}`} className="maintenanceRecord tireRecord">
                            <div className="recordDate">
                              <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                            </div>
                            <div className="recordDetails">
                              <div className="recordItem">
                                <span className="recordLabel">Turi:</span>
                                <span className="recordValue">{item.type}</span>
                              </div>
                              <div className="recordItem">
                                <span className="recordLabel">Kilometr:</span>
                                <span className="recordValue">{formatNumber(item.kilometr)} km</span>
                              </div>
                              <div className="recordItem">
                                <span className="recordLabel">Miqdori:</span>
                                <span className="recordValue">{item.count} dona</span>
                              </div>
                              <div className="recordItem">
                                <span className="recordLabel">Narxi:</span>
                                <span className="priceValue">{formatCurrency(item.price)}</span>
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
                          Hammasi ko`rsatish ({bolon.length})
                        </div>
                      )}

                      {showAllTire && bolon.length > pageSize && (
                        <div
                          className="showMoreButton"
                          onClick={() => setShowAllTire(false)}
                        >
                          <UpOutlined style={{ marginRight: '5px' }} />
                          Yig`ish
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
                    <Empty description="Balon almashtirish tarixi mavjud emas" />
                  )}
                </Panel>
                <Panel
                  key="service"
                  header={
                    <div className="collapseHeader">
                      <div className="collapseTitle">
                        <ToolOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                        <h3 className="sectionTitle">Texnik xizmat ko`rsatish tarixi</h3>
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
                        {getPaginatedItems(texnic, servicePage, showAllService).map(item => (
                          <div key={`service-${item.id}`} className="maintenanceRecord serviceRecord">
                            <div className="recordDate">
                              <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                            </div>
                            <div className="recordDetails">
                              <div className="recordItem">
                                <span className="recordLabel">Xizmat turi:</span>
                                <span className="recordValue">
                                  {typeof item.service === 'object' ? item.service.name : 'Texnik xizmat'}
                                </span>
                              </div>
                              <div className="recordItem">
                                <span className="recordLabel">Kilometr:</span>
                                <span className="recordValue">{formatNumber(item.kilometer || 0)} km</span>
                              </div>
                              <div className="recordItem">
                                <span className="recordLabel">Narxi:</span>
                                <span className="priceValue">{formatCurrency(item.price)}</span>
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
                          Hammasi ko`rsatish ({texnic.length})
                        </div>
                      )}

                      {showAllService && texnic.length > pageSize && (
                        <div
                          className="showMoreButton"
                          onClick={() => setShowAllService(false)}
                        >
                          <UpOutlined style={{ marginRight: '5px' }} />
                          Yig`ish
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
                    <Empty description="Texnik xizmat ko'rsatish tarixi mavjud emas" />
                  )}
                </Panel>
              </Collapse>
            </div>
          </TabPane>

          <TabPane
            tab={<span><DollarOutlined /> Xarajatlar</span>}
            key="xarajatlar"
          >
            <div style={{ padding: '16px 0' }}>
              <div style={{ marginBottom: '24px', backgroundColor: '#f0f5ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <Text style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>Umumiy xarajatlar (USD)</Text>
                <Text style={{ fontSize: '24px', color: '#1890ff', fontWeight: 'bold' }}>${total_usd.toFixed(2)}</Text>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Moy almashtirish</Text>
                  <Text style={{ color: '#f5222d' }}>${details_expense_usd.optol.toFixed(2)}</Text>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Balon xarajatlari</Text>
                  <Text style={{ color: '#f5222d' }}>${details_expense_usd.bolon.toFixed(2)}</Text>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Servis xarajatlari</Text>
                  <Text style={{ color: '#f5222d' }}>${details_expense_usd.texnic.toFixed(2)}</Text>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CarHistoryPage;
