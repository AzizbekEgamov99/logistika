import React from 'react';
import { Table, Space, Avatar, Badge, Button, Tag, Tooltip } from 'antd';
import { UserOutlined, CarOutlined, ClockCircleOutlined, HistoryOutlined, EditOutlined, DeleteOutlined, IdcardOutlined } from '@ant-design/icons';
import { DriverType } from '../../../../../accounting/types/driver';

import { baseURL, formatImageUrl } from '../../../../../../api/axiosInstance';

// Helper component for date formatting to prevent hydration mismatch
const FormattedDate = ({ date }: { date: string | null }) => {
  if (!date) return <span>Mavjud emas</span>;
  return <span>{new Date(date).toLocaleDateString('uz-UZ')}</span>;
};

interface DriversTableProps {
  drivers: DriverType[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onViewDriver: (driver: DriverType) => void;
  onEditDriver: (driver: DriverType) => void;
  onDeleteDriver: (driver: DriverType) => void;
}

const DriversTable: React.FC<DriversTableProps> = ({
  drivers,
  loading,
  pagination,
  onTableChange,
  onViewDriver,
  onEditDriver,
  onDeleteDriver
}) => {
  const columns = [
    {
      title: 'Haydovchi',
      key: 'driver',
      width: 240,
      render: (_: any, record: DriverType) => (
        <Space>
          <div style={{ position: 'relative' }}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#1890ff',
              }}
            >
              {(record.fullname ? record.fullname.charAt(0).toUpperCase() : null)}
            </Avatar>

            {record.is_busy && (
              <Badge
                status="success"
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullname}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.phone_number}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'To\'langan pul',
      key: 'total_rays_usd',
      width: 140,
      render: (_: any, record: DriverType) => (
        <Tag color={record.total_rays_usd && record.total_rays_usd < 0 ? 'error' : 'success'}>
          {record.total_rays_usd?.toLocaleString() || 0} $
        </Tag>
      ),
    },
    {
      title: 'Pasport',
      key: 'passport',
      width: 150,
      render: (_: any, record: DriverType) => (
        <span>
          {record.passport_series && record.passport_number 
            ? `${record.passport_series} ${record.passport_number}` 
            : 'Mavjud emas'}
        </span>
      ),
    },
    {
      title: 'Ro\'yxatdan o\'tgan',
      key: 'date',
      width: 130,
      render: (_: any, record: DriverType) => (
        <FormattedDate date={record.date} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: DriverType) => {
        // Handle on road or waiting status
        if (status === 'driver') {
          if (record.is_busy) {
            // Green "Yo'lda" style for on road
            return (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '12px',
                  padding: '0 10px',
                }}
              >
                <CarOutlined style={{ color: '#52c41a', marginRight: 5 }} />
                <span style={{ color: '#52c41a' }}>Yo'lda</span>
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '12px',
                  padding: '0 10px',
                }}
              >
                <ClockCircleOutlined
                  style={{ color: '#ff4d4f', marginRight: 5 }}
                />
                <span style={{ color: '#ff4d4f' }}>Kutishda</span>
              </div>
            );
          }
        } else if (status === 'on_trip') {
          return (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '12px',
                padding: '0 10px',
              }}
            >
              <CarOutlined style={{ color: '#52c41a', marginRight: 5 }} />
              <span style={{ color: '#52c41a' }}>Yo'lda</span>
            </div>
          );
        }

        // Default gray style for other statuses
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              border: '1px solid #d9d9d9',
              borderRadius: '12px',
              padding: '0 10px',
            }}
          >
            <span>Noma`lum</span>
          </div>
        );
      },
    },
    {
      title: 'Reyslar',
      key: 'trips',
      width: 100,
      render: (_: any, record: DriverType) => (
        <span>{record.rays_count || 0}</span>
      ),
    },
    {
      title: 'Amallar',
      key: 'action',
      width: 180,
      render: (_: any, record: DriverType) => (
        <Space size="middle">
          <Tooltip title="Haydovchi tarixi">
            <Button
              type="primary"
              size="small"
              shape="circle"
              onClick={() => onViewDriver(record)}
              icon={<HistoryOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEditDriver(record)}
              style={{ backgroundColor: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="primary"
              danger
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => onDeleteDriver(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={drivers}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
      }}
      onChange={onTableChange}
      size="middle"
      scroll={{ x: 'max-content' }}
      expandable={{
        expandedRowRender: (record: DriverType) => (
          <div style={{ padding: '10px 20px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px', color: '#1890ff' }}>Pasport va Qo'shimcha Ma'lumotlar</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <p><strong>Seriya va raqam:</strong> {record.passport_series || ''} {record.passport_number || 'Mavjud emas'}</p>
                <p><strong>Kim tomonidan berilgan:</strong> {record.passport_issued_by || 'Mavjud emas'}</p>
                <p><strong>Berilgan sana:</strong> <FormattedDate date={record.passport_issued_date} /></p>
                <p><strong>Tug'ilgan sana:</strong> <FormattedDate date={record.passport_birth_date} /></p>
              </div>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <p><strong>Guvohnoma:</strong> {record.license_number || 'Mavjud emas'}</p>
                <p><strong>Guvohnoma muddati:</strong> <FormattedDate date={record.license_expiry || null} /></p>
                <p><strong>Tizimdagi login:</strong> {record.username || 'Mavjud emas'}</p>
              </div>
              {record.passport_photo && (
                <div style={{ flex: '0 0 auto' }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Pasport nusxasi:</strong></p>
                  <Avatar 
                    src={formatImageUrl(record.passport_photo)} 
                    shape="square" 
                    size={80} 
                    icon={<IdcardOutlined />} 
                  />
                </div>
              )}
            </div>
          </div>
        ),
        rowExpandable: (record) => true,
      }}
    />
  );
};

export default DriversTable; 