import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Empty, Tabs, Input, Button } from 'antd';
import {
  CarOutlined,
  CompassOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import FleetFurgonTable from './FleetFurgonTable';
import styles from '../styles/Fleet.module.css';

const { TabPane } = Tabs;

// Define the vehicle types based on the data structures provided
interface Car {
  id?: number;
  name: string;
  number: string;
  photo?: string;
  year?: string;
  engine?: string;
  transmission?: string;
  power?: string;
  capacity?: string;
  fuel?: string;
  holat?: string;
  car_number?: string;
  mileage?: number;
  is_busy?: boolean;
  kilometer?: number;
  description?: string;
  [key: string]: string | number | boolean | undefined; // Allow dynamic access to properties
}

interface Furgon {
  id?: number;
  name: string;
  number: string;
  photo?: string;
  kilometer?: number;
  status?: string;
  description?: string;
  is_busy?: boolean;
  [key: string]: string | number | boolean | undefined; // Allow dynamic access to properties
}

interface StatusSummary {
  total?: number;
  inRoad?: number;
  available?: number;
}

interface Column {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (value: unknown, record: Car | Furgon) => React.ReactNode;
  onEdit?: (record: Car | Furgon) => void;
  onDelete?: (record: Car | Furgon) => void;
  onViewHistory?: (id: number) => void;
}

interface FleetTabsProps {
  activeTab: string;
  statusSummary: StatusSummary;
  filteredCars: Car[];
  filteredFurgons: Furgon[];
  carColumns: Column[];
  furgonColumns: Column[];
  handleSearch: (query: string) => void;
  handleAddCar: () => void;
  handleAddFurgon: () => void;
}

const FleetTabs: React.FC<FleetTabsProps> = ({
  activeTab,
  statusSummary,
  filteredCars,
  filteredFurgons,
  carColumns,
  furgonColumns,
  handleSearch,
  handleAddCar,
  handleAddFurgon,
}) => {
  const [searchText, setSearchText] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  };

  // Calculate actual statistics for the dashboard
  const getActualStats = () => {
    const busyCars = filteredCars.filter(car => car.is_busy).length;
    const busyFurgons = filteredFurgons.filter(furgon => furgon.is_busy).length;
    const availableCars = filteredCars.filter(car => !car.is_busy).length;
    const availableFurgons = filteredFurgons.filter(furgon => !furgon.is_busy).length;
    
    return {
      inRoad: busyCars + busyFurgons,
      available: availableCars + availableFurgons,
      total: filteredCars.length + filteredFurgons.length
    };
  };

  // Helper function to render the dashboard
  const renderDashboard = () => {
    const stats = getActualStats();
    
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Jami transport vositalari"
                value={stats.total || 0}
                prefix={<CarOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Yo'ldagi transport vositalari"
                value={stats.inRoad || 0}
                prefix={<CompassOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Mavjud transport vositalari"
                value={stats.available || 0}
                prefix={<CheckCircleOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Furgonlar"
                value={filteredFurgons.length || 0}
                prefix={<DashboardOutlined className={styles.statIcon} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Transport vositalari boshqaruvi" className={styles.mainCard}>
          <Tabs defaultActiveKey="1" className={styles.innerTabs}>
            <TabPane tab="Avtomobillar" key="1">
              <div className={styles.tableActions}>
                <Input
                  placeholder="Qidirish..."
                  prefix={<SearchOutlined />}
                  onChange={handleSearchChange}
                  style={{ width: 250, marginBottom: 16 }}
                  value={searchText}
                  allowClear
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddCar}
                >
                  Yangi avtomobil
                </Button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.vehicleTable}>
                  <thead>
                    <tr>
                      {carColumns.map((column, index) => (
                        <th key={index}>{column.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr key={car.id}>
                        {carColumns.map((column, index) => {
                          const dataIndex = column.dataIndex;
                          return (
                            <td key={index}>
                              {column.render 
                                ? column.render(dataIndex ? car[dataIndex] : undefined, car) 
                                : dataIndex && car[dataIndex]}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabPane>
            <TabPane tab="Furgonlar" key="2">
              <FleetFurgonTable
                furgons={filteredFurgons}
                isLoading={false}
                onEdit={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onEdit?.(furgon)}
                onDelete={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onDelete?.(furgon)}
                onAddNew={handleAddFurgon}
                onViewHistory={(id) => furgonColumns.find(col => col.key === 'actions')?.onViewHistory?.(id)}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  };

  // Helper function to render all vehicles tab
  const renderAllVehicles = () => {
    return (
      <Card title="Barcha transport vositalari" className={styles.mainCard}>
        <Tabs defaultActiveKey="1" className={styles.innerTabs}>
          <TabPane tab="Avtomobillar" key="1">
            <div className={styles.tableActions}>
              <Input
                placeholder="Qidirish..."
                prefix={<SearchOutlined />}
                onChange={handleSearchChange}
                style={{ width: 250, marginBottom: 16 }}
                value={searchText}
                allowClear
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddCar}
              >
                Yangi avtomobil
              </Button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.vehicleTable}>
                <thead>
                  <tr>
                    {carColumns.map((column, index) => (
                      <th key={index}>{column.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id}>
                      {carColumns.map((column, index) => {
                        const dataIndex = column.dataIndex;
                        return (
                          <td key={index}>
                            {column.render 
                              ? column.render(dataIndex ? car[dataIndex] : undefined, car) 
                              : dataIndex && car[dataIndex]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane tab="Furgonlar" key="2">
            <FleetFurgonTable
              furgons={filteredFurgons}
              isLoading={false}
              onEdit={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onEdit?.(furgon)}
              onDelete={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onDelete?.(furgon)}
              onAddNew={handleAddFurgon}
              onViewHistory={(id) => furgonColumns.find(col => col.key === 'actions')?.onViewHistory?.(id)}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  // Helper function to render road vehicles tab
  const renderRoadVehicles = () => {
    const roadCars = filteredCars.filter(car => car.is_busy);
    const roadFurgons = filteredFurgons.filter(furgon => furgon.is_busy);
    
    return (
      <Card title="Yo'ldagi transport vositalari" className={styles.mainCard}>
        <Tabs defaultActiveKey="1" className={styles.innerTabs}>
          <TabPane tab={`Avtomobillar (${roadCars.length})`} key="1">
            <div className={styles.tableActions}>
              <Input
                placeholder="Qidirish..."
                prefix={<SearchOutlined />}
                onChange={handleSearchChange}
                style={{ width: 250, marginBottom: 16 }}
                value={searchText}
                allowClear
              />
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.vehicleTable}>
                <thead>
                  <tr>
                    {carColumns.map((column, index) => (
                      <th key={index}>{column.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roadCars.map((car) => (
                    <tr key={car.id}>
                      {carColumns.map((column, index) => {
                        const dataIndex = column.dataIndex;
                        return (
                          <td key={index}>
                            {column.render 
                              ? column.render(dataIndex ? car[dataIndex] : undefined, car) 
                              : dataIndex && car[dataIndex]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane tab={`Furgonlar (${roadFurgons.length})`} key="2">
            <FleetFurgonTable
              furgons={roadFurgons}
              isLoading={false}
              onEdit={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onEdit?.(furgon)}
              onDelete={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onDelete?.(furgon)}
              onAddNew={handleAddFurgon}
              onViewHistory={(id) => furgonColumns.find(col => col.key === 'actions')?.onViewHistory?.(id)}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  // Helper function to render available vehicles tab
  const renderAvailableVehicles = () => {
    const availableCars = filteredCars.filter(car => !car.is_busy);
    const availableFurgons = filteredFurgons.filter(furgon => !furgon.is_busy);
    
    return (
      <Card title="Mavjud transport vositalari" className={styles.mainCard}>
        <Tabs defaultActiveKey="1" className={styles.innerTabs}>
          <TabPane tab={`Avtomobillar (${availableCars.length})`} key="1">
            <div className={styles.tableActions}>
              <Input
                placeholder="Qidirish..."
                prefix={<SearchOutlined />}
                onChange={handleSearchChange}
                style={{ width: 250, marginBottom: 16 }}
                value={searchText}
                allowClear
              />
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.vehicleTable}>
                <thead>
                  <tr>
                    {carColumns.map((column, index) => (
                      <th key={index}>{column.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availableCars.map((car) => (
                    <tr key={car.id}>
                      {carColumns.map((column, index) => {
                        const dataIndex = column.dataIndex;
                        return (
                          <td key={index}>
                            {column.render 
                              ? column.render(dataIndex ? car[dataIndex] : undefined, car) 
                              : dataIndex && car[dataIndex]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane tab={`Furgonlar (${availableFurgons.length})`} key="2">
            <FleetFurgonTable
              furgons={availableFurgons}
              isLoading={false}
              onEdit={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onEdit?.(furgon)}
              onDelete={(furgon) => furgonColumns.find(col => col.key === 'actions')?.onDelete?.(furgon)}
              onAddNew={handleAddFurgon}
              onViewHistory={(id) => furgonColumns.find(col => col.key === 'actions')?.onViewHistory?.(id)}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'all':
        return renderAllVehicles();
      case 'roadVehicles':
        return renderRoadVehicles();
      case 'availableVehicles':
        return renderAvailableVehicles();
      default:
        return <Empty description="Tab not found" />;
    }
  };

  return renderContent();
};

export default FleetTabs; 