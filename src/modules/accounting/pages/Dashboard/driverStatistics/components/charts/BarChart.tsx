import React from 'react';
import { Card, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { RevenueData } from '@/modules/accounting/types/type';

const { Text } = Typography;

interface BarChartProps {
    title: string;
    data: RevenueData[];
    delay?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ title, data, delay = 0 }) => {
    const maxValue = Math.max(...data.map(item => item.value));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card
                title={title}
                extra={<SettingOutlined />}
                bodyStyle={{ padding: '24px' }}
            >
                <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    {data.map((item, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '8%' }}>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.value / maxValue) * 200}px` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#4f7cff',
                                    borderRadius: '3px 3px 0 0',
                                    marginBottom: '8px',
                                }}
                            />
                            <Text style={{ fontSize: '12px' }}>{item.month}</Text>
                        </div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};
