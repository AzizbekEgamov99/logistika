"use client"

import React, { useState } from 'react';
import { Tabs, Layout, Card, Typography, Button, Modal } from "antd";
import { motion } from "framer-motion";
import {
  DashboardOutlined,
  CarOutlined,
  CompassOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { DashboardLayout } from '../../components/layout/DashboardLayout';

// Import custom hooks
import { useFleetData } from '../../hooks/useFleetData';
import { useVehicleColumns } from '../../hooks/useVehicleColumns';

// Import components from our components directory
import { FleetTabs } from './components/sections';
import { LoadingState } from './components/common';
import { ModalContainer } from './components/modals';

const { Content } = Layout;
const { Title, Text } = Typography;

const Fleet = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isCarModalVisible, setIsCarModalVisible] = useState(false);
  const [isFurgonModalVisible, setIsFurgonModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedFurgon, setSelectedFurgon] = useState(null);

  // Get fleet data from custom hook
  const { 
    statusSummary,
    filteredCars,
    filteredFurgons,
    isLoading,
    handleSearch,
    handleAddCar: addCar,
    handleUpdateCar,
    handleDeleteCar: deleteCar,
    handleAddFurgon: addFurgon,
    handleUpdateFurgon,
    handleDeleteFurgon: deleteFurgon
  } = useFleetData();

  // Handle car modal functions
  const handleAddCar = () => {
    setSelectedCar(null);
    setIsCarModalVisible(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setIsCarModalVisible(true);
  };

  const handleCarModalSubmit = async (formData) => {
    try {
      if (selectedCar?.id) {
        await handleUpdateCar(selectedCar.id, formData);
      } else {
        await addCar(formData);
      }
      setIsCarModalVisible(false);
    } catch (error) {
      console.error('Car operation error:', error);
    }
  };

  // Handle furgon modal functions
  const handleAddFurgon = () => {
    setSelectedFurgon(null);
    setIsFurgonModalVisible(true);
  };

  const handleEditFurgon = (furgon) => {
    setSelectedFurgon(furgon);
    setIsFurgonModalVisible(true);
  };

  const handleFurgonModalSubmit = async (formData) => {
    try {
      if (selectedFurgon?.id) {
        await handleUpdateFurgon(selectedFurgon.id, formData);
      } else {
        await addFurgon(formData);
      }
      setIsFurgonModalVisible(false);
    } catch (error) {
      console.error('Furgon operation error:', error);
    }
  };

  const handleViewCarHistory = (carId) => {
    if (carId) {
      window.location.href = `/modules/ceo/fleet/${carId}/history`;
    }
  };

  const handleViewFurgonHistory = (furgonId) => {
    if (furgonId) {
      window.location.href = `/modules/ceo/fleet/furgon/${furgonId}/history`;
    }
  };

  const handleDeleteCar = (car) => {
    console.log('Fleet.tsx: handleDeleteCar called with car:', car);
    if (car && car.id) {
      try {
        deleteCar(car.id);
        console.log('Fleet.tsx: deleteCar function called successfully');
      } catch (error) {
        console.error('Fleet.tsx: Error in deleteCar:', error);
      }
    } else {
      console.error('Fleet.tsx: Invalid car object for deletion:', car);
    }
  };

  const handleDeleteFurgon = (furgon) => {
    console.log('Fleet.tsx: handleDeleteFurgon called with furgon:', furgon);
    if (furgon && furgon.id) {
      try {
        deleteFurgon(furgon.id);
        console.log('Fleet.tsx: deleteFurgon function called successfully');
      } catch (error) {
        console.error('Fleet.tsx: Error in deleteFurgon:', error);
      }
    } else {
      console.error('Fleet.tsx: Invalid furgon object for deletion:', furgon);
    }
  };

  // Get table columns from custom hook
  const { carColumns, furgonColumns } = useVehicleColumns(
    handleEditCar,
    handleDeleteCar,
    handleViewCarHistory,
    handleEditFurgon,
    handleDeleteFurgon,
    handleViewFurgonHistory
  );

  // Add action functions to columns
  const enhancedCarColumns = carColumns.map(column => {
    if (column.key === 'actions') {
      return { 
        ...column, 
        onEdit: handleEditCar,
        onDelete: handleDeleteCar,
        onViewHistory: handleViewCarHistory
      };
    }
    return column;
  });

  const enhancedFurgonColumns = furgonColumns.map(column => {
    if (column.key === 'actions') {
      return { 
        ...column, 
        onEdit: handleEditFurgon,
        onDelete: handleDeleteFurgon,
        onViewHistory: handleViewFurgonHistory
      };
    }
    return column;
  });

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  const tabItems = [
    {
      key: 'dashboard',
      label: <span><DashboardOutlined /> Dashboard</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FleetTabs
            activeTab="dashboard"
            statusSummary={statusSummary}
            filteredCars={filteredCars}
            filteredFurgons={filteredFurgons}
            carColumns={enhancedCarColumns}
            furgonColumns={enhancedFurgonColumns}
            handleSearch={handleSearch}
            handleAddCar={handleAddCar}
            handleAddFurgon={handleAddFurgon}
          />
        </motion.div>
      )
    },
    {
      key: 'all',
      label: <span><UnorderedListOutlined /> Barcha transport vositalari</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FleetTabs
            activeTab="all"
            statusSummary={statusSummary}
            filteredCars={filteredCars}
            filteredFurgons={filteredFurgons}
            carColumns={enhancedCarColumns}
            furgonColumns={enhancedFurgonColumns}
            handleSearch={handleSearch}
            handleAddCar={handleAddCar}
            handleAddFurgon={handleAddFurgon}
          />
        </motion.div>
      )
    },
    {
      key: 'roadVehicles',
      label: <span><CompassOutlined /> Yo`ldagi transport</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FleetTabs
            activeTab="roadVehicles"
            statusSummary={statusSummary}
            filteredCars={filteredCars}
            filteredFurgons={filteredFurgons}
            carColumns={enhancedCarColumns}
            furgonColumns={enhancedFurgonColumns}
            handleSearch={handleSearch}
            handleAddCar={handleAddCar}
            handleAddFurgon={handleAddFurgon}
          />
        </motion.div>
      )
    },
    {
      key: 'availableVehicles',
      label: <span><CheckCircleOutlined /> Mavjud transport</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FleetTabs
            activeTab="availableVehicles"
            statusSummary={statusSummary}
            filteredCars={filteredCars}
            filteredFurgons={filteredFurgons}
            carColumns={enhancedCarColumns}
            furgonColumns={enhancedFurgonColumns}
            handleSearch={handleSearch}
            handleAddCar={handleAddCar}
            handleAddFurgon={handleAddFurgon}
          />
        </motion.div>
      )
    }
  ];

  return (
    <DashboardLayout title="Transport vositalari" subtitle="Avtomobil va furgonlar ma'lumotlari">
      <Layout>
        <Content style={{ padding: '16px' }}>
          {/* Page header with title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <Title level={4} style={{ marginBottom: '4px' }}>
                <CarOutlined /> Transport vositalari boshqaruvi
              </Title>
              <Text type="secondary">Transport vositalari ma`lumotlarini ko`ring va boshqaring</Text>
            </div>
            <div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddCar}
                size="large"
                style={{ marginRight: '8px' }}
              >
                Yangi avtomobil
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddFurgon}
                size="large"
              >
                Yangi furgon
              </Button>
            </div>
          </div>
          
          {/* Main content card */}
          <Card variant="borderless">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              type="card"
              size="large"
              items={tabItems}
            />
          </Card>
        </Content>
      </Layout>

      {/* Modals */}
      <ModalContainer
        isCarModalVisible={isCarModalVisible}
        isFurgonModalVisible={isFurgonModalVisible}
        selectedCar={selectedCar}
        selectedFurgon={selectedFurgon}
        setIsCarModalVisible={setIsCarModalVisible}
        setIsFurgonModalVisible={setIsFurgonModalVisible}
        handleCarModalSubmit={handleCarModalSubmit}
        handleFurgonModalSubmit={handleFurgonModalSubmit}
      />
    </DashboardLayout>
  );
};

export default Fleet; 