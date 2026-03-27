import React, { useState, useEffect } from 'react';
import {
    Layout, Row, Col, Card, Button, Input, Tag, Space, Typography,
    Avatar, Tooltip, Segmented, Popconfirm, Empty, Tabs, message,
    Table
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CarOutlined, CheckCircleOutlined,
    PlusOutlined, EditOutlined, DeleteOutlined,
    DashboardOutlined, CalendarOutlined, AppstoreOutlined, BarsOutlined,
    SearchOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useCars, useCarStatus } from '../../hooks/useCars';
import CarModal from './components/CarModal';
import { Car, CarResponse } from '../../types/car.types';
import CarDetailsDrawer from './components/CarDetailsDrawer';
import styles from './styles/cars.module.css';
import { useRouter } from 'next/navigation';
import { formatImageUrl } from '@/api/axiosInstance';
import RoadCars from './pages/RoadCars/RoadCars';
import AvailableCars from './pages/AvailableCars/AvailableCars';

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

const convertToCarType = (car: Car | null): any => {
    if (!car) return null;
    return {
        id: car.id,
        name: car.name,
        number: car.number,
        car_number: car.car_number,
        year: car.year,
        engine: car.engine,
        transmission: car.transmission,
        power: car.power,
        capacity: car.capacity,
        fuel: car.fuel,
        mileage: car.mileage,
        holat: car.holat,
        photo: car.photo || null,
        user: null,
        driver: car.driver,
        kilometer: car.kilometer,
        is_busy: car.is_busy
    };
};

export const CarsPage: React.FC<{ basePath?: string }> = ({ basePath = '/modules/accounting' }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const {
        cars,
        createCar,
        updateCar,
        deleteCar,
    } = useCars();

    const { inRaysCount, availableCount } = useCarStatus();

    const router = typeof window !== "undefined" ? useRouter() : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.car_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: cars.length || 0,
        active: cars.filter(car => car.holat === 'foal').length || 0,
        waiting: cars.filter(car => car.holat === 'kutmoqda').length || 0,
        inRays: inRaysCount || 0,
        available: availableCount || 0
    };

    const handleAdd = () => {
        setSelectedCar(null);
        setIsModalVisible(true);
    };

    const handleEdit = (car: Car) => {
        setSelectedCar(car);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCar(id);
        } catch (error) {
            console.error("O'chirishda xatolik yuz berdi", error);
        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const navigateToCarHistory = (carId: number) => {
        if (mounted && carId) {
            if (router) {
                router.push(`${basePath}/cars/${carId}/history`);
            } else {
                window.location.href = `${basePath}/cars/${carId}/history`;
            }
        }
    };

    const handleModalSubmit = async (formData: FormData) => {
        try {
            if (selectedCar?.id) {
                const values: any = {};
                for (let [key, value] of formData.entries()) {
                    values[key] = value;
                }

                await updateCar({
                    ...values,
                    id: selectedCar.id,
                    photo: formData.get('photo') instanceof File ? formData.get('photo') : undefined
                });
            } else {
                // For creating a new car, use the FormData directly
                await createCar(formData);
            }

            setIsModalVisible(false);
        } catch (error) {
            console.error('Submit error:', error);
            if (error.response?.data) {
                // Format and display validation errors
                const errors = error.response.data;
                const errorMessages = Object.entries(errors)
                    .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                    .join('\n');

                message.error(`Xatoliklar mavjud:\n${errorMessages}`);
            } else {
                message.error('Xatolik yuz berdi');
            }
        }
    };

    // Get status color for car status tag
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'foal': return 'success';
            case 'kutmoqda': return 'processing';
            default: return 'default';
        }
    };

    // Get status text for car status tag
    const getStatusText = (status: string) => {
        switch (status) {
            case 'foal': return 'Faol';
            case 'kutmoqda': return 'Kutmoqda';
            default: return status;
        }
    };

    // Cars grid rendering function
    const renderCarsGrid = () => {
        if (filteredCars.length === 0) {
            return (
                <Empty
                    description="Transport vositalari topilmadi"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className={styles.emptyState}
                />
            );
        }

        if (viewMode === 'table') {
            const columns: ColumnsType<CarResponse> = [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    width: 70
                },
                {
                    title: 'Nomi',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: 'Raqami',
                    dataIndex: 'car_number',
                    key: 'car_number'
                },
                {
                    title: 'Kilometr',
                    dataIndex: 'mileage',
                    key: 'mileage',
                    render: (km) => `${km} km`
                },
                {
                    title: 'Ishlab chiqarilgan yili',
                    dataIndex: 'year',
                    key: 'year'
                },
                {
                    title: 'Holati',
                    dataIndex: 'holat',
                    key: 'holat',
                    render: (status: string) => (
                        <Tag color={getStatusColor(status || '')}>
                            {getStatusText(status)}
                        </Tag>
                    )
                },
                {
                    title: 'Amallar',
                    key: 'actions',
                    width: 150,
                    render: (_: any, record: CarResponse) => (
                        <Space>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(record as unknown as Car);
                                }}
                            />
                            <Popconfirm
                                title="Transportni o'chirmoqchimisiz?"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    record.id && handleDelete(record.id);
                                }}
                                okText="Ha"
                                cancelText="Yo'q"
                            >
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Popconfirm>
                            <Button
                                type="text"
                                icon={<HistoryOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToCarHistory(record.id || 0);
                                }}
                            />
                        </Space>
                    )
                }
            ];

            return (
                <Table
                    dataSource={filteredCars}
                    columns={columns}
                    rowKey="id"
                    className={styles.carsTable}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => navigateToCarHistory(record.id || 0)
                    })}
                />
            );
        }

        // Default: Card view
        return (
            <Row gutter={[16, 16]} className={styles.carsGrid}>
                {filteredCars.map(car => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={car.id}>
                        <Card
                            key={car.id}
                            className={styles.carCard}
                            hoverable
                            cover={
                                car.photo ? (
                                    <div className={styles.carImageContainer}>
                                        <img
                                            alt={car.name}
                                            src={formatImageUrl(car.photo) || undefined}
                                            className={styles.carImage}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.carImagePlaceholder}>
                                        <CarOutlined className={styles.carIcon} />
                                    </div>
                                )
                            }
                            onClick={() => navigateToCarHistory(car.id || 0)}
                            extra={
                                <div>
                                    <Tag
                                        color={getStatusColor(car.holat || '')}
                                        className={styles.statusTag}
                                    >
                                        {getStatusText(car.holat)}
                                    </Tag>
                                </div>
                            }
                            actions={[
                                <Tooltip title="Tahrirlash" key="edit">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(car as Car);
                                        }}
                                    />
                                </Tooltip>,
                                <Popconfirm
                                    title="Transportni o'chirmoqchimisiz?"
                                    onConfirm={(e) => {
                                        e?.stopPropagation();
                                        car.id && handleDelete(car.id);
                                    }}
                                    okText="Ha"
                                    cancelText="Yo'q"
                                    key="delete"
                                >
                                    <Button
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Popconfirm>,
                                <Tooltip title="Tarixni ko'rish" key="history">
                                    <Button
                                        type="text"
                                        icon={<HistoryOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToCarHistory(car.id || 0);
                                        }}
                                    />
                                </Tooltip>
                            ]}
                        >
                            <div className={styles.carMetaContent}>
                                <Title level={5} className={styles.carTitle}>{car.name}</Title>
                                <Space direction="vertical" size="small" className={styles.carDetails}>
                                    <div className={styles.detailItem}>
                                        <Text type="secondary"><CarOutlined /> Raqami:</Text>
                                        <Text strong>{car.car_number}</Text>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Text type="secondary"><DashboardOutlined /> Kilometr:</Text>
                                        <Text>{car.mileage} km</Text>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Text type="secondary"><CalendarOutlined /> Ishlab chiqarilgan yili:</Text>
                                        <Text>{car.year}</Text>
                                    </div>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    // Tabs for different views
    const items = [
        {
            key: 'all',
            label: `Barcha transportlar (${stats.total})`,
            children: (
                <Card className={styles.mainCard}>
                    <div className={styles.tableControls}>
                        <Search
                            placeholder="Transport qidirish"
                            onSearch={handleSearch}
                            allowClear
                            className={styles.searchInput}
                            prefix={<SearchOutlined />}
                        />
                        <Segmented
                            options={[
                                {
                                    value: 'cards',
                                    icon: <AppstoreOutlined />,
                                },
                                {
                                    value: 'table',
                                    icon: <BarsOutlined />,
                                },
                            ]}
                            value={viewMode}
                            onChange={(value) => setViewMode(value as 'table' | 'cards')}
                        />
                    </div>
                    {renderCarsGrid()}
                </Card>
            )
        },
        {
            key: 'roadCars',
            label: `Yo'ldagi transportlar (${stats.inRays})`,
            children: <RoadCars />
        },
        {
            key: 'availableCars',
            label: `Mavjud transportlar (${stats.available})`,
            children: <AvailableCars />
        }
    ];

    if (!mounted) {
        return null;
    }

    return (
        <Layout className={styles.carsPage}>
            <Content className={styles.carsContent}>
                <div className={styles.pageHeader}>
                    <div>
                        <Title level={4} className={styles.pageTitle}>
                            <CarOutlined /> Transportlar boshqaruvi
                        </Title>
                        <Text type="secondary">Transport vositalarini ko`ring va boshqaring</Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        size="large"
                    >
                        Yangi transport qo`shish
                    </Button>
                </div>

                {/* Statistics cards */}
                <Row gutter={[16, 16]} className={styles.statsCards}>
                    <Col xs={24} sm={8} md={8}>
                        <Card className={styles.statCard}>
                            <Space align="start">
                                <Avatar size={48} className={styles.statIcon} icon={<CarOutlined />} />
                                <div>
                                    <Text type="secondary">Jami transportlar</Text>
                                    <Title level={3}>{stats.total}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} md={8}>
                        <Card className={styles.statCard}>
                            <Space align="start">
                                <Avatar size={48} className={styles.statActiveIcon} icon={<CheckCircleOutlined />} />
                                <div>
                                    <Text type="secondary">Faol transportlar</Text>
                                    <Title level={3}>{stats.active}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} md={8}>
                        <Card className={styles.statCard}>
                            <Space align="start">
                                <Avatar size={48} className={styles.statIcon} icon={<CarOutlined />} />
                                <div>
                                    <Text type="secondary">Yo`dagi transportlar</Text>
                                    <Title level={3}>{stats.inRays}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    type="card"
                    size="large"
                    className={styles.carsTabs}
                />

                <CarModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSubmit={handleModalSubmit}
                    initialValues={convertToCarType(selectedCar)}
                />

                <CarDetailsDrawer
                    visible={isDrawerVisible}
                    car={convertToCarType(selectedCar)}
                    onClose={() => setIsDrawerVisible(false)}
                    onEdit={(car) => handleEdit(car as unknown as Car)}
                    onDelete={handleDelete}
                />
            </Content>
        </Layout>
    );
};

export default CarsPage;