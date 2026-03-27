import React from 'react';
import { Card, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import CashTransactionList from '@/modules/accounting/components/CashTransaction/CashTransactionList';

const { Title } = Typography;

export default function PendingPage() {
    // We render CashTransactionList here. The user can filter for 'not_confirmed' using the UI.
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <ClockCircleOutlined style={{ marginRight: 8, color: '#faad14' }} /> Tasdiqlanmagan to'lovlar
            </Title>
            <Card variant="borderless" styles={{ body: { padding: 0 } }}>
                <CashTransactionList />
            </Card>
        </div>
    );
}
