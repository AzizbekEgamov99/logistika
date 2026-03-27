import { Table, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

export function RoadExpenses() {
    const [data] = useState([
        {
            id: 1,
            date: '2024-03-20',
            route: 'Toshkent-Samarqand',
            distance: 350,
            amount: 500000,
            status: 'approved'
        },
    ]);

    const columns = [
        {
            title: 'Sana',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Marshrut',
            dataIndex: 'route',
            key: 'route',
        },
        {
            title: 'Masofa (km)',
            dataIndex: 'distance',
            key: 'distance',
        },
        {
            title: 'Summa',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `${amount.toLocaleString()} $`,
        },
        {
            title: 'Holat',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'approved' ? 'green' : 'orange'}>
                    {status === 'approved' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                </Tag>
            ),
        },
    ];

    return (
        <Card
            title="Yo'l xarajatlari"
            extra={
                <Button type="primary" icon={<PlusOutlined />}>
                    Yangi qo`shish
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
            />
        </Card>
    );
} 