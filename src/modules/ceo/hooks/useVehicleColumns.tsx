import React, { useMemo } from 'react';
import { Space, Tag, Button, Avatar, Typography, Popconfirm } from 'antd';
import { CarOutlined, EditOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatImageUrl } from '../../../api/axiosInstance';

const { Text } = Typography;

// Handle car actions with better error checking
const handleCarDelete = (car: any, handleDelete: (car: any) => void) => {
  if (!car || !car.id) {
    console.error('Invalid car object for deletion', car);
    return;
  }
  console.log('Calling delete handler for car:', car.id);
  handleDelete(car);
};

// Handle furgon actions with better error checking
const handleFurgonDelete = (furgon: any, handleDelete: (furgon: any) => void) => {
  if (!furgon || !furgon.id) {
    console.error('Invalid furgon object for deletion', furgon);
    return;
  }
  console.log('Calling delete handler for furgon:', furgon.id);
  handleDelete(furgon);
};

export const useVehicleColumns = (
  handleEditCar: (car: any) => void,
  handleDeleteCar: (car: any) => void,
  handleViewCarHistory: (id: number) => void,
  handleEditFurgon: (furgon: any) => void,
  handleDeleteFurgon: (furgon: any) => void,
  handleViewFurgonHistory: (id: number) => void
) => {
  // Car columns for table - memoized to prevent re-creation
  const carColumns = useMemo(() => [
    {
      title: 'Avtomobil',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          {record.photo ? (
            <Avatar 
              src={formatImageUrl(record.photo) || undefined}
              shape="square" 
              size={48}
            />
          ) : (
            <Avatar 
              icon={<CarOutlined />} 
              shape="square" 
              size={48}
              style={{ backgroundColor: '#1890ff' }}
            />
          )}
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary">#{record.car_number}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Model',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Holati',
      dataIndex: 'holat',
      key: 'holat',
      render: (holat, record) => (
        <Tag color={record.is_busy ? 'processing' : record.holat === 'tamirda' ? 'error' : 'success'}>
          {record.is_busy ? "Reysda" : record.holat === 'tamirda' ? 'Ta\'mirda' : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Yurgan masofasi',
      dataIndex: 'mileage',
      key: 'mileage',
      render: (kilometer) => `${kilometer || 0} km`,
    },
    {
      title: 'Yil',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCar(record)}
          >
            Tahrirlash
          </Button>
          <Button 
            type="default"
            size="small"
            onClick={() => handleViewCarHistory(record.id)}
            icon={<HistoryOutlined />}
          >
            Tarix
          </Button>
          <Popconfirm
            title="Avtomobilni o'chirmoqchimisiz?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => handleDeleteCar(record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              O&apos;chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [handleEditCar, handleDeleteCar, handleViewCarHistory]);

  // Furgon columns for table - memoized to prevent re-creation
  const furgonColumns = useMemo(() => [
    {
      title: 'Furgon',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (_, record) => (
        <Space>
          {record.photo ? (
            <Avatar 
              src={formatImageUrl(record.photo) || undefined}
              shape="square" 
              size={48}
            />
          ) : (
            <Avatar 
              icon={<CarOutlined />} 
              shape="square" 
              size={48}
              style={{ backgroundColor: '#52c41a' }}
            />
          )}
          <div>
            <Text strong>{record.name || 'Furgon'}</Text>
            <div>
              <Text type="secondary">#{record.number}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Davlat raqami',
      dataIndex: 'number',
      key: 'number',
      width: '15%',
    },
    {
      title: 'Kilometr',
      dataIndex: 'mileage',
      key: 'mileage',
      width: '15%',
      render: (kilometer) => kilometer ? `${kilometer} km` : '0 km',
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Holati',
      dataIndex: 'holat',
      key: 'holat',
      width: '10%',
      render: (holat, record) => (
        <Tag color={record.is_busy ? 'error' : record.holat === 'tamirda' ? 'warning' : 'success'}>
          {record.is_busy ? "Band" : record.holat === 'tamirda' ? 'Ta\'mirda' : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: '25%',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            onClick={() => handleEditFurgon(record)}
          >
            Tahrirlash
          </Button>
          <Button
            type="default"
            size="middle"
            onClick={() => handleViewFurgonHistory(record.id)}
            icon={<HistoryOutlined />}
          >
            Tarix
          </Button>
          <Popconfirm
            title="Furgonni o'chirmoqchimisiz?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => handleDeleteFurgon(record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              danger
              size="middle"
              icon={<DeleteOutlined />}
            >
              O&apos;chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [handleEditFurgon, handleDeleteFurgon, handleViewFurgonHistory]);

  return { carColumns, furgonColumns };
}; 