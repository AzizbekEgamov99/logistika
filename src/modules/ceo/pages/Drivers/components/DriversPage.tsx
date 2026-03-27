"use client";
import React, { useState } from 'react';
import { Card, Typography, message, Row, Col, Statistic, Tabs, Layout } from 'antd';
import { 
  TeamOutlined, 
  CarOutlined, 
  DashboardOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useCEODrivers } from '../../../hooks/useCEODrivers';
import { DriverType } from '../../../../accounting/types/driver';
import DriverHeader from './DriverHeader';
import DriversList from './DriversList';
import DriverModal from './DriverModal';
import TopDriversTable from './TopDriversTable';
import DriversOnRoad from './DriversOnRoad';
import axiosInstance from '@/api/axiosInstance';
import '../styles/Drivers.css';

const { Title, Text } = Typography;
const { Content } = Layout;

/**
 * Main Drivers management component for CEO module
 */
const DriversPage: React.FC = () => {
    // State management
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<DriverType | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeCars, setActiveCars] = useState([]);
    const [loadingActiveCars, setLoadingActiveCars] = useState(false);
    
    // Fetch drivers data using the hook
    const {
        drivers,
        total,
        loading,
        filters,
        setFilters,
        handleSearch,
        handleTableChange,
        createDriver,
        updateDriver,
        deleteDriver,
        activeDriversCount,
        driversOnTripCount
    } = useCEODrivers();

    // Fetch active cars for yo'ldagi haydovchilar count
    React.useEffect(() => {
        const fetchActiveCars = async () => {
            try {
                setLoadingActiveCars(true);
                const response = await axiosInstance.get('/car-active/');
                setActiveCars(response.data || []);
            } catch (err) {
                console.error('Error fetching active cars:', err);
            } finally {
                setLoadingActiveCars(false);
            }
        };

        fetchActiveCars();
    }, []);
    
    // Top 5 drivers by trips (use rays_count instead of trips)
    const topDrivers = React.useMemo(() => {
        return [...drivers]
            .sort((a, b) => (b.rays_count || 0) - (a.rays_count || 0))
            .slice(0, 5);
    }, [drivers]);
    
    /**
     * Opens the driver creation modal
     */
    const handleAddDriver = () => {
        setModalMode('create');
        setSelectedDriver(null);
        setIsModalVisible(true);
    };

    /**
     * Opens the driver edit modal with the selected driver
     */
    const handleEditDriver = (driver: DriverType) => {
        setModalMode('edit');
        setSelectedDriver(driver);
        setIsModalVisible(true);
    };

    /**
     * Handles driver deletion with confirmation
     */
    const handleDeleteDriver = async (driver: DriverType) => {
        if (!driver || !driver.id) {
            message.error('Haydovchi ma\'lumotlari topilmadi');
            return;
        }

        try {
            await deleteDriver(driver.id);
            message.success('Haydovchi muvaffaqiyatli o`chirildi');
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Xatolik yuz berdi');
        }
    };

    const handleModalSubmit = async (values: Partial<DriverType>) => {
        try {
            if (modalMode === 'create') {
                await createDriver(values);
                message.success('Haydovchi muvaffaqiyatli qo`shildi');
            } else if (selectedDriver) {
                await updateDriver(selectedDriver.id, values);
                message.success('Haydovchi muvaffaqiyatli yangilandi');
            }
            setIsModalVisible(false);
        } catch (err) {
            console.error("Submit error:", err);
            message.error('Xatolik yuz berdi');
        }
    };

    // Dashboard tab content
    const dashboardContent = (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                            borderRadius: '12px',
                        }}
                        styles={{
                            body: { padding: '16px' }
                        }}
                    >
                        <Statistic 
                            title={<Text style={{ color: '#fff' }}>Jami haydovchilar</Text>}
                            value={total}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                            borderRadius: '12px'
                        }}
                        styles={{
                            body: { padding: '16px' }
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#fff' }}>Faol haydovchilar</Text>}
                            value={activeDriversCount}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                            borderRadius: '12px'
                        }}
                        styles={{
                            body: { padding: '16px' }
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#fff' }}>Yo'ldagi haydovchilar</Text>}
                            value={activeCars.length}
                            prefix={<CarOutlined />}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Card 
                        title={<><StarOutlined /> Eng faol haydovchilar</>}
                        style={{ borderRadius: '12px' }}
                        styles={{
                            body: { padding: '0' }
                        }}
                    >
                        <TopDriversTable drivers={topDrivers} loading={loading} />
                    </Card>
                </Col>
            </Row>
        </>
    );

    // Driver list tab content
    const driversListContent = (
        <>
            <DriverHeader
                onSearch={handleSearch}
                onAddDriver={handleAddDriver}
            />
            <DriversList
                drivers={drivers}
                loading={loading}
                total={total}
                onEdit={handleEditDriver}
                onDelete={handleDeleteDriver}
                filters={filters}
                onFiltersChange={setFilters}
            />
        </>
    );

    // Tab items
    const tabItems = [
        {
            key: 'dashboard',
            label: <span><DashboardOutlined /> Dashboard</span>,
            children: dashboardContent
        },
        {
            key: 'list',
            label: <span><TeamOutlined /> Haydovchilar ro'yxati</span>,
            children: driversListContent
        },
        {
            key: 'on-road',
            label: <span><CarOutlined /> Yo'ldagi haydovchilar</span>,
            children: <DriversOnRoad 
                drivers={drivers} 
                loading={loading || loadingActiveCars} 
                activeCars={activeCars} 
            />
        }
    ];

    return (
        <Content className="site-layout-content ceo-drivers-page">
            <Title level={2}>Haydovchilar boshqaruvi</Title>
            <Card className="main-card">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    type="card"
                />
            </Card>

            {/* Driver creation/edit modal */}
            {isModalVisible && (
                <DriverModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSubmit={handleModalSubmit}
                    initialValues={selectedDriver}
                    mode={modalMode}
                />
            )}
        </Content>
    );
};

export default DriversPage; 