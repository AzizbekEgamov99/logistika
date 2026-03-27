import React from 'react';
import { Card, Row, Col, Statistic, Progress, Empty, Spin } from 'antd';
import { 
    CarOutlined, 
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useCarStatus } from '../../../hooks/useCars';

const VehicleStatusSection = () => {
    const { 
        inRaysCount, 
        availableCount, 
        isLoading, 
        error 
    } = useCarStatus();

    // Transport vositalari statistikasi
    const totalCars = inRaysCount + availableCount;

    // Foizlarni hisoblash
    const availablePercent = totalCars ? Math.round((availableCount / totalCars) * 100) : 0;
    const inRaysPercent = totalCars ? Math.round((inRaysCount / totalCars) * 100) : 0;

    const renderContent = () => {
        if (isLoading) {
            return <div className="section-loading"><Spin /></div>;
        }

        if (error) {
            return <Empty description="Ma'lumotlarni yuklashda xatolik yuz berdi" />;
        }

        if (!totalCars) {
            return <Empty description="Transport vositalari mavjud emas" />;
        }

        return (
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                    <Card className="status-card">
                        <Statistic 
                            title="Jami transport"
                            value={totalCars}
                            prefix={<CarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <Progress 
                            percent={100}
                            status="active"
                            strokeColor="#1890ff"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="status-card">
                        <Statistic 
                            title="Bo'sh transport"
                            value={availableCount}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <Progress 
                            percent={availablePercent}
                            status="success"
                            strokeColor="#52c41a"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="status-card">
                        <Statistic 
                            title="Yo'ldagi transport"
                            value={inRaysCount}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                        <Progress 
                            percent={inRaysPercent}
                            status="active"
                            strokeColor="#faad14"
                        />
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <Card 
            title={
                <div className="section-title">
                    <CarOutlined className="section-icon" />
                    <span>Transport vositalari holati</span>
                </div>
            }
            className="dashboard-card"
        >
            {renderContent()}
        </Card>
    );
};

export default VehicleStatusSection;

