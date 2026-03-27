import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { motion } from 'framer-motion';

const { Text } = Typography;

interface MaintenanceItem {
    truck: string;
    plate: string;
    date: string;
    type: string;
    status: string;
}

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
                title="Texnik ko'rik jadvali"
                extra={<a href="#">Barchasini ko`rish</a>}
                styles={{ body: { padding: '0' } }}
            >
                <div style={{ padding: '8px 0' }}>
                    {maintenanceItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: delay + index * 0.1 }}
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
                                <Text strong>{item.truck}</Text>
                                <div style={{ marginTop: '4px' }}>
                                    <Text type="secondary">{item.plate}</Text>
                                </div>
                            </div>
                            <div>
                                <Text>{item.date}</Text>
                                <div style={{ marginTop: '4px' }}>
                                    <Text type="secondary">{item.type}</Text>
                                </div>
                            </div>
                            <Tag color={
                                item.status === 'Scheduled' ? 'blue' :
                                item.status === 'Completed' ? 'green' : 'gold'
                            }>
                                {item.status}
                            </Tag>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};