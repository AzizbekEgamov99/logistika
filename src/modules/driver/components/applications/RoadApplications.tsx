import { Table, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

export function RoadApplications() {
    const [data] = useState([
        {
            id: 1,
            date: '2024-03-20',
            route: 'Toshkent-Samarqand',
            purpose: 'Yuk tashish',
            expectedAmount: 500000,
            status: 'pending'
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
            title: 'Maqsad',
            dataIndex: 'purpose',
            key: 'purpose',
        },
        {
            title: 'So\'ralgan summa',
            dataIndex: 'expectedAmount',
            key: 'expectedAmount',
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
            title="Yo'l xarajati arizalari"
            extra={
                <Button type="primary" icon={<PlusOutlined />}>
                    Yangi ariza
                </Button>
            }
        >
            <Table columns={columns} dataSource={data} rowKey="id" />
        </Card>
    );
} 