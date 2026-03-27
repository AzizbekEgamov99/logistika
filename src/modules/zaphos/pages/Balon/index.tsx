import React from 'react';
import { Card, Typography, Spin, Alert, Tabs } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import BalonAdd from '@/modules/accounting/pages/Maintenance/components/balon/BalonAdd';
import BalonList from '@/modules/accounting/pages/Maintenance/components/balon/BalonList';
import BalonFurgonAdd from '@/modules/accounting/pages/Maintenance/components/balonfurgon/BalonFurgonAdd';
import BalonFurgonList from '@/modules/accounting/pages/Maintenance/components/balonfurgon/BalonFurgonList';
import { useBalonManagement } from '@/modules/accounting/pages/Maintenance/hooks/useBalonManagement';
import { useBalonFurgonManagement } from '@/modules/accounting/pages/Maintenance/hooks/useBalonFurgonManagement';

const { Title } = Typography;

export default function BalonPage() {
    const {
        balonServices,
        isLoading: balonLoading,
        isError: balonError,
        addBalonService,
        updateBalonService,
        deleteBalonService,
    } = useBalonManagement();

    const {
        balonFurgonServices,
        isLoading: balonFurgonLoading,
        isError: balonFurgonError,
        addBalonFurgonService,
        updateBalonFurgonService,
        deleteBalonFurgonService,
    } = useBalonFurgonManagement();

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                <SettingOutlined style={{ marginRight: 8, color: '#1890ff' }} /> Balon xizmatlari
            </Title>
            
            {balonLoading || balonFurgonLoading ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                    <Spin size="large" />
                </div>
            ) : balonError || balonFurgonError ? (
                <Alert message="Xatolik yuz berdi" type="error" showIcon />
            ) : (
                <Card variant="borderless" styles={{ body: { padding: 0 } }}>
                    <Tabs
                        defaultActiveKey="trucks"
                        items={[
                            {
                                key: 'trucks',
                                label: 'Mashina balonlari',
                                children: (
                                    <div style={{ padding: 16 }}>
                                        <BalonAdd addBalonService={addBalonService} />
                                        <BalonList
                                            balonServices={balonServices}
                                            updateBalonService={updateBalonService}
                                            deleteBalonService={deleteBalonService}
                                        />
                                    </div>
                                )
                            },
                            {
                                key: 'furgons',
                                label: 'Furgon balonlari',
                                children: (
                                    <div style={{ padding: 16 }}>
                                        <BalonFurgonAdd addBalonFurgonService={addBalonFurgonService} />
                                        <BalonFurgonList
                                            balonFurgonServices={balonFurgonServices}
                                            updateBalonFurgonService={updateBalonFurgonService}
                                            deleteBalonFurgonService={deleteBalonFurgonService}
                                        />
                                    </div>
                                )
                            }
                        ]}
                    />
                </Card>
            )}
        </div>
    );
}
