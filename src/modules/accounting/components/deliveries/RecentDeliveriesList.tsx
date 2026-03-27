import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { motion } from 'framer-motion';

const { Text } = Typography;

interface Delivery {
    id: string;
    from: string;
    to: string;
    status: string;
    driver: string;
}

interface RecentDeliveriesListProps {
    deliveries: Delivery[];
    delay?: number;
}

export const RecentDeliveriesList: React.FC<RecentDeliveriesListProps> = ({
    deliveries,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card
                title="So'nggi yetkazib berishlar"
                extra={<a href="#">Barchasini ko`rish</a>}
                styles={{ body: { padding: '0' } }}
            >
                <div style={{ padding: '8px 0' }}>
                    {deliveries.map((delivery, index) => (
                        <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: delay + index * 0.1 }}
                            style={{
                                padding: '16px 24px',
                                borderBottom: index < deliveries.length - 1 ? '1px solid #f0f0f0' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                            }}
                        >
                            <div>
                                <Text strong>{delivery.id}</Text>
                                <div style={{ marginTop: '4px' }}>
                                    <Text type="secondary">{delivery.from} → {delivery.to}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Text style={{ marginRight: '16px' }}>{delivery.driver}</Text>
                                <Tag color={
                                    delivery.status === 'Completed' ? 'success' :
                                    delivery.status === 'In Progress' ? 'processing' : 'error'
                                }>
                                    {delivery.status}
                                </Tag>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};