import { Table, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
export function AdditionalApplications() {
    const [data] = useState([
        {
            id: 1,
            date: '2024-03-20',
            type: 'Ta\'mirlash',
            description: 'Dvigatel ta\'mirlash',
            expectedAmount: 2000000,
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
            title: 'Turi',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Tavsif',
            dataIndex: 'description',
            key: 'description',
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
            title="Qo'shimcha arizalar"
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