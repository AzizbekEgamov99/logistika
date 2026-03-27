import React, { useState } from 'react';
import { Table, Button, Space, Card, Typography, Modal, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Currency, CurrencyFormValues } from '../types/currency';
import { useCurrency } from '../hooks/useCurrency';
import CurrencyForm from './CurrencyForm';

const { Title } = Typography;
const { confirm } = Modal;

const CurrencyManagement: React.FC = () => {
  const { currencies, loading, addCurrency, editCurrency, removeCurrency } = useCurrency();

  const [formVisible, setFormVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
  const [formTitle, setFormTitle] = useState('Valyuta qo\'shish');

  const handleAdd = () => {
    setSelectedCurrency(undefined);
    setFormTitle('Yangi valyuta qo\'shish');
    setFormVisible(true);
  };

  const handleEdit = (record: Currency) => {
    setSelectedCurrency(record);
    setFormTitle(`Valyutani tahrirlash: ${record.currency}`);
    setFormVisible(true);
  };

  const handleDelete = (record: Currency) => {
    confirm({
      title: 'Valyutani o\'chirmoqchimisiz?',
      icon: <ExclamationCircleOutlined />,
      content: `${record.currency} valyutasini o'chirish istaysizmi?`,
      okText: 'Ha',
      okType: 'danger',
      cancelText: 'Yo\'q',
      onOk: async () => {
        await removeCurrency(record.id);
      },
    });
  };

  const handleFormSubmit = async (values: CurrencyFormValues) => {
    if (selectedCurrency) {
      return await editCurrency(selectedCurrency.id, values);
    } else {
      return await addCurrency(values);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const columns = [
    {
      title: 'Valyuta',
      dataIndex: 'currency',
      key: 'currency',
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '16px', padding: '4px 8px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Kursi (UZS)',
      dataIndex: 'rate_to_uzs',
      key: 'rate_to_uzs',
      render: (text: string) => (
        <span style={{ fontWeight: 'bold' }}>
          {parseFloat(text).toLocaleString('uz-UZ')} so'm
        </span>
      ),
    },
    {
      title: 'Yangilangan vaqti',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text: string) => (
        <span>
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: Currency) => (
        <Space size="middle">
          <Tooltip title="Tahrirlash">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={4}>Valyutalar boshqaruvi</Title>}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          Valyuta qo'shish
        </Button>
      }
      style={{ marginBottom: '24px' }}
    >
      <Table
        columns={columns}
        dataSource={currencies}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Valyutalar mavjud emas' }}
        footer={() => (
          <div style={{ textAlign: 'right' }}>
            <Tag icon={<SyncOutlined spin={loading} />} color="processing">
              {loading ? 'Yangilanmoqda...' : 'Oxirgi yangilanish: ' + new Date().toLocaleTimeString()}
            </Tag>
          </div>
        )}
      />

      <CurrencyForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedCurrency}
        title={formTitle}
        loading={loading}
      />
    </Card>
  );
};

export default CurrencyManagement; 