import React from 'react';
import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import { StatusTag } from '../StatusTag';
import { MaintenanceItem } from '@/modules/accounting/types/type';

const { Text } = Typography;

interface MaintenanceScheduleProps {
    maintenanceItems: MaintenanceItem[];
    delay?: number;
}

export const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({
    maintenanceItems,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card
                title="Maintenance Schedule"
                extra={<a href="#">View All</a>}
                bodyStyle={{ padding: '0' }}
            >
                <div style={{ padding: '8px 0' }}>
                    {maintenanceItems.map((maintenance, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '16px 24px',
                                borderBottom: index < maintenanceItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                            }}
                        >
                            <div>
                                <Text strong>{maintenance.truck}</Text>
                                <div style={{ marginTop: '4px' }}>
                                    <Text type="secondary">{maintenance.plate}</Text>
                                </div>
                            </div>
                            <div>
                                <Text>{maintenance.date}</Text>
                                <div style={{ marginTop: '4px' }}>
                                    <Text type="secondary">{maintenance.type}</Text>
                                </div>
                            </div>
                            <StatusTag status={maintenance.status} type="maintenance" />
                        </div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};
