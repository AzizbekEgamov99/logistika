import React from 'react';
import { Card, Table, Avatar, Tag, Spin, Button, Empty } from 'antd';
import { UserOutlined, TrophyOutlined, EyeOutlined } from '@ant-design/icons';
import { useTopDrivers } from '../../../hooks/useTopDrivers';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';

// Define proper type for driver
interface DriverData {
    id: number;
    fullname: string;
    phone_number: string;
    photo?: string;
    is_busy: boolean;
    rays_count: number;
}

const TopDriversSection = () => {
    const { data: drivers = [], isLoading, error } = useTopDrivers();
    const router = useRouter();

    const navigateToDriver = (driverId: number) => {
        router.push(`/modules/accounting/drivers/history/${driverId}`);
    };

    const columns: ColumnsType<DriverData> = [
        {
            title: 'Haydovchi',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (text: string, record: DriverData) => (
                <div className="driver-info">
                    <Avatar
                        src={record.photo}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: record.photo ? 'transparent' : '#1890ff' }}
                    />
                    <div>
                        <div className="driver-name">{text}</div>
                        <div className="driver-phone">{record.phone_number}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Reyslar',
            dataIndex: 'rays_count',
            key: 'rays_count',
            align: 'center' as const,
        },
        {
            title: 'Holat',
            dataIndex: 'is_busy',
            key: 'is_busy',
            align: 'center' as const,
            render: (busy: boolean) => (
                <Tag color={busy ? 'red' : 'green'}>
                    {busy ? 'Band' : 'Bo\'sh'}
                </Tag>
            ),
        },
        {
            title: 'Amallar',
            key: 'actions',
            align: 'center' as const,
            render: (_, record: DriverData) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigateToDriver(record.id)}
                />
            ),
        }
    ];

    const renderContent = () => {
        if (isLoading) {
            return <div className="section-loading"><Spin /></div>;
        }

        if (error) {
            return <Empty description="Ma'lumotlarni yuklashda xatolik yuz berdi" />;
        }

        if (!drivers.length) {
            return <Empty description="Haydovchilar mavjud emas" />;
        }

        return (
            <Table
                dataSource={drivers.slice(0, 5) as DriverData[]} // Top 5 drivers only
                columns={columns}
                pagination={false}
                rowKey="id"
                className="dashboard-table"
            />
        );
    };

    return (
        <Card
            title={
                <div className="section-title">
                    <TrophyOutlined className="section-icon" />
                    <span>Eng yaxshi haydovchilar</span>
                </div>
            }
            className="dashboard-card"
        >
            {renderContent()}
        </Card>
    );
};

export default TopDriversSection;
