import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Card, Tooltip, InputNumber, Select } from 'antd';
import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useCars } from '@/modules/accounting/hooks/useCars'; // Assuming this hook exists
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
interface OptolServiceType {
  id: number;
  price: number;
  kilometr: number;
  created_at: string;
  car: number;
  currency: number | null;
}

interface OptolListProps {
  optolServices: OptolServiceType[];
  updateOptolService: (params: { id: number; service: any }) => void;
  deleteOptolService: (id: number) => void;
}

const OptolList: React.FC<OptolListProps> = ({
  optolServices,
  updateOptolService,
  deleteOptolService,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<OptolServiceType | null>(null);
  const [form] = Form.useForm();
  const { cars = [] } = useCars(); // Assuming this hook to fetch cars
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

  const handleEdit = (service: OptolServiceType) => {
    setSelectedService(service);
    form.setFieldsValue(service);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      if (selectedService && selectedService.id !== undefined) {
        updateOptolService({
          id: selectedService.id,
          service: { ...selectedService, ...values },
        });
      }
      setIsModalOpen(false);
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCarName = (carId: number | null) => {
    if (!carId) return 'Noma\'lum';
    const car = cars.find(c => c.id === carId);
    return car ? car.name : 'Noma\'lum';
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
      title: 'Narxi',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: OptolServiceType) => 
        `${price.toLocaleString()} ${getCurrencyName(record.currency)}`,
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometr',
      key: 'kilometr',
      render: (km: number) => `${km.toLocaleString()} km`,
    },
    {
      title:"kurs narxi",
      dataIndex: 'custom_rate_to_uzs',
      key: 'custom_rate_to_uzs',
      render: (custom_rate_to_uzs: number) => (
        <span>{custom_rate_to_uzs}</span>
      )
    },
    {
      title: 'Mashina',
      dataIndex: 'car_number',
      key: 'car_number',
      render: (car_number: string | null) => car_number,
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
      width: 180,
      render: (_: any, record: OptolServiceType) => (
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
          
          <Popconfirm
            title="Bu xizmatni o'chirishni xohlaysizmi?"
            onConfirm={() => deleteOptolService(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Tooltip title="O'chirish">
              <Button 
                danger 
                shape="circle" 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      style={styles.tableContainer}
      title={
        <div style={styles.tableTitle}>
          <UnorderedListOutlined style={styles.titleIcon} /> Moy xizmatlari
        </div>
      }
    >
      <Table 
        dataSource={optolServices} 
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
        title="Moy xizmatini tahrirlash"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        okText="Saqlash"
        cancelText="Bekor qilish"
        forceRender={true}
      >
        <Form form={form} layout="vertical">
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
            name="car"
            label="Mashina"
            rules={[{ required: true, message: 'Mashina sini kiriting!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OptolList;
