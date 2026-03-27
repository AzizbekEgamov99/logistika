import React from 'react';
import { Table, Button, Space, Tag, Avatar, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, CarOutlined } from '@ant-design/icons';
import { DriverType, DriverFilter } from '../../../../accounting/types/driver';
import { formatImageUrl } from '@/api/axiosInstance';
import type { TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';

interface DriversListProps {
    drivers: DriverType[];
    loading: boolean;
    total: number;
    onEdit: (driver: DriverType) => void;
    onDelete: (driver: DriverType) => void;
    filters: DriverFilter;
    onFiltersChange: (filters: DriverFilter) => void;
}

const DriversList: React.FC<DriversListProps> = ({
    drivers,
    loading,
    total,
    onEdit,
    onDelete,
    filters,
    onFiltersChange
}) => {
    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, string[] | null>,
        sorter: SorterResult<DriverType> | SorterResult<DriverType>[]
    ) => {
        const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
        
        onFiltersChange({
            ...filters,
            page: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            sortBy: singleSorter.field as string,
            sortOrder: singleSorter.order as 'ascend' | 'descend' | undefined
        });
    };

    const columns = [
        {
            title: 'F.I.O',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (text: string, record: DriverType) => (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        size="small"
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    {text}
                </Space>
            ),
            sorter: true
        },
        {
            title: 'Telefon',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let text = 'Noma\'lum';
                
                switch(status) {
                    case 'active':
                    case 'driver':
                        color = 'green';
                        text = 'Faol';
                        break;
                    case 'inactive':
                        color = 'red';
                        text = 'Faol emas';
                        break;
                    case 'on_trip':
                        color = 'blue';
                        text = 'Yo\'lda';
                        break;
                    default:
                        break;
                }
                
                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: 'Barchasi', value: 'all' },
                { text: 'Faol', value: 'active' },
                { text: 'Faol emas', value: 'inactive' }
            ],
            filteredValue: filters.status ? (Array.isArray(filters.status) ? filters.status : [filters.status]) : null as any
        },
        {
            title: 'Reyslar',
            dataIndex: 'rays_count',
            key: 'rays_count',
            render: (count: number) => (
                <Space>
                    <CarOutlined />
                    {count || 0}
                </Space>
            ),
            sorter: true
        },
        {
            title: 'Amallar',
            key: 'actions',
            render: (_: any, record: DriverType) => (
                <Space size="small">
                    <Tooltip title="Tahrirlash">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Haydovchini o'chirishni istaysizmi?"
                        onConfirm={() => onDelete(record)}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Tooltip title="O'chirish">
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={drivers}
            rowKey="id"
            loading={loading}
            pagination={{
                current: filters.page,
                pageSize: filters.pageSize,
                total: total,
                showSizeChanger: true,
                showTotal: (total) => `Jami ${total} haydovchi`
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
        />
    );
};

export default DriversList; 