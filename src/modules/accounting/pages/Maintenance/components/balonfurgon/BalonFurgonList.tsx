import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BalonFurgonType } from '../../types/maintenance';
import BalonFurgonForm from './BalonFurgonForm';
import { useFurgons } from '@/modules/accounting/hooks/useFurgon';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';
import dayjs from 'dayjs';
import '../../style/maintenance.css';

interface BalonFurgonListProps {
  balonFurgonServices: BalonFurgonType[];
  updateBalonFurgonService: ({ id, service }: { id: number; service: BalonFurgonType }) => void;
  deleteBalonFurgonService: (id: number) => void;
}

// Helper function to get balon type label - capitalize first letter of the type
const getBalonTypeLabel = (type: string | null) => {
  if (!type) return '-';
  
  // Capitalize first letter if it's just a plain string from backend
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const BalonFurgonList: React.FC<BalonFurgonListProps> = ({
  balonFurgonServices,
  updateBalonFurgonService,
  deleteBalonFurgonService
}) => {
  const [editingRecord, setEditingRecord] = useState<BalonFurgonType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { furgons = [] } = useFurgons();
  const { currencies } = useCurrencies();
  const [currencyMap, setCurrencyMap] = useState<Record<number, any>>({});

  // Map for furgon names
  const furgonMap = furgons.reduce((acc, furgon) => {
    acc[furgon.id] = furgon.name;
    return acc;
  }, {} as Record<number, string>);

  // Create currency map when currencies are loaded
  useEffect(() => {
    if (currencies?.length > 0) {
      const map: Record<number, any> = {};
      currencies.forEach(currency => {
        map[currency.id] = currency;
      });
      setCurrencyMap(map);
    }
  }, [currencies]);

  const getCurrencyName = (currencyId: number | null): string => {
    if (!currencyId) return 'UZS';
    return currencyMap[currencyId]?.currency || 'UZS';
  };

  const handleEdit = (record: BalonFurgonType) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values: BalonFurgonType) => {
    if (!editingRecord?.id) return;
    
    setLoading(true);
    try {
      await updateBalonFurgonService({
        id: editingRecord.id,
        service: values
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating balon furgon service:', error);
    } finally {
      setLoading(false);
      setEditingRecord(null);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Tasdiqlash',
      content: 'Rostdan ham bu xizmatni o\'chirmoqchimisiz?',
      okText: 'Ha',
      cancelText: 'Yo\'q',
      onOk: () => deleteBalonFurgonService(id)
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Furgon',
      dataIndex: 'furgon',
      key: 'furgon',
      render: (furgonId: number) => furgonMap[furgonId] || furgonId
    },
    {
      title: 'Balon turi',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getBalonTypeLabel(type)
    },
    {
      title: 'Narx',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: BalonFurgonType) => 
        `${price?.toLocaleString()} ${getCurrencyName(record.currency)}`
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometr',
      key: 'kilometr',
    },
    {
      title: 'Soni',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: BalonFurgonType) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id!)}
          />
        </Space>
      )
    }
  ];

  return (
    <>
      <Card title="Furgon balon xizmatlari ro'yxati">
        <Table
          dataSource={balonFurgonServices}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Furgon balon xizmatini tahrirlash"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        footer={null}
        destroyOnHidden
      >
        <BalonFurgonForm
          initialValues={editingRecord || undefined}
          onFinish={handleUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingRecord(null);
          }}
          furgons={furgons}
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default BalonFurgonList; 
