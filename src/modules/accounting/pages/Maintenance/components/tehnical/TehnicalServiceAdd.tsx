import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Tag, InputNumber } from 'antd';
import { PlusOutlined, CarOutlined } from '@ant-design/icons';
import { TehnicalService } from '@/modules/accounting/types/maintenance';
import axiosInstance from '@/api/axiosInstance';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';

const { Option } = Select;

interface TehnicalServiceAddProps {
  addTehnicalService: (service: TehnicalService) => void;
}

const TehnicalServiceAdd: React.FC<TehnicalServiceAddProps> = ({ addTehnicalService }) => {
  const [form] = Form.useForm();
  const [cars, setCars] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const { currencies, loading: currenciesLoading } = useCurrencies();

  useEffect(() => {
    // Fetch cars
    const fetchCars = async () => {
      try {
        const response = await axiosInstance.get('/cars/');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    // Fetch services
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/service/');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchCars();
    fetchServices();
  }, []);

  const onFinish = (values: any) => {
    const newService: TehnicalService = {
      price: values.price,
      kilometer: values.kilometer,
      car: values.car,
      service: values.service,
      currency: values.currency,
      custom_rate_to_uzs: values.custom_rate_to_uzs,
    };

    addTehnicalService(newService);
    form.resetFields();
  };

  return (
    <Card title="Yangi texnik xizmat qo'shish" style={{ marginBottom: 16 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="car"
          label="Transport"
          rules={[{ required: true, message: 'Iltimos, transport tanlang!' }]}
        >
          <Select placeholder="Transport tanlang">
            {cars.map((car) => (
              <Option key={car.id} value={car.id}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CarOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                  <span style={{ fontWeight: 500 }}>{car.name}</span>
                  {car.car_number && (
                    <Tag color="blue" style={{ marginLeft: 4 }}>{car.car_number}</Tag>
                  )}
                </span>
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
          initialValue={currencies?.length > 0 ? currencies[0].id : undefined}
        >
          <Select placeholder="Valyutani tanlang" loading={currenciesLoading}
            onChange={(value) => {
              const selectedCurrency = currencies?.find(c => c.id === value);
              if (selectedCurrency) {
                form.setFieldsValue({
                  custom_rate_to_uzs: selectedCurrency.rate_to_uzs
                });
              }
            }}
          >
            {currencies?.map((currency) => (
              <Option key={currency.id} value={currency.id}>
                {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="custom_rate_to_uzs"
          label="Valyuta kursi"
          rules={[{ required: true, message: 'Iltimos, valyuta kursini kiriting!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Valyuta kursi"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|,*/g, '')}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Qo'shish
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TehnicalServiceAdd; 