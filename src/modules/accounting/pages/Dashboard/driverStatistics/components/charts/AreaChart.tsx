import React from 'react';
import { Row, Col, Typography } from 'antd';
import { DeliveryData } from '@/modules/accounting/types/type';

const { Text } = Typography;

interface AreaChartProps {
    data: DeliveryData[];
}

export const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
    return (
        <div style={{ height: '200px', position: 'relative', marginTop: '20px' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 200">
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4f7cff" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,150 Q200,120 400,140 T800,100 V200 H0 Z"
                    fill="url(#areaGradient)"
                />
                <path
                    d="M0,150 Q200,120 400,140 T800,100"
                    fill="none"
                    stroke="#4f7cff"
                    strokeWidth="2"
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