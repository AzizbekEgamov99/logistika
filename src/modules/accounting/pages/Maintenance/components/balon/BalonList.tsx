import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Card, Tooltip, InputNumber, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../style/maintenance.css';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';

// Inline styles
const styles = {
  tableContainer: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginTop: '20px'
  },
  tableTitle: {
    margin: 0,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  titleIcon: {
    color: '#1677ff'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  }
};

// Backend formatiga mos interface
interface BalonServiceType {
  id: number;
  type: string;
  price: number;
  kilometr: number;
  count: number;
  created_at: string;
  car: number;
  currency: number | null;
}

interface BalonListProps {
  balonServices: BalonServiceType[];
  updateBalonService: (params: { id: number; service: any }) => void;
  deleteBalonService: (id: number) => void;
}

const BalonList: React.FC<BalonListProps> = ({
  balonServices,
  updateBalonService,
  deleteBalonService
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BalonServiceType | null>(null);
  const [form] = Form.useForm();
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [currencyMap, setCurrencyMap] = useState<Record<number, any>>({});

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
  
  useEffect(() => {
    if (isModalOpen && selectedService) {
      form.setFieldsValue(selectedService);
    }
  }, [isModalOpen, selectedService, form]);

  const handleEdit = (service: BalonServiceType) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      if (selectedService && selectedService.id !== undefined) {
        updateBalonService({
          id: selectedService.id,
          service: { ...selectedService, ...values },
        });
      }
      setIsModalOpen(false);
    });
  };
  
  const handleDelete = (service: BalonServiceType) => {
    deleteBalonService(service.id);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD.MM.YYYY HH:mm');
  };

  const getCurrencyName = (currencyId: number | null): string => {
    if (!currencyId) return 'UZS';
    return currencyMap[currencyId]?.currency || 'UZS';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Narxi',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: BalonServiceType) => 
        `${price.toLocaleString()} ${getCurrencyName(record.currency)}`,
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometr',
      key: 'kilometr',
      render: (km: number) => `${km.toLocaleString()} km`,
    },
    {
      title: 'Soni',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Mashina',
      dataIndex: 'car_number',
      key: 'car_number',
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Amallar',
      key: 'action',
      width: 150,
      render: (_: any, record: BalonServiceType) => (
        <Space style={styles.actionButtons}>
          <Tooltip title="Tahrirlash">
            <Button 
              type="primary" 
              ghost 
              shape="circle" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title="O'chirish">
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      style={styles.tableContainer}
      title={
        <div style={styles.tableTitle}>
          <UnorderedListOutlined style={styles.titleIcon} /> Balon xizmatlari
        </div>
      }
    >
      <Table 
        dataSource={balonServices} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        style={{ 
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />

      {/* Edit modal */}
      <Modal
        title="Balon xizmatini tahrirlash"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        okText="Saqlash"
        cancelText="Bekor qilish"
        forceRender={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Turi"
            rules={[{ required: true, message: 'Balon turini kiriting!' }]}
          >
            <Select
              options={[
                { value: 'standard', label: 'Standart' },
                { value: 'winter', label: 'Qishki' },
                { value: 'summer', label: 'Yozgi' },
                { value: 'universal', label: 'Universal' }
              ]}
            />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Narx"
            rules={[{ required: true, message: 'Narxni kiriting!' }]}
          >
            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="Valyuta"
            rules={[{ required: true, message: 'Iltimos, valyutani tanlang!' }]}
          >
            <Select placeholder="Valyutani tanlang" loading={currenciesLoading}>
              {currencies?.map((currency) => (
                <Select.Option key={currency.id} value={currency.id}>
                  {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="kilometr"
            label="Kilometr"
            rules={[{ required: true, message: 'Kilometrni kiriting!' }]}
          >
            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          
          <Form.Item
            name="count"
            label="Soni"
            rules={[{ required: true, message: 'Sonini kiriting!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          
          <Form.Item
            name="car"
            label="Mashina"
            rules={[{ required: true, message: 'Mashina ID sini kiriting!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BalonList;
