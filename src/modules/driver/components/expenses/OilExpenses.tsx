import { Table, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

export function OilExpenses() {
    const [data] = useState([
        {
            id: 1,
            date: '2024-03-20',
            oilType: 'Motor moyi',
            quantity: 5,
            pricePerUnit: 80000,
            amount: 400000,
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
            title: 'Moy turi',
            dataIndex: 'oilType',
            key: 'oilType',
        },
        {
            title: 'Miqdori (L)',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Birlik narxi',
            dataIndex: 'pricePerUnit',
            key: 'pricePerUnit',
            render: (price: number) => `${price.toLocaleString()} $`,
        },
        {
            title: 'Umumiy summa',
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
            title="Moy xarajatlari"
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