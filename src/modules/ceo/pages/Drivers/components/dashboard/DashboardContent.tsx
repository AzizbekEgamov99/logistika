import React from 'react';
import { Row, Col, Card } from 'antd';
import { motion } from 'framer-motion';
import { CarOutlined } from '@ant-design/icons';
import { DriverType } from '../../../../../accounting/types/driver';
import StatCards from './StatCards';
import TopDriversSection from './TopDriversSection';
import DriversOnRoad from '../../components/DriversOnRoad';

interface DashboardContentProps {
  total: number;
  activeDriversCount: number;
  activeDriversPercentage: number;
  driversOnRoadCount: number;
  driversOnRoadPercentage: number;
  availableDriversCount: number;
  availableDriversPercentage: number;
  drivers: DriverType[];
  topDrivers: DriverType[];
  activeCars: any[];
  loading: boolean;
  setActiveTab: (tab: string) => void;
  onViewDriverHistory: (driver: DriverType) => void;
  onEditDriver: (driver: DriverType) => void;
  onDeleteDriver: (driver: DriverType) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  total,
  activeDriversCount,
  activeDriversPercentage,
  driversOnRoadCount,
  driversOnRoadPercentage,
  availableDriversCount,
  availableDriversPercentage,
  drivers,
  topDrivers,
  activeCars,
  loading,
  setActiveTab,
  onViewDriverHistory,
  onEditDriver,
  onDeleteDriver,
}) => {
  const handleViewAllClick = () => {
    setActiveTab('list');
  };

  const handleViewOnRoadClick = () => {
    setActiveTab('on-road');
  };

  return (
    <div className="drivers-dashboard">
      {/* Stats Cards */}
      <StatCards
        total={total}
        activeDriversCount={activeDriversCount}
        activeDriversPercentage={activeDriversPercentage}
        driversOnRoadCount={driversOnRoadCount}
        driversOnRoadPercentage={driversOnRoadPercentage}
        availableDriversCount={availableDriversCount}
        availableDriversPercentage={availableDriversPercentage}
        onViewAllClick={handleViewAllClick}
      />

      {/* Secondary content row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Top drivers section */}
        <Col xs={24} lg={12}>
          <TopDriversSection
            topDrivers={topDrivers}
            onViewAllClick={handleViewAllClick}
            onViewDriverHistory={onViewDriverHistory}
          />
        </Col>

        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          ></motion.div>
        </Col>
      </Row>

      {/* Current on-road drivers section */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card
              title={
                <>
                  <CarOutlined /> Hozirda yo'lda
                </>
              }
              className="content-card"
              extra={
                <a onClick={handleViewOnRoadClick} style={{ cursor: 'pointer' }}>
                  Batafsil
                </a>
              }
            >
              <DriversOnRoad
                drivers={drivers}
                loading={loading}
                activeCars={activeCars}
                enableActions={true}
                onEdit={onEditDriver}
                onDelete={onDeleteDriver}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent; 