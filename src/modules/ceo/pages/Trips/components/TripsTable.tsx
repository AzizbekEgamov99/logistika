import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, ClockCircleOutlined, CarOutlined, EnvironmentOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export interface TripData {
  id: number;
  driverName: string;
  driverId: number;
  clientName: string;
  clientId: number;
  vehicleId: number;
  vehicleNumber: string;
  vehicleType: string;
  startLocation: string;
  endLocation: string;
  startDate: Date;
  endDate: Date | null;
  distance: number;
  price: number;
  expense: number;
  profit: number;
  status: string;
  cargo: string;
  cargoWeight: number;
  notes: string | null;
  country: string;
  rawData?: any;
}

interface TripsTableProps {
  data: TripData[];
  loading: boolean;
  onViewTrip: (record: TripData) => void;
  pagination: boolean | object;
}

export const TripsTable: React.FC<TripsTableProps> = ({
  data,
  loading,
  onViewTrip,
  pagination
}) => {
  // Utility function to format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('uz-UZ') + ' so\'m';
  };

  // Function to render status tag
  const renderStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Yakunlangan
          </Tag>
        );
      case 'in_progress':
        return (
          <Tag color="processing" icon={<LoadingOutlined />}>
            Jarayonda
          </Tag>
        );
      case 'scheduled':
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Rejalashtirilgan
          </Tag>
        );
      case 'cancelled':
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Bekor qilingan
          </Tag>
        );
      default:
        return (
          <Tag color="default">
            Noma`lum
          </Tag>
        );
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Haydovchi',
      dataIndex: 'driverName',
      key: 'driverName',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Mijoz',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Transport',
      dataIndex: 'vehicleNumber',
      key: 'vehicleNumber',
      render: (text: string, record: TripData) => (
        <Space>
          <CarOutlined />
          {text}
          <small>({record.vehicleType})</small>
        </Space>
      ),
    },
    {
      title: 'Yo\'nalish',
      key: 'route',
      render: (_, record: TripData) => (
        <Space direction="vertical" size={0}>
          <div><EnvironmentOutlined /> {record.endLocation}</div>
          <div>{record.distance} km</div>
        </Space>
      ),
    },
    {
      title: 'Sana',
      key: 'date',
      render: (_, record: TripData) => (
        <Space direction="vertical" size={0}>
          <div>
            <CalendarOutlined /> {dayjs(record.startDate).format('DD.MM.YYYY')}
          </div>
          {record.endDate && (
            <div>
              - {dayjs(record.endDate).format('DD.MM.YYYY')}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Narx',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Space>
          <DollarOutlined />
          {formatCurrency(price)}
        </Space>
      ),
    },
    {
      title: 'Foyda',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <Tag color={profit > 0 ? 'success' : 'error'}>
          {formatCurrency(profit)}
        </Tag>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record: TripData) => (
        <Tooltip title="Batafsil ko'rish">
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => onViewTrip(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      scroll={{ x: 1300 }}
    />
  );
}; 