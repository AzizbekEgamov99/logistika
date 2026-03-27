// import React from 'react';
// import { Row, Col } from 'antd';
// import { TeamOutlined, CarOutlined, DollarCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
// import { DriverType } from '../../../../types/driver';
// import StatisticCard from './StatisticCard';
// import StatusChart from './StatusChart';
// import TripsChart from './TripsChart';
// import TopDriversTable from './TopDriversTable';

// interface DashboardProps {
//     drivers: DriverType[];
//     loading: boolean;
// }

// const Dashboard: React.FC<DashboardProps> = ({ drivers, loading }) => {
//     // Derived statistics
//     const activeDrivers = drivers.filter(d => d.status === 'active' || d.status === 'driver').length;
//     const onRouteDrivers = drivers.filter(d => d.status === 'onRoute').length;
//     const inactiveDrivers = drivers.filter(d => d.status === 'inactive').length;
//     const onVacationDrivers = drivers.filter(d => d.status === 'onVacation').length;
    
//     const driverStatusData = [
//         { type: 'Faol', value: activeDrivers },
//         { type: 'Yo\'lda', value: onRouteDrivers },
//         { type: 'Nofaol', value: inactiveDrivers },
//         { type: 'Ta\'tilda', value: onVacationDrivers },
//     ].filter(item => item.value > 0);
//     const performanceData = [];
//     return (
//         <>
//             <Row gutter={[24, 24]}>
//                 <Col xs={24} sm={12} md={6}>
//                     <StatisticCard 
//                         title="Jami haydovchilar"
//                         value={drivers.length}
//                         icon={<TeamOutlined />}
//                         color="blue"
//                     />
//                 </Col>
//                 <Col xs={24} sm={12} md={6}>
//                     <StatisticCard 
//                         title="Faol haydovchilar"
//                         value={activeDrivers}
//                         icon={<CheckCircleOutlined />}
//                         color="green"
//                     />
//                 </Col>
//                 <Col xs={24} sm={12} md={6}>
//                     <StatisticCard 
//                         title="Yo'ldagi haydovchilar"
//                         value={onRouteDrivers}
//                         icon={<CarOutlined />}
//                         color="purple"
//                     />
//                 </Col>
//                 <Col xs={24} sm={12} md={6}>
//                     <StatisticCard 
//                         title="Umumiy daromad"
//                         value={0} // Backenddan olinishi kerak
//                         icon={<DollarCircleOutlined />}
//                         color="orange"
//                         suffix="UZS"
//                     />
//                 </Col>
//             </Row>

//             <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
//                 <Col xs={24} md={16}>
//                     <TripsChart 
//                         data={performanceData}
//                         loading={loading}
//                     />
//                 </Col>
//                 <Col xs={24} md={8}>
//                     <StatusChart 
//                         data={driverStatusData}
//                         loading={loading}
//                     />
//                 </Col>
//             </Row>

//             <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
//                 <Col span={24}>
//                     <TopDriversTable 
//                         drivers={drivers.slice(0, 5)} // Top 5 haydovchilar
//                         loading={loading}
//                     />
//                 </Col>
//             </Row>
//         </>
//     );
// };

// export default Dashboard; 