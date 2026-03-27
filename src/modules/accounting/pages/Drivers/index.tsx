"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Typography, message, Row, Col, Statistic, Tabs, Layout, Button } from 'antd';
import { 
  TeamOutlined, 
  CarOutlined, 
  DashboardOutlined,
  CheckCircleOutlined,
  StarOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { useDrivers } from '../../hooks/useDrivers';
import { DriverType } from '../../types/driver';
import DriverHeader from './components/DriverHeader';
import DriversList from './components/DriversList';
import DriverModal from './components/DriverModal';
import TopDriversTable from './components/TopDriversTable';
import DriversOnRoad from './components/DriversOnRoad';
import axiosInstance from '@/api/axiosInstance';
import './styles/Drivers.css';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Content } = Layout;

/**
 * Main Drivers management component
 */
export const DriversPage: React.FC = () => {
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
        loading,
        total,
        filters,
        setFilters,
        deleteDriver,
        createDriverWithPhoto,
        updateDriverWithPhoto,
    } = useDrivers();

    // Fetch active cars for yo'ldagi haydovchilar count
    useEffect(() => {
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

    // Statistics
    const activeDrivers = drivers.filter(d => d.status === 'active' || d.status === 'driver').length;
    const onRouteDrivers = activeCars.length; // Using the count from car-active API
    
    // Top 5 drivers by trips (use rays_count instead of trips)
    const topDrivers = useMemo(() => {
        return [...drivers]
            .sort((a, b) => (b.rays_count || 0) - (a.rays_count || 0))
            .slice(0, 5);
    }, [drivers]);
    
    /**
     * Handles search input from the header
     */
    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
    };

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
            setFilters(prev => ({ ...prev }));
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Xatolik yuz berdi');
        }
    };

    const handleModalSubmit = async (formData: FormData) => {
        try {
            console.log('Modal submit called with mode:', modalMode);
            // Log form data for debugging
            console.log('Original FormData entries:');
            for (const pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }
            
            if (modalMode === 'create') {
                // Create a new FormData object to send to the API
                const apiFormData = new FormData();
                
                // Copy all entries from the form data, preserving file names
                for (const [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`Adding file to create FormData: ${key} = ${value.name}`);
                        apiFormData.append(key, value, value.name);
                    } else {
                        apiFormData.append(key, value);
                    }
                }
                
                // Use FormData in API call for proper file upload
                await createDriverWithPhoto(apiFormData);
                message.success('Haydovchi muvaffaqiyatli qo`shildi');
            } else if (selectedDriver) {
                // Update driver with FormData for proper file handling
                const apiFormData = new FormData();
                
                // Copy all entries from the form data, preserving file names
                for (const [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`Adding file to update FormData: ${key} = ${value.name}`);
                        apiFormData.append(key, value, value.name);
                    } else {
                        apiFormData.append(key, value);
                    }
                }
                
                // Include the driver ID if missing
                if (!apiFormData.has('id') && selectedDriver.id) {
                    apiFormData.append('id', selectedDriver.id.toString());
                }
                
                // Verify photo in FormData before sending
                if (apiFormData.has('photo')) {
                    const photo = apiFormData.get('photo');
                    if (photo instanceof File) {
                        console.log('Photo in update FormData:', photo.name, photo.size, photo.type);
                    } else {
                        console.log('Photo in update FormData is not a File:', photo);
                    }
                } else {
                    console.log('No photo in update FormData');
                }
                
                await updateDriverWithPhoto(selectedDriver.id, apiFormData);
                message.success('Haydovchi muvaffaqiyatli yangilandi');
            }
            setIsModalVisible(false);
        } catch (err) {
            console.error("Submit error:", err);
            const e: any = err;
            const detail =
                e?.response?.data?.detail ||
                e?.response?.data?.message ||
                e?.data?.detail ||
                e?.data?.message;
            const status = e?.response?.status;
            message.error(
                detail
                    ? `Xatolik${status ? ` (${status})` : ''}: ${detail}`
                    : `Xatolik yuz berdi${status ? ` (${status})` : ''}.`
            );
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
                            value={activeDrivers}
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
                            value={onRouteDrivers}
                            prefix={<CarOutlined />}
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={16}>
                    <Card 
                        title={<><StarOutlined /> Eng faol haydovchilar</>}
                        style={{ borderRadius: '12px' }}
                        extra={
                            <Link href="/drivers/salary">
                                <Button type="primary" icon={<WalletOutlined />}>
                                    Maoshlar boshqaruvi
                                </Button>
                            </Link>
                        }
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
            label: <span><TeamOutlined /> Haydovchilar ro`yxati</span>,
            children: driversListContent
        },
        {
            key: 'on-road',
            label: <span><CarOutlined /> Yo`ldagi haydovchilar</span>,
            children: <DriversOnRoad 
                drivers={drivers} 
                loading={loading || loadingActiveCars} 
                activeCars={activeCars} 
            />
        }
    ];

    return (
        <Layout>
            <Content>
                <Card 
                    title={<Title level={4}><TeamOutlined /> Haydovchilar boshqaruvi</Title>}
                    styles={{ body: { padding: 16 } }}
                >
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        style={{ marginBottom: 16 }}
                        items={tabItems}
                    />
                    
                    <DriverModal
                        visible={isModalVisible}
                        mode={modalMode}
                        driver={selectedDriver}
                        onClose={() => setIsModalVisible(false)}
                        onSubmit={handleModalSubmit}
                    />
                </Card>
            </Content>
        </Layout>
    );
};export default DriversPage;

