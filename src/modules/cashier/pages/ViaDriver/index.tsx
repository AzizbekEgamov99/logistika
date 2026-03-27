import React from 'react';
import { Card, Typography } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import DriverPayments from '@/modules/accounting/pages/Kassa/DriverPayments';

const { Title } = Typography;

export default function ViaDriverPage() {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <CarOutlined style={{ marginRight: 8, color: '#13c2c2' }} /> Haydovchi orqali
            </Title>
            <Card variant="borderless">
                <DriverPayments />
            </Card>
        </div>
    );
}
