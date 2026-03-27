import React from 'react';
import { Card, Table, Tag, Button, Tooltip, Empty, Spin } from 'antd';
import { 
    CarOutlined, 
    EyeOutlined
} from '@ant-design/icons';
import { useTrips } from '../../../hooks/useTrips';
import dayjs from 'dayjs';
import { RaysResponseType } from '../../../types/freight';

const RecentTripsSection = () => {
    const { data: trips = [], isLoading, error } = useTrips();
    const recentTrips = [...trips]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
    const columns = [
        {
            title: 'Reys',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            render: (id: number) => (
                <span style={{ fontWeight: 500 }}>#{id}</span>
            ),
        },
        {
            title: 'Haydovchi',
            key: 'driver',
            render: (_, record: RaysResponseType) => {
                // Access driver directly, not as an array
                const driver = record.driver;
                return driver ? (
                    <span>{driver.fullname}</span>
                ) : '-';
            },
        },
        {
            title: 'Narxi',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => (
                <span>{price?.toLocaleString() || 0} $</span>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: (_, record: RaysResponseType) => (
                <Tag color={record.is_completed ? 'success' : 'processing'}>
                    {record.is_completed ? 'Bajarilgan' : 'Jarayonda'}
                </Tag>
            ),
        },
        {
            title: 'Sana',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
        },
        {
            title: '',
            key: 'actions',
            width: 60,
            render: (_, record: RaysResponseType) => (
                <Tooltip title="Batafsil">
                    <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => window.location.href = `/modules/accounting/freight/${record.id}`}
                    />
                </Tooltip>
            ),
        },
    ];
console.log(trips);

    const renderContent = () => {
        if (isLoading) {
            return <div className="section-loading"><Spin /></div>;
        }

        if (error) {
            return <Empty description="Ma'lumotlarni yuklashda xatolik yuz berdi" />;
        }

        if (!recentTrips.length) {
            return <Empty description="Reyslar mavjud emas" />;
        }

        return (
            <Table 
                dataSource={recentTrips}
                columns={columns}
                rowKey="id"
                pagination={false}
                className="dashboard-table"
                size="middle"
            />
        );
    };

    return (
        <Card 
            title={
                <div className="section-title">
                    <CarOutlined className="section-icon" />
                    <span>Oxirgi reyslar</span>
                </div>
            }
            extra={
                <Button 
                    type="link"
                    onClick={() => window.location.href = '/modules/accounting/freight'}
                >
                    Barchasi
                </Button>
            }
            className="dashboard-card"
        >
            {renderContent()}
        </Card>
    );
};

export default RecentTripsSection;
