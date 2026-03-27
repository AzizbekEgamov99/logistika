import React, { useState } from 'react';
import { Card, Table, Tag, Avatar, Space, Typography, Row, Col, Input, Empty, Button, Popconfirm, message } from 'antd';
import { 
  CarOutlined, 
  SearchOutlined, 
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styles from '../styles/Fleet.module.css';
import { formatImageUrl } from '../../../../../../api/axiosInstance';

const { Text, Title } = Typography;

// Define Furgon interface that matches the data structure
interface Furgon {
  id?: number;
  name: string;
  number: string;
  photo?: string;
  kilometer?: number;
  mileage?: number;
  status?: string;
  description?: string;
  is_busy?: boolean;
  holat?: string;
}

interface FleetFurgonTableProps {
  furgons: Furgon[];
  isLoading: boolean;
  onEdit: (furgon: Furgon) => void;
  onDelete: (furgon: Furgon) => void;
  onAddNew: () => void;
  onViewHistory: (id: number) => void;
}

const FleetFurgonTable: React.FC<FleetFurgonTableProps> = ({ 
  furgons, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAddNew,
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredFurgons = furgons?.filter(furgon => 
    (furgon.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (furgon.number?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (furgon.description?.toLowerCase() || '').includes(searchText.toLowerCase())
  ) || [];

  const formatPhotoUrl = (photo?: string): string => {
    return formatImageUrl(photo) || '';
  };

  const columns = [
    {
      title: 'Furgon',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (_, record: Furgon) => (
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
      width: '18%',
    },
    {
      title: 'Kilometr',
      dataIndex: 'mileage',
      key: 'mileage',
      width: '15%',
      render: (mileage, record: Furgon) => {
        const distance = mileage || record.kilometer || 0;
        return `${distance.toLocaleString()} km`;
      },
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Holati',
      dataIndex: 'holat',
      key: 'holat',
      width: '10%',
      render: (holat, record: Furgon) => (
        <Tag color={record.is_busy ? 'error' : record.holat === 'tamirda' ? 'warning' : 'success'}>
          {record.is_busy ? "Band" : record.holat === 'tamirda' ? 'Ta\'mirda' : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: '15%',
      render: (_, record: Furgon) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            size="middle"
          >
          </Button>
          <Popconfirm
            title="Furgonni o'chirmoqchimisiz?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => onDelete(record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="middle"
            >
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div className="ant-spin ant-spin-lg ant-spin-spinning">
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Ma`lumotlar yuklanmoqda...</Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card style={{ marginBottom: 16, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Space>
              <CarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <Text strong>Barcha furgonlar</Text>
                <br />
                <Text type="secondary">Jami: {filteredFurgons.length} ta furgon</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title={<Title level={5}><CarOutlined /> Furgonlar ro`yxati</Title>}
        extra={
          <Space>
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={onAddNew}
            >
              Yangi qo`shish
            </Button>
          </Space>
        }
        className={styles.furgonCard}
      >
        {filteredFurgons.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredFurgons}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className={styles.furgonTable}
            scroll={{ x: 1000 }}
            bordered
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Furgonlar mavjud emas" 
          />
        )}
      </Card>
    </div>
  );
};

export default FleetFurgonTable; 