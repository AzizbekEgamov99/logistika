import React from 'react';
import { Table, Space, Button, Avatar, Tag, Modal, Badge, Tooltip } from 'antd';
import {
  EditOutlined,
  UserOutlined,
  CarOutlined,
  CheckCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { DriverType, DriverFilter } from '../../../types/driver';
import { formatDate } from '../../../utils/formatters';
import { useRouter, usePathname } from 'next/navigation';
import { getDriverPhotoUrl } from '../photoUtils';

const { confirm } = Modal;

interface DriversListProps {
  drivers: DriverType[];
  loading: boolean;
  total: number;
  filters: DriverFilter;
  onFiltersChange: (filters: DriverFilter) => void;
  onEdit: (driver: DriverType) => void;
  onDelete: (driver: DriverType) => void;
}

const DriversList: React.FC<DriversListProps> = ({
  drivers,
  loading,
  total,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const filteredDrivers = drivers.filter(driver =>
    driver.fullname.toLowerCase().includes((filters.search || '').toLowerCase())
  );


  const viewDriverHistory = (driver: DriverType) => {
    const basePath = pathname ? pathname.split('/').slice(0, 3).join('/') : '/modules/accounting';
    router.push(`${basePath}/drivers/history/${driver.id}`);
  };

  const getAvatarProps = (record: DriverType) => {
    const photoUrl = getDriverPhotoUrl(record.photo);
    return {
      photoUrl,
      hasPhoto: !!photoUrl,
    };
  };

  const columns = [
    {
      title: 'Haydovchi',
      dataIndex: 'fullname',
      key: 'fullname',
      fixed: 'left',
      width: 250,
      render: (_: string, record: DriverType) => {
        const { photoUrl, hasPhoto } = getAvatarProps(record);
        return (
          <Space>
            <div style={{ position: 'relative' }}>
              <Avatar
                src={photoUrl || undefined}
                size="large"
                icon={!hasPhoto && <UserOutlined />}
                style={{
                  backgroundColor: hasPhoto ? 'transparent' : '#1890ff',
                }}
              >
                {!hasPhoto && record.fullname?.charAt(0)}
              </Avatar>
              <Badge
                status={record.is_busy ? 'processing' : 'success'}
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>
                {record.fullname}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {record.phone_number}
              </div>
            </div>
          </Space>
        );
      },
      sorter: (a: DriverType, b: DriverType) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: 'Band/Bo\'sh',
      dataIndex: 'is_busy',
      key: 'is_busy',
      width: 120,
      render: (is_busy: boolean) => (
        <Tag color={is_busy ? 'processing' : 'success'} icon={is_busy ? <CarOutlined /> : <CheckCircleOutlined />}>
          {is_busy ? 'Band' : 'Bo\'sh'}
        </Tag>
      ),
    },
    {
      title: 'Reyslar soni',
      dataIndex: 'rays_count',
      key: 'rays_count',
      width: 130,
      render: (rays_count: number | undefined) => (
        <Tag color="blue" icon={<CarOutlined />}>
          {rays_count || 0} reys
        </Tag>
      ),
    },
    {
      title: 'Umumiy summa (USD)',
      dataIndex: 'total_rays_usd',
      key: 'total_rays_usd',
      width: 160,
      render: (total: number | undefined) => (
        <Tag color="green">
          ${(total || 0).toLocaleString()}
        </Tag>
      ),
    },
    {
      title: 'Qo\'shilgan sana',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (date: string) => formatDate(date),
      sorter: (a: DriverType, b: DriverType) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 120,
      render: (_: any, record: DriverType) => (
        <Space size="small">
          <Tooltip title="Tarix">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Qator clickini to'xtatadi
                viewDriverHistory(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Qator clickini to'xtatadi
                onEdit(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={filteredDrivers}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        total,
        current: filters.page || 1,
        pageSize: filters.pageSize || 10,
        showSizeChanger: true,
        showTotal: (total) => `Jami ${total} ta`,
        size: 'small'
      }}
      onChange={(pagination, filters, sorter: any) => {
        onFiltersChange({
          ...filters,
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortBy: sorter.field,
          sortOrder: sorter.order,
        });
      }}
      onRow={(record) => {
        return {
          onClick: () => viewDriverHistory(record),
          style: { cursor: 'pointer' }
        };
      }}
      size="small"
      bordered={false}
      style={{ marginTop: 12 }}
    />
  );
};

export default DriversList;