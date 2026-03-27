import React from 'react';
import { Card, Typography, Spin, Alert } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import TehnicalServiceAdd from '@/modules/accounting/pages/Maintenance/components/tehnical/TehnicalServiceAdd';
import TehnicalServiceList from '@/modules/accounting/pages/Maintenance/components/tehnical/TehnicalServiceList';
import { useTehnicalServiceManagement } from '@/modules/accounting/pages/Maintenance/hooks/useTehnicalServiceManagement';

const { Title } = Typography;

export default function TexnicPage() {
    const {
        tehnicalServices,
        isLoading,
        isError,
        addTehnicalService,
        updateTehnicalService,
        deleteTehnicalService,
    } = useTehnicalServiceManagement();

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <ToolOutlined style={{ marginRight: 8, color: '#722ed1' }} /> Texnik xizmatlar
            </Title>
            
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                    <Spin size="large" />
                </div>
            ) : isError ? (
                <Alert message="Xatolik yuz berdi" type="error" showIcon />
            ) : (
                <Card variant="borderless">
                    <TehnicalServiceAdd addTehnicalService={addTehnicalService} />
                    <TehnicalServiceList
                        tehnicalServices={tehnicalServices}
                        updateTehnicalService={updateTehnicalService}
                        deleteTehnicalService={deleteTehnicalService}
                    />
                </Card>
            )}
        </div>
    );
}
