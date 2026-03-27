import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Avatar, Timeline, Badge, Select, DatePicker } from 'antd';
import {
    CarOutlined,
    DollarOutlined,
    StarOutlined,
    UserOutlined,
    RiseOutlined,
    CalendarOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../styles/DriverInfo.css';
import { Button } from 'antd/es/radio';

const { RangePicker } = DatePicker;

const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const DriverProfile = () => {
    const driverInfo = {
        name: "Abdullayev Jahongir",
        id: "HD-2024-001",
        experience: "5 yil",
        status: "Faol",
        rating: 4.8,
        totalTrips: 2584,
        profileImg: null
    };

    return (
        <motion.div variants={itemAnimation} className="profile-section">
            <Card className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            className="profile-avatar"
                        />
                        <Badge
                            status="success"
                            text="Online"
                            className="status-badge"
                        />
                    </div>
                    <div className="profile-info">
                        <h2>{driverInfo.name}</h2>
                        <div className="profile-tags">
                            <Tag color="blue">ID: {driverInfo.id}</Tag>
                            <Tag color="green">Tajriba: {driverInfo.experience}</Tag>
                            <Tag color="gold" icon={<StarOutlined />}>{driverInfo.rating}</Tag>
                        </div>
                        <div className="profile-stats">
                            <div className="stat-item">
                                <CarOutlined />
                                <span>{driverInfo.totalTrips} safar</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Row gutter={[16, 16]} className="profile-metrics">
                    <Col span={8}>
                        <Statistic
                            title="Bugungi masofa"
                            value={245}
                            suffix="km"
                            prefix={<CarOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="O'rtacha tezlik"
                            value={65}
                            suffix="km/s"
                            prefix={<ThunderboltOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Yoqilg'i sarfi"
                            value={8.5}
                            suffix="l/100km"
                            prefix={<SafetyOutlined />}
                        />
                    </Col>
                </Row>
            </Card>
        </motion.div>
    );
};

const Performance = () => {
    const performanceData = {
        currentRating: 85,
        monthlyStats: {
            totalDistance: 5240,
            avgRating: 4.8,
            completedTrips: 182,
            onTimeRate: 97
        }
    };

    return (
        <motion.div variants={itemAnimation} className="performance-section">
            <Card title="Samaradorlik ko'rsatkichlari" className="performance-card">
                <div className="rating-circle">
                    <Progress
                        type="circle"
                        percent={performanceData.currentRating}
                        format={percent => <div className="rating-text">
                            <div className="rating-value">{percent}</div>
                            <div className="rating-label">Reyting</div>
                        </div>}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>

                <Row gutter={[16, 16]} className="performance-metrics">
                    <Col span={12}>
                        <Card className="metric-mini-card">
                            <Statistic
                                title="Umumiy masofa"
                                value={performanceData.monthlyStats.totalDistance}
                                suffix="km"
                                prefix={<CarOutlined className="stats-icon" />}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card className="metric-mini-card">
                            <Statistic
                                title="Bajarilgan safarlar"
                                value={performanceData.monthlyStats.completedTrips}
                                prefix={<CheckCircleOutlined className="stats-icon" />}
                            />
                        </Card>
                    </Col>
                </Row>

                <div className="performance-progress">
                    <div className="progress-item">
                        <span>O`z vaqtida yetkazish</span>
                        <Progress
                            percent={performanceData.monthlyStats.onTimeRate}
                            strokeColor="#87d068"
                            size="small"
                        />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const FinancialReport = () => {
    const financialData = {
        earnings: [
            {
                date: '2024-02-23', amount: 1200000, type: 'Yo`lovchi tashish', status: 'completed'
            },
            { date: '2024-02-23', amount: 850000, type: 'Yuk tashish', status: 'completed' },
            { date: '2024-02-22', amount: 950000, type: 'Maxsus buyurtma', status: 'pending' },
            { date: '2024-02-22', amount: 750000, type: 'Yo`lovchi tashish', status: 'completed' },
        ],
        expenses: [
            {
                date: '2024-02-23', amount: 450000, type: 'Yoqilg`i', category: 'essential'
            },
            {
                date: '2024-02-22', amount: 200000, type: 'Ta`mirlash', category: 'maintenance'
            },
            { date: '2024-02-21', amount: 150000, type: 'Yo`l to`lovi', category: 'other' },
        ]
    };

    const columns = [
        {
            title: 'Sana',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => (
                <span className="date-cell">
                    <CalendarOutlined /> {date}
                </span>
            )
        },
        {
            title: 'Summa',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <span className="amount-cell">
                    {amount.toLocaleString()} so`m
                </span>
            )
        },
        {
            title: 'Turi',
            dataIndex: 'type',
            key: 'type',
            render: (type: string, record: { status: string }) => (
                <Tag color={record.status === 'completed' ? 'green' : 'gold'}>
                    {type}
                </Tag>
            )
        },
        {
            title: 'Holati',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Badge
                    status={status === 'completed' ? 'success' : 'processing'}
                    text={status === 'completed' ? 'Yakunlangan' : 'Jarayonda'}
                />
            )
        }
    ];

    return (
        <motion.div variants={itemAnimation} className="financial-section">
            <Card
                title="Moliyaviy hisobot"
                extra={
                    <div className="financial-filters">
                        <RangePicker className="date-range" />
                        <Select
                            defaultValue="all"
                            className="type-select"
                            options={[
                                { value: 'all', label: 'Barcha turlari' },
                                { value: 'income', label: 'Daromadlar' },
                                { value: 'expense', label: 'Xarajatlar' }
                            ]}
                        />
                    </div>
                }
                className="financial-card"
            >
                <div className="summary-section">
                    <Row gutter={16}>
                        <Col span={8}>
                            <div className="summary-card income">
                                <Statistic
                                    title="Jami daromad"
                                    value={3750000}
                                    suffix="$"
                                    prefix={<RiseOutlined />}
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="summary-card expense">
                                <Statistic
                                    title="Jami xarajat"
                                    value={800000}
                                    suffix="$"
                                    prefix={<DollarOutlined />}
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="summary-card profit">
                                <Statistic
                                    title="Sof foyda"
                                    value={2950000}
                                    suffix="$"
                                    prefix={<RiseOutlined />}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                <Table
                    dataSource={financialData.earnings}
                    columns={columns}
                    className="financial-table"
                    pagination={false}
                />
            </Card>
        </motion.div>
    );
};

const Schedule = () => {
    const scheduleData = [
        {
            date: '2024-02-24',
            time: '09:00',
            type: 'Yo`lovchi tashish',
            route: 'Toshkent → Samarqand',
            status: 'upcoming'
        },
        {
            date: '2024-02-24',
            time: '15:00',
            type: 'Texnik ko`rik',
            location: 'Asosiy Servis Markazi',
            status: 'important'
        },
        {
            date: '2024-02-25',
            time: '10:00',
            type: 'Maxsus buyurtma',
            route: 'Toshkent → Buxoro',
            status: 'confirmed'
        }
    ];

    return (
        <motion.div variants={itemAnimation} className="schedule-section">
            <Card
                title="Jadval"
                extra={<Button type="primary">Yangi safar</Button>}
                className="schedule-card"
            >
                <Timeline
                    mode="left"
                    items={scheduleData.map(item => ({
                        color: item.status === 'important' ? 'red' : 'blue',
                        label: `${item.date} ${item.time}`,
                        children: (
                            <div className="schedule-item">
                                <div className="schedule-title">{item.type}</div>
                                <div className="schedule-details">
                                    {item.route || item.location}
                                </div>
                                <Tag color={
                                    item.status === 'upcoming' ? 'gold' :
                                        item.status === 'important' ? 'red' : 'green'
                                }>
                                    {item.status === 'upcoming' ? 'Kutilmoqda' :
                                        item.status === 'important' ? 'Muhim' : 'Tasdiqlangan'}
                                </Tag>
                            </div>
                        )
                    }))}
                />
            </Card>
        </motion.div>
    );

}; export function Dashboard() {
    return (
        <motion.div
            className="dashboard-container"
            variants={containerAnimation}
            initial="hidden"
            animate="show"
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <DriverProfile />
                </Col>
                <Col xs={24} lg={12}>
                    <Performance />
                </Col>
                <Col xs={24}>
                    <FinancialReport />
                </Col>
                <Col xs={24}>
                    <Schedule />
                </Col>
            </Row>
        </motion.div>
    );
}