import React from 'react';
import { Card, Typography } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import RaysTulovlar from '@/modules/accounting/pages/Kassa/RaysTulovlar';

const { Title } = Typography;

export default function HistoryPage() {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <HistoryOutlined style={{ marginRight: 8, color: '#1890ff' }} /> Kassa tarixi (Reyslar)
            </Title>
            <Card variant="borderless">
                <RaysTulovlar />
            </Card>
        </div>
    );
}
