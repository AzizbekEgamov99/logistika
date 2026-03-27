import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const { Text } = Typography;

interface StatCardProps {
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    title: string;
    value: number | string;
    changeValue?: string;
    changeType?: 'success' | 'danger' | 'secondary';
    changeText?: string;
    delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
    iconBgColor,
    title,
    value,
    changeValue,
    changeType = 'secondary',
    changeText,
    delay = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card bodyStyle={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: iconBgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                        }}
                    >
                        {/* {React.isValidElement(icon) && React.cloneElement(icon, { style: { color: iconColor, fontSize: '18px' } })} */}
                    </div>
                    <Text>{title}</Text>
                </div>
                <Statistic value={value} valueStyle={{ fontSize: '28px', fontWeight: 'bold' }} />
                {changeValue && (
                    <div style={{ marginTop: '8px' }}>
                        <Text type={changeType}>{changeValue}</Text>
                        {changeText && <Text type="secondary" style={{ marginLeft: '8px' }}>{changeText}</Text>}
                    </div>
                )}
            </Card>
        </motion.div>
    );

};