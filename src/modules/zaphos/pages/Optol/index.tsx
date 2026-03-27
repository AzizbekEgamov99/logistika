import React from 'react';
import { Card, Typography, Spin, Alert } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import OptolAdd from '@/modules/accounting/pages/Maintenance/components/optol/OptolAdd';
import OptolList from '@/modules/accounting/pages/Maintenance/components/optol/OptolList';
import { useOptolManagement } from '@/modules/accounting/pages/Maintenance/hooks/useOptolManagement';

const { Title } = Typography;

export default function OptolPage() {
    const {
        optolServices,
        isLoading,
        isError,
        addOptolService,
        updateOptolService,
        deleteOptolService,
        completeOptolService,
    } = useOptolManagement();

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <ThunderboltOutlined style={{ marginRight: 8, color: '#fa8c16' }} /> Yoqilg'i (Optol)
            </Title>
            
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                    <Spin size="large" />
                </div>
            ) : isError ? (
                <Alert message="Xatolik yuz berdi" type="error" showIcon />
            ) : (
                <Card variant="borderless">
                    <OptolAdd addOptolService={addOptolService} />
                    <OptolList
                        optolServices={optolServices}
                        updateOptolService={updateOptolService}
                        deleteOptolService={deleteOptolService}
                        completeOptolService={completeOptolService}
                    />
                </Card>
            )}
        </div>
    );
}
