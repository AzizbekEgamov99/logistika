import React, { useState } from 'react';
import { Card, Table, Tag, Avatar, Space, Typography, Row, Col, Input, Empty, Spin, Button, Popconfirm, message } from 'antd';
import {
  CarOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useFurgons } from '../../../hooks/useFurgon';
import FurgonForm from './FurgonForm';
import styles from '../style/furgon.module.css';
import { formatImageUrl } from '@/api/axiosInstance';

const { Text, Title } = Typography;

interface AllFurgonsProps {
  onAddNew: () => void;
}

const AllFurgons: React.FC<AllFurgonsProps> = ({ onAddNew }) => {
  const [searchText, setSearchText] = useState('');
  const { furgons, isLoading, deleteFurgon } = useFurgons();
  const [editingFurgon, setEditingFurgon] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const filteredFurgons = furgons?.filter(furgon =>
    furgon.name.toLowerCase().includes(searchText.toLowerCase()) ||
    furgon.number.toLowerCase().includes(searchText.toLowerCase()) ||
    (furgon.description && furgon.description.toLowerCase().includes(searchText.toLowerCase()))
  ) || [];

  const handleEdit = (furgon) => {
    setEditingFurgon(furgon);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFurgon(id);
    } catch (error) {
      console.error('Delete error:', error);

      // Display specific error message
      let errorMessage = 'Furgonni o\'chirishda xatolik yuz berdi';

      if (error.message && error.message.includes('bog\'langan')) {
        errorMessage = error.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response?.data === 'object') {
        // Try to extract error message from the response data
        const errorData = error.response.data;
        const errorTexts = Object.values(errorData).flat().join(', ');
        if (errorTexts) {
          errorMessage = `Xatolik: ${errorTexts}`;
        }
      }

      // Import message from antd at the top and use this line
      message.error(errorMessage);
    }
  };

  const columns = [
    {
      title: 'Furgon',
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
              <Text type="secondary">#{record.number}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometer',
      key: 'kilometer',
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag color={record.is_busy ? 'red' : 'green'}>
          {record.is_busy ? "Band" : "Bo'sh"}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Furgonni o'chirmoqchimisiz?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger icon={<DeleteOutlined />}>O`chirish</Button>
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
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Ma`lumotlar yuklanmoqda...</Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.allContainer}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card style={{ marginBottom: 16, background: '#e6f7ff', border: '1px solid #bae7ff' }}>
            <Space>
              <CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
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
      >
        {filteredFurgons.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredFurgons}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className={styles.furgonTable}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Furgonlar mavjud emas"
          />
        )}
      </Card>

      {/* Tahrirlash modali */}
      <FurgonForm
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        furgon={editingFurgon}
      />
    </div>
  );
};

export default AllFurgons; 