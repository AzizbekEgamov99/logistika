import { Table, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

export function PostExpenses() {
    const [data] = useState([
        {
            id: 1,
            date: '2024-03-20',
            postName: 'Toshkent Post-1',
            vehicleNumber: 'AA 777 AA',
            amount: 150000,
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
            title: 'Post nomi',
            dataIndex: 'postName',
            key: 'postName',
        },
        {
            title: 'Transport raqami',
            dataIndex: 'vehicleNumber',
            key: 'vehicleNumber',
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
            title="Post xarajatlari"
            extra={
                <Button type="primary" icon={<PlusOutlined />}>
                    Yangi qo`shish
                </Button>
            }
        >
            <Table columns={columns} dataSource={data} rowKey="id" />
        </Card>
    );
} 