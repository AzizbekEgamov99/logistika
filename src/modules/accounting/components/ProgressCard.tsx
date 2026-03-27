import React from 'react';
import { Card, Typography, Progress } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface ProgressCardProps {
    title: string;
    percent: number;
    description: string;
    subdescription?: string;
    delay?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
    title,
    percent,
    description,
    subdescription,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card styles={{ body: { padding: '24px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <Title level={5} style={{ margin: 0 }}>{title}</Title>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto', marginBottom: '16px' }}>
                        <Progress
                            type="circle"
                            percent={percent}
                            strokeColor="#4f7cff"
                            strokeWidth={8}
                            size={150}
                        />
                    </div>

                    <Text>{description}</Text>
                    {subdescription && (
                        <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
                            {subdescription}
                        </Text>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};