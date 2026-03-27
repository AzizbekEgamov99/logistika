import React from 'react';
import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import { StatusTag } from '../StatusTag';
import { DeliveryItem } from '@/modules/accounting/types/type';

const { Text } = Typography;

interface RecentDeliveriesListProps {
    deliveries: DeliveryItem[];
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
                title="Recent Deliveries"
                extra={<a href="#">View All</a>}
                bodyStyle={{ padding: '0' }}
            >
                <div style={{ padding: '8px 0' }}>
                    {deliveries.map((delivery, index) => (
                        <div
                            key={index}
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
                                <StatusTag status={delivery.status} type="delivery" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};