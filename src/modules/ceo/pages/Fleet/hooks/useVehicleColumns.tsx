import { useCallback } from 'react';
import { Space, Button, Tag, Avatar, Popconfirm } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  HistoryOutlined,
  CarOutlined
} from '@ant-design/icons';
import { formatImageUrl } from '../../../../../api/axiosInstance';

// Define interfaces for car and furgon based on the data structure
interface Car {
  id?: number;
  name: string;
  number: string;
  photo?: string;
  year?: string;
  engine?: string;
  transmission?: string;
  power?: string;
  capacity?: string;
  fuel?: string;
  holat?: string;
  car_number?: string;
  mileage?: number;
  is_busy?: boolean;
}

interface Furgon {
  id?: number;
  name: string;
  number: string;
  photo?: string;
  kilometer?: number;
  status?: string;
  description?: string;
  is_busy?: boolean;
}

// Helper function to format photo URL
const formatPhotoUrl = (photo?: string): string => {
  return formatImageUrl(photo) || '';
};

export const useVehicleColumns = (
  handleEditCar: (car: Car) => void,
  handleDeleteCar: (car: Car) => void,
  handleViewCarHistory: (id: number) => void,
  handleEditFurgon: (furgon: Furgon) => void,
  handleDeleteFurgon: (furgon: Furgon) => void,
  handleViewFurgonHistory: (id: number) => void
) => {
  // Define car columns with actions
  const carColumns = [
    {
      title: 'Avtomobil',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Car) => (
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
            <div><strong>{record.name}</strong></div>
            <div>#{record.number}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Davlat raqami',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Yurgan masofasi',
      dataIndex: 'mileage',
      key: 'mileage',
      render: (mileage?: number) => mileage ? `${mileage.toLocaleString()} km` : '-',
    },
    {
      title: 'Ishlab chiqarilgan yil',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Holati',
      dataIndex: 'holat',
      key: 'holat',
      render: (_: any, record: Car) => (
        <Tag color={record.is_busy ? 'red' : 'green'}>
          {record.is_busy ? "Band" : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Car) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEditCar(record)}
            size="middle"
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Avtomobilni o'chirmoqchimisiz?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => handleDeleteCar(record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger icon={<DeleteOutlined />} size="middle">O`chirish</Button>
          </Popconfirm>
          <Button 
            icon={<HistoryOutlined />} 
            onClick={() => record.id && handleViewCarHistory(record.id)}
            size="middle"
          >
            Tarix
          </Button>
        </Space>
      ),
      onEdit: handleEditCar,
      onDelete: handleDeleteCar,
      onViewHistory: handleViewCarHistory
    },
  ];

  // Define furgon columns with actions
  const furgonColumns = [
    {
      title: 'Furgon',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Furgon) => (
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
            <div><strong>{record.name}</strong></div>
            <div>#{record.number}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Davlat raqami',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (kilometer?: number) => kilometer ? `${kilometer.toLocaleString()} km` : '-',
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: Furgon) => (
        <Tag color={record.is_busy ? 'red' : 'green'}>
          {record.is_busy ? "Band" : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Furgon) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEditFurgon(record)}
            size="middle"
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Furgonni o'chirmoqchimisiz?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => handleDeleteFurgon(record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger icon={<DeleteOutlined />} size="middle">O`chirish</Button>
          </Popconfirm>
          <Button 
            icon={<HistoryOutlined />} 
            onClick={() => record.id && handleViewFurgonHistory(record.id)}
            size="middle"
          >
            Tarix
          </Button>
        </Space>
      ),
      onEdit: handleEditFurgon,
      onDelete: handleDeleteFurgon,
      onViewHistory: handleViewFurgonHistory
    },
  ];

  return { carColumns, furgonColumns };
};

export default useVehicleColumns; 