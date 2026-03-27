import React from 'react';
import { Card, Typography, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { DriverData } from '../types/type';

const { Title, Text } = Typography;

interface TopDriversListProps {
    title: string;
    subtitle?: string;
    drivers: DriverData[];
    delay?: number;
}

export const TopDriversList: React.FC<TopDriversListProps> = ({
    title,
    subtitle,
    drivers,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card bodyStyle={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={5} style={{ margin: 0 }}>{title}</Title>
                    {subtitle && <Text type="secondary">{subtitle}</Text>}
                </div>

                {drivers.map((driver, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: delay + index * 0.1 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 0',
                            borderBottom: index < drivers.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                                style={{ 
                                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                                    marginRight: '12px'
                                }}
                            >
                                {driver.avatar || driver.name.charAt(0)}
                            </Avatar>
                            <div>
                                <Text strong>{driver.name}</Text>
                                <Text type="secondary" style={{ display: 'block' }}>
                                    {driver.trips} ta reys bajarilgan
                                </Text>
                            </div>
                        </div>
                        <Text strong>{driver.revenue}</Text>
                    </motion.div>
                ))}
            </Card>
        </motion.div>
    );
};