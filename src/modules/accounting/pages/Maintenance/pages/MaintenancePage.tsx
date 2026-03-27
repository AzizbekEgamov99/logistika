// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//     Card,
//     Table,
//     Button,
//     Space,
//     Tag,
//     Row,
//     Col,
//     Statistic,
//     Typography,
//     Tooltip,
//     Alert,
//     Badge,
//     Progress
// } from 'antd';
// import {
//     PlusOutlined,
//     ToolOutlined,
//     CarOutlined,
//     DollarOutlined,
//     CalendarOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     CheckCircleOutlined,
//     ClockCircleOutlined,
//     WarningOutlined,
//     EyeOutlined
// } from '@ant-design/icons';
// import { Car } from '../../../types/car';
// import { MaintenanceService, MaintenanceStats, MAINTENANCE_TYPES } from '../../../types/maintenance';
// import { carsService } from '../../../services/carsService';
// import dayjs from 'dayjs';
// import styles from '../styles/maintenance.module.css';
// import MaintenanceServiceModal from '../components/ServiceAdd';
// import MaintenanceServiceDetails from '../components/MaintenanceServiceDetails';

// const { Title } = Typography;

// const MaintenancePage: React.FC = () => {
//     const [cars, setCars] = useState<Car[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isDetailsVisible, setIsDetailsVisible] = useState(false);
//     const [selectedService, setSelectedService] = useState<MaintenanceService | null>(null);
//     const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceService[]>([]);
//     const [stats, setStats] = useState<MaintenanceStats>({
//         totalServices: 0,
//         pendingServices: 0,
//         completedServices: 0,
//         totalCost: 0,
//         thisMonthServices: 0,
//         thisMonthCost: 0,
//         upcomingServices: 0,
//         overdueServices: 0,
//         averageServiceCost: 0,
//         mostCommonService: {
//             type: '',
//             count: 0
//         },
//         costByCategory: {
//             regular: 0,
//             repair: 0,
//             inspection: 0
//         }
//     });

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const [carsResponse, servicesResponse] = await Promise.all([
//                 carsService.getCars({}),
//                 // Bu yerda backend API dan ma'lumotlarni olish kerak
//                 // Hozircha bo'sh massiv qaytaramiz
//                 Promise.resolve({ data: [] })
//             ]);

//             setCars(carsResponse.data);
//             setMaintenanceHistory(servicesResponse.data);
//             calculateStats(servicesResponse.data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculateStats = (services: MaintenanceService[]) => {
//         const now = dayjs();
//         const thisMonth = now.startOf('month');

//         const newStats: MaintenanceStats = {
//             totalServices: services.length,
//             pendingServices: services.filter(s => s.status === 'pending').length,
//             completedServices: services.filter(s => s.status === 'completed').length,
//             totalCost: services.reduce((sum, s) => sum + s.totalCost, 0),
//             thisMonthServices: services.filter(s => dayjs(s.date).isAfter(thisMonth)).length,
//             thisMonthCost: services
//                 .filter(s => dayjs(s.date).isAfter(thisMonth))
//                 .reduce((sum, s) => sum + s.totalCost, 0),
//             upcomingServices: services.filter(s => 
//                 s.status === 'pending' && dayjs(s.date).isAfter(now)
//             ).length,
//             overdueServices: services.filter(s =>
//                 s.status === 'pending' && dayjs(s.date).isBefore(now)
//             ).length,
//             averageServiceCost: services.length ? 
//                 services.reduce((sum, s) => sum + s.totalCost, 0) / services.length : 0,
//             mostCommonService: calculateMostCommonService(services),
//             costByCategory: calculateCostByCategory(services)
//         };

//         setStats(newStats);
//     };

//     const calculateMostCommonService = (services: MaintenanceService[]) => {
//         const typeCount = services.reduce((acc, service) => {
//             acc[service.maintenanceTypeId] = (acc[service.maintenanceTypeId] || 0) + 1;
//             return acc;
//         }, {} as Record<string, number>);

//         let maxCount = 0;
//         let maxType = '';

//         Object.entries(typeCount).forEach(([typeId, count]) => {
//             if (count > maxCount) {
//                 maxCount = count;
//                 maxType = typeId;
//             }
//         });

//         return {
//             type: MAINTENANCE_TYPES.find(t => t.id === maxType)?.name || '',
//             count: maxCount
//         };
//     };

//     const calculateCostByCategory = (services: MaintenanceService[]) => {
//         return services.reduce((acc, service) => {
//             const type = MAINTENANCE_TYPES.find(t => t.id === service.maintenanceTypeId);
//             if (type) {
//                 acc[type.category] += service.totalCost;
//             }
//             return acc;
//         }, {
//             regular: 0,
//             repair: 0,
//             inspection: 0
//         });
//     };

//     const handleAddService = () => {
//         setSelectedService(null);
//         setIsModalVisible(true);
//     };

//     const handleEditService = (service: MaintenanceService) => {
//         setSelectedService(service);
//         setIsModalVisible(true);
//     };

//     const handleViewService = (service: MaintenanceService) => {
//         setSelectedService(service);
//         setIsDetailsVisible(true);
//     };

//     const handleDeleteService = async (service: MaintenanceService) => {
//         // Backend API ga so'rov yuborish kerak
//         try {
//             await carsService.deleteMaintenance(service.carId, service.id);
//             fetchData();
//         } catch (error) {
//             console.error('Error deleting service:', error);
//         }
//     };

//     const handleModalSubmit = async (values: any) => {
//         try {
//             if (selectedService) {
//                 await carsService.updateMaintenance(values.carId, selectedService.id, values);
//             } else {
//                 await carsService.addMaintenance(values.carId, values);
//             }
//             setIsModalVisible(false);
//             fetchData();
//         } catch (error) {
//             console.error('Error saving service:', error);
//         }
//     };

//     const columns = [
//         {
//             title: 'Transport',
//             dataIndex: 'carId',
//             key: 'carId',
//             render: (carId: string) => {
//                 const car = cars.find(c => c.id === carId);
//                 return car ? `${car.model} (${car.number})` : 'Noma\'lum';
//             },
//             filters: cars.map(car => ({
//                 text: `${car.model} (${car.number})`,
//                 value: car.id
//             })),
//             onFilter: (value: string, record: MaintenanceService) => record.carId === value
//         },
//         {
//             title: 'Xizmat turi',
//             dataIndex: 'maintenanceTypeId',
//             key: 'maintenanceTypeId',
//             render: (typeId: string) => {
//                 const type = MAINTENANCE_TYPES.find(t => t.id === typeId);
//                 if (!type) return 'Noma\'lum';
//                 return (
//                     <Space>
//                         {type.name}
//                         <Tag 
//                             color={
//                                 type.importance === 'high' ? 'red' :
//                                 type.importance === 'medium' ? 'orange' : 'green'
//                             }
//                         >
//                             {type.importance === 'high' ? 'Muhim' :
//                              type.importance === 'medium' ? "O'rta" : 'Past'}
//                         </Tag>
//                     </Space>
//                 );
//             },
//             filters: MAINTENANCE_TYPES.map(type => ({
//                 text: type.name,
//                 value: type.id
//             })),
//             onFilter: (value: string, record: MaintenanceService) => 
//                 record.maintenanceTypeId === value
//         },
//         {
//             title: 'Sana',
//             dataIndex: 'date',
//             key: 'date',
//             render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
//             sorter: (a: MaintenanceService, b: MaintenanceService) => 
//                 dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
//             defaultSortOrder: 'descend'
//         },
//         {
//             title: 'Keyingi sana',
//             dataIndex: 'nextDate',
//             key: 'nextDate',
//             render: (date: string) => date ? dayjs(date).format('DD.MM.YYYY') : '-'
//         },
//         {
//             title: 'Masofa',
//             dataIndex: 'mileage',
//             key: 'mileage',
//             render: (mileage: number) => `${mileage.toLocaleString()} km`
//         },
//         {
//             title: 'Narxi',
//             dataIndex: 'totalCost',
//             key: 'totalCost',
//             render: (cost: number) => `${cost.toLocaleString()} $`,
//             sorter: (a: MaintenanceService, b: MaintenanceService) => 
//                 a.totalCost - b.totalCost
//         },
//         {
//             title: 'Holat',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status: string) => {
//                 const colors = {
//                     pending: 'orange',
//                     in_progress: 'blue',
//                     completed: 'green',
//                     cancelled: 'red'
//                 };
//                 const texts = {
//                     pending: 'Kutilmoqda',
//                     in_progress: 'Jarayonda',
//                     completed: 'Bajarilgan',
//                     cancelled: 'Bekor qilingan'
//                 };
//                 return (
//                     <Tag color={colors[status as keyof typeof colors]}>
//                         {texts[status as keyof typeof texts]}
//                     </Tag>
//                 );
//             },
//             filters: [
//                 { text: 'Kutilmoqda', value: 'pending' },
//                 { text: 'Jarayonda', value: 'in_progress' },
//                 { text: 'Bajarilgan', value: 'completed' },
//                 { text: 'Bekor qilingan', value: 'cancelled' }
//             ],
//             onFilter: (value: string, record: MaintenanceService) => 
//                 record.status === value
//         },
//         {
//             title: 'Amallar',
//             key: 'actions',
//             render: (_: any, record: MaintenanceService) => (
//                 <Space>
//                     <Tooltip title="Ko'rish">
//                         <Button
//                             type="text"
//                             icon={<EyeOutlined />}
//                             onClick={() => handleViewService(record)}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Tahrirlash">
//                         <Button
//                             type="text"
//                             icon={<EditOutlined />}
//                             onClick={() => handleEditService(record)}
//                         />
//                     </Tooltip>
//                     <Tooltip title="O'chirish">
//                         <Button
//                             type="text"
//                             danger
//                             icon={<DeleteOutlined />}
//                             onClick={() => handleDeleteService(record)}
//                         />
//                     </Tooltip>
//                 </Space>
//             )
//         }
//     ];

//     return (
//         <div className={styles.maintenancePage}>
//             <Row gutter={[24, 24]}>
//                 <Col span={24}>
//                     <div className={styles.pageHeader}>
//                         <Row justify="space-between" align="middle">
//                             <Col>
//                                 <Title level={3} style={{ margin: 0 }}>Texnik xizmatlar</Title>
//                             </Col>
//                             <Col>
//                                 <Button
//                                     type="primary"
//                                     icon={<PlusOutlined />}
//                                     onClick={handleAddService}
//                                 >
//                                     Yangi texnik xizmat
//                                 </Button>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Col>

//                 <Col span={24}>
//                     <Row gutter={[16, 16]}>
//                         <Col xs={24} sm={12} md={6}>
//                             <Card className={styles.statsCard}>
//                                 <Statistic
//                                     title="Jami texnik xizmatlar"
//                                     value={stats.totalServices}
//                                     prefix={<ToolOutlined />}
//                                     suffix={
//                                         <div style={{ fontSize: 14 }}>
//                                             <span style={{ color: '#52c41a' }}>
//                                                 {stats.completedServices} bajarilgan
//                                             </span>
//                                         </div>
//                                     }
//                                 />
//                             </Card>
//                         </Col>
//                         <Col xs={24} sm={12} md={6}>
//                             <Card className={styles.statsCard}>
//                                 <Statistic
//                                     title="Kutilayotgan xizmatlar"
//                                     value={stats.pendingServices}
//                                     prefix={<ClockCircleOutlined />}
//                                     valueStyle={{ color: '#1890ff' }}
//                                     suffix={
//                                         <div style={{ fontSize: 14 }}>
//                                             <span style={{ color: '#ff4d4f' }}>
//                                                 {stats.overdueServices} kechikkan
//                                             </span>
//                                         </div>
//                                     }
//                                 />
//                             </Card>
//                         </Col>
//                         <Col xs={24} sm={12} md={6}>
//                             <Card className={styles.statsCard}>
//                                 <Statistic
//                                     title="Bu oygi xizmatlar"
//                                     value={stats.thisMonthServices}
//                                     prefix={<CalendarOutlined />}
//                                     suffix={
//                                         <div style={{ fontSize: 14 }}>
//                                             {stats.thisMonthCost.toLocaleString()} $
//                                         </div>
//                                     }
//                                 />
//                             </Card>
//                         </Col>
//                         <Col xs={24} sm={12} md={6}>
//                             <Card className={styles.statsCard}>
//                                 <Statistic
//                                     title="Jami xarajat"
//                                     value={stats.totalCost}
//                                     prefix={<DollarOutlined />}
//                                     suffix="$"
//                                 />
//                                 <div style={{ marginTop: 8 }}>
//                                     <Progress
//                                         percent={Math.round(
//                                             (stats.costByCategory.regular / stats.totalCost) * 100
//                                         )}
//                                         strokeColor="#1890ff"
//                                         size="small"
//                                     />
//                                     <Progress
//                                         percent={Math.round(
//                                             (stats.costByCategory.repair / stats.totalCost) * 100
//                                         )}
//                                         strokeColor="#ff4d4f"
//                                         size="small"
//                                     />
//                                     <Progress
//                                         percent={Math.round(
//                                             (stats.costByCategory.inspection / stats.totalCost) * 100
//                                         )}
//                                         strokeColor="#52c41a"
//                                         size="small"
//                                     />
//                                 </div>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Col>

//                 {stats.overdueServices > 0 && (
//                     <Col span={24}>
//                         <Alert
//                             message="Diqqat!"
//                             description={`${stats.overdueServices} ta kechikkan texnik xizmat mavjud`}
//                             type="warning"
//                             showIcon
//                         />
//                     </Col>
//                 )}

//                 <Col span={24}>
//                     <Card className={styles.mainCard}>
//                         <Table
//                             columns={columns}
//                             dataSource={maintenanceHistory}
//                             rowKey="id"
//                             loading={loading}
//                             pagination={{
//                                 pageSize: 10,
//                                 showSizeChanger: true,
//                                 showTotal: (total) => `Jami: ${total} ta yozuv`
//                             }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <MaintenanceServiceModal
//                 visible={isModalVisible}
//                 onCancel={() => setIsModalVisible(false)}
//                 onSubmit={handleModalSubmit}
//                 editingService={selectedService || undefined}
//                 cars={cars}
//             />

//             {selectedService && (
//                 <MaintenanceServiceDetails
//                     visible={isDetailsVisible}
//                     onClose={() => setIsDetailsVisible(false)}
//                     service={selectedService}
//                     car={cars.find(c => c.id === selectedService.carId)!}
//                 />
//             )}
//         </div>
//     );
// };

// export default MaintenancePage; 