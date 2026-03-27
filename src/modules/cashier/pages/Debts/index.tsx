import React from 'react';
import { Card, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import ClientAccounts from '@/modules/accounting/pages/Kassa/ClientAccounts';

const { Title } = Typography;

export default function DebtsPage() {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <WarningOutlined style={{ marginRight: 8, color: '#faad14' }} /> Haqdor/Qarzdorlar
            </Title>
            <Card variant="borderless">
                <ClientAccounts />
            </Card>
        </div>
    );
}
