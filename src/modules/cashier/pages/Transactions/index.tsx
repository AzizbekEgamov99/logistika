import React from 'react';
import { Card, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import CashTransactionList from '@/modules/accounting/components/CashTransaction/CashTransactionList';

const { Title } = Typography;

export default function TransactionsPage() {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <SwapOutlined style={{ marginRight: 8, color: '#52c41a' }} /> Tranzaksiyalar
            </Title>
            <Card variant="borderless" styles={{ body: { padding: 0 } }}>
                <CashTransactionList />
            </Card>
        </div>
    );
}
