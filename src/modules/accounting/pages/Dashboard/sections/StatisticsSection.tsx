import React, { useEffect } from 'react';
import {  Card, Statistic } from 'antd';
import { 
    CarOutlined, 
    UserOutlined, 
    CheckCircleOutlined,
    ClockCircleOutlined 
} from '@ant-design/icons';
import { useTrips } from '../../../hooks/useTrips';
import { useDrivers } from '../../../hooks/useDrivers';
import { useCarStatus } from '../../../hooks/useCars';
import { useHistoryTrips } from '../../../hooks/useHistoryTrips';

const StatisticsSection = () => {
    const { data: trips = [], isLoading: tripsLoading } = useTrips();
    const { data: historyTrips = [], isLoading: historyLoading } = useHistoryTrips();
    const { drivers = [], loading: driversLoading } = useDrivers();
    const { 
        inRaysCount, 
        availableCount, 
        isLoading: carsLoading 
    } = useCarStatus();

    useEffect(() => {
        console.log('Trips data:', trips);
        console.log('History trips data:', historyTrips);
        console.log('Trips with is_completed=true:', trips.filter(trip => trip.is_completed));
        console.log('Trips with is_completed=false:', trips.filter(trip => !trip.is_completed));
    }, [trips, historyTrips]);

    // Count both active completed trips and trips in history
    const completedTrips = trips.filter(trip => trip.is_completed).length + historyTrips.length;
    const activeTrips = trips.filter(trip => !trip.is_completed).length;

    return (
        <div className="statistics-row">
            <Card className="stat-card">
                <Statistic 
                    title="Haydovchilar"
                    value={drivers.length}
                    prefix={<UserOutlined />}
                    loading={driversLoading}
                    valueStyle={{ color: '#1890ff' }}
                />
            </Card>
            
            <Card className="stat-card">
                <Statistic 
                    title="Transport vositalari"
                    value={inRaysCount + availableCount}
                    prefix={<CarOutlined />}
                    loading={carsLoading}
                    valueStyle={{ color: '#ff7a45' }}
                />
            </Card>
            
            <Card className="stat-card">
                <Statistic 
                    title="Faol reyslar"
                    value={activeTrips}
                    prefix={<ClockCircleOutlined />}
                    loading={tripsLoading}
                    valueStyle={{ color: '#faad14' }}
                />
            </Card>
            
            <Card className="stat-card">
                <Statistic 
                    title="Bajarilgan reyslar"
                    value={completedTrips}
                    prefix={<CheckCircleOutlined />}
                    loading={tripsLoading || historyLoading}
                    valueStyle={{ color: '#52c41a' }}
                />
            </Card>
        </div>
    );
};

export default StatisticsSection;
