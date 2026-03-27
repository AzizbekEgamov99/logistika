import React from 'react';
import { Row, Col, Typography } from 'antd';
import { motion } from 'framer-motion';

const { Text } = Typography;

interface DeliveryData {
    month: string;
    completed: number;
    pending: number;
}

interface AreaChartProps {
    data: DeliveryData[];
}

export const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.completed + item.pending));
    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * 800;
        const y = 200 - ((item.completed + item.pending) / maxValue) * 150;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ height: '200px', position: 'relative', marginTop: '20px' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 200">
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4f7cff" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                    d={`M${points}`}
                    fill="none"
                    stroke="#4f7cff"
                    strokeWidth="2"
                />
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    d={`M${points} L800,200 L0,200 Z`}
                    fill="url(#areaGradient)"
                />
            </svg>
            <div style={{ position: 'absolute', left: '0', bottom: '0', width: '100%' }}>
                <Row justify="space-between">
                    {data.map((item, index) => (
                        <Col key={index} span={2}>
                            <Text style={{ fontSize: '12px' }}>{item.month}</Text>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}; 