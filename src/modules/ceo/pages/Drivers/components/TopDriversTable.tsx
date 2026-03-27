import React from 'react';
import { Table, Avatar, Progress } from 'antd';
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { DriverType } from '../../../../accounting/types/driver';

import { baseURL, formatImageUrl } from '../../../../../api/axiosInstance';

interface TopDriversTableProps {
    drivers: DriverType[];
    loading: boolean;
}

const TopDriversTable: React.FC<TopDriversTableProps> = ({ drivers, loading }) => {
    // Get the max rays_count for calculating relative percentages
    const maxRaysCount = Math.max(...drivers.map(d => d.rays_count || 0), 1);
    
    const columns = [
        {
            title: 'Haydovchi',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (text: string, record: DriverType, index: number) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {index === 0 && (
                        <TrophyOutlined style={{ color: '#FFD700', marginRight: 10, fontSize: 20 }} />
                    )}
                    <Avatar
                        icon={<UserOutlined />}
                        size="small"
                        style={{ marginRight: 8, backgroundColor: '#1890ff' }}
                    />
                    {text}
                </div>
            )
        },
        {
            title: 'Telefon',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Reyslar soni',
            dataIndex: 'rays_count',
            key: 'rays_count',
            render: (count: number) => count || 0
        },
        {
            title: 'Ko\'rsatkich',
            key: 'performance',
            render: (_, record: DriverType) => {
                const percentage = ((record.rays_count || 0) / maxRaysCount) * 100;
                let strokeColor;
                
                if (percentage > 80) {
                    strokeColor = '#52c41a'; // Green for high performers
                } else if (percentage > 40) {
                    strokeColor = '#1890ff'; // Blue for mid-range performers
                } else {
                    strokeColor = '#722ed1'; // Purple for others
                }
                
                return (
                    <Progress
                        percent={Math.round(percentage)}
                        size="small"
                        strokeColor={strokeColor}
                        style={{ marginBottom: 0 }}
                    />
                );
            }
        }
    ];
    
    return (
        <Table
            columns={columns}
            dataSource={drivers}
            rowKey="id"
            pagination={false}
            loading={loading}
            size="small"
        />
    );
};

export default TopDriversTable; 