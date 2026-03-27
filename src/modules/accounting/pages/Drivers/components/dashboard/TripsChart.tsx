import React from 'react';
import { Card, Button, Dropdown, Empty } from 'antd';
import { CarOutlined, FilterOutlined, DownOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';

interface TripsChartProps {
    data: any[];
    loading: boolean;
}

const TripsChart: React.FC<TripsChartProps> = ({ data, loading }) => {
    
    const chartConfig = {
        data,
        xField: 'month',
        yField: 'trips',
        color: '#1890ff',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        meta: {
            month: { alias: 'Oy' },
            trips: { alias: 'Reyslar soni' },
        },
    };

    const filterMenuItems = {
        items: [
            {
                key: 'yearly',
                label: 'Yillik'
            },
            {
                key: 'monthly',
                label: 'Oylik'
            }
        ],
    };

    return (
        <Card 
            title={
                <div>
                    <CarOutlined /> Reyslar statistikasi
                    <div className="card-extra" style={{ float: 'right' }}>
                        <Dropdown menu={filterMenuItems} trigger={['click']}>
                            <Button size="small">
                                <FilterOutlined /> Filter <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            }
            style={{ borderRadius: '12px' }}
            loading={loading}
        >
            {data && data.length > 0 ? (
                <Column {...chartConfig} height={400} />
            ) : (
                <Empty description="Ma'lumotlar mavjud emas" style={{ margin: '100px 0' }} />
            )}
        </Card>
    );
};

export default TripsChart; 