import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Select, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TehnicalService } from '@/modules/accounting/types/maintenance';
import axiosInstance from '@/api/axiosInstance';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';

const { Option } = Select;

interface TehnicalServiceListProps {
  tehnicalServices: TehnicalService[];
  updateTehnicalService: (params: { id: number; service: TehnicalService }) => void;
  deleteTehnicalService: (id: number) => void;
}

const TehnicalServiceList: React.FC<TehnicalServiceListProps> = ({
  tehnicalServices,
  updateTehnicalService,
  deleteTehnicalService,
}) => {
  const [editingService, setEditingService] = useState<TehnicalService | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [cars, setCars] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [carMap, setCarMap] = useState<Record<number, any>>({});
  const [serviceMap, setServiceMap] = useState<Record<number, any>>({});
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [currencyMap, setCurrencyMap] = useState<Record<number, any>>({});

  useEffect(() => {
    // Fetch cars
    const fetchCars = async () => {
      try {
        const response = await axiosInstance.get('/cars/');
        setCars(response.data);
        
        // Create a map for quick access
        const map: Record<number, any> = {};
        response.data.forEach((car: any) => {
          map[car.id] = car;
        });
        setCarMap(map);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    // Fetch services
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/service/');
        setServices(response.data);
        
        // Create a map for quick access
        const map: Record<number, any> = {};
        response.data.forEach((service: any) => {
          map[service.id] = service;
        });
        setServiceMap(map);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchCars();
    fetchServices();
  }, []);

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
    if (isModalVisible && editingService) {
      form.setFieldsValue({
        car: editingService.car,
        service: editingService.service,
        kilometer: editingService.kilometer,
        price: editingService.price,
        currency: editingService.currency,
      });
    }
  }, [isModalVisible, editingService, form]);

  const handleEdit = (service: TehnicalService) => {
    setEditingService(service);
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      if (editingService?.id) {
        updateTehnicalService({
          id: editingService.id,
          service: {
            ...editingService,
            car: values.car,
            service: values.service,
            kilometer: values.kilometer,
            price: values.price,
            currency: values.currency,
          },
        });
      }
      setIsModalVisible(false);
    });
  };

  const getCurrencyName = (currencyId: number | null): string => {
    if (!currencyId) return '';
    return currencyMap[currencyId]?.currency || '';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Transport',
      dataIndex: 'car',
      key: 'car',
      render: (carId: number) => (carMap[carId] ? `${carMap[carId].name} - ${carMap[carId].car_number}` : 'Unknown'),
    },
    {
      title: 'Xizmat turi',
      dataIndex: 'service',
      key: 'service',
      render: (serviceId: number) => (serviceMap[serviceId] ? serviceMap[serviceId].name : 'Unknown'),
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (kilometer: number) => `${kilometer} km`,
    },
    {
      title: 'Narxi',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: TehnicalService) => `${price.toLocaleString()} ${getCurrencyName(record.currency)}`,
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: TehnicalService) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="text"
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Haqiqatan ham o'chirishni xohlaysizmi?"
            onConfirm={() => record.id && deleteTehnicalService(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button icon={<DeleteOutlined />} danger type="text">
              O`chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tehnicalServices}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Texnik xizmatni tahrirlash"
        open={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        forceRender={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="car"
            label="Transport"
            rules={[{ required: true, message: 'Iltimos, transport tanlang!' }]}
          >
            <Select placeholder="Transport tanlang">
              {cars.map((car) => (
                <Option key={car.id} value={car.id}>
                  {car.name} - {car.car_number}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="service"
            label="Xizmat turi"
            rules={[{ required: true, message: 'Iltimos, xizmat turini tanlang!' }]}
          >
            <Select placeholder="Xizmat turini tanlang">
              {services.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="kilometer"
            label="Kilometr"
            rules={[{ required: true, message: 'Iltimos, Kilometrni kiriting!' }]}
          >
            <Input type="number" placeholder="Kilometrni kiriting" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Narxi"
            rules={[{ required: true, message: 'Iltimos, narxni kiriting!' }]}
          >
            <Input type="number" placeholder="Narxni kiriting" />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Valyuta"
            rules={[{ required: true, message: 'Iltimos, valyutani tanlang!' }]}
          >
            {currenciesLoading ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Spin size="small" style={{ marginRight: 8 }} />
                <span>Valyutalar yuklanmoqda...</span>
              </div>
            ) : (
              <Select placeholder="Valyutani tanlang">
                {currencies?.map((currency) => (
                  <Option key={`currency-${currency.id}`} value={currency.id}>
                    {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TehnicalServiceList; 