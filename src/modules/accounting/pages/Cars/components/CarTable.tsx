import React from 'react';
import { Table, Space, Button, Tag, Popconfirm, Image } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, CarOutlined } from '@ant-design/icons';
import { Car } from '../../../types/car';
import { formatImageUrl } from '@/api/axiosInstance';

interface CarTableProps {
    cars: Car[];
    loading: boolean;
    total: number;
    onEdit: (car: Car) => void;
    onDelete: (id: number) => void;
    onView: (car: Car) => void;
    onTableChange: (pagination: any, filters: any, sorter: any) => void;
    currentPage: number;
    pageSize: number;
}
const getImageUrl = (url: string) => {
    if (!url) return '';
    return formatImageUrl(url) || '';
};
const CarTable: React.FC<CarTableProps> = ({
    cars,
    loading,
    total,
    onEdit,
    onDelete,
    onView,
    onTableChange,
    currentPage,
    pageSize
}) => {
    const columns = [
        {
            title: 'Rasm',
            dataIndex: 'photo',
            key: 'photo',
            width: 100,
            render: (photo: string) => {
                const imageUrl = getImageUrl(photo);
                return imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="car"
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        preview={{
                            src: imageUrl,
                        }}
                        fallback="/no-image.png" 
                    />
                ) : (
                    <div style={{ 
                        width: 60, 
                        height: 60, 
                        background: '#f5f5f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '4px'
                    }}>
                        <CarOutlined style={{ fontSize: '24px', color: '#999' }} />
                    </div>
                );
            }
        },
        {
            title: 'Nomi',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Davlat raqami',
            dataIndex: 'car_number',
            key: 'car_number',
        },
        {
            title: 'Model',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Yili',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Dvigatel',
            dataIndex: 'engine',
            key: 'engine',
        },
        {
            title: 'Yoqilg\'i',
            dataIndex: 'fuel',
            key: 'fuel',
        },
        {
            title: 'Holati',
            dataIndex: 'holat',
            key: 'holat',
            render: (holat: string) => {
                const statusConfig = {
                    'Foal': { color: 'green', text: 'Faol' },
                    'Tamirda': { color: 'blue', text: 'Ta\'mirda' },
                    'Kutmoqda': { color: 'orange', text: 'Kutmoqda' }
                };
                
                const config = statusConfig[holat as keyof typeof statusConfig] || { color: 'default', text: holat };
                
                return (
                    <Tag color={config.color}>
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Amallar',
            key: 'actions',
            width: 200,
            render: (_: any, record: Car) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                    >
                        Ko`rish
                    </Button>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        O`zgartirish
                    </Button>
                    <Popconfirm
                        title="Transportni o'chirishni xohlaysizmi?"
                        onConfirm={() => onDelete(record.id!)}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            O`chirish
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={cars}
            rowKey="id"
            loading={loading}
            pagination={{
                total,
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total) => `Jami ${total} ta`,
            }}
            onChange={onTableChange}
            scroll={{ x: 1300 }}
        />
    );
};

export default CarTable; 