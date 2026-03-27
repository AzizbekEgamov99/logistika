import React from 'react';
import { Form, Select, InputNumber, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

const { Option } = Select;

// Fetch cars from API
const getCars = async () => {
  const response = await axiosInstance.get('/cars');
  return response.data;
};

// Fetch service types from API
const getServiceTypes = async () => {
  const response = await axiosInstance.get('/service-types');
  return response.data;
};

interface StandardServiceFormProps {
  onSubmit: (values) => void;
}

const StandardServiceForm: React.FC<StandardServiceFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedServiceType, setSelectedServiceType] = React.useState<string>("");

  // Fetch cars
  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  });

  // Fetch service types
  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: getServiceTypes,
  });

  const handleSubmit = (values) => {
    // Add current date
    const serviceData = {
      ...values,
      date: new Date().toISOString().split('T')[0],
    };
    
    onSubmit(serviceData);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="service-form"
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="carId"
        label="Mashinani tanlang"
        rules={[{ required: true, message: "Iltimos, mashina tanlang!" }]}
      >
        <Select placeholder="Mashina">
          {cars.map((car) => (
            <Option key={car.id} value={car.id}>
              {car.model} ({car.number})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="serviceType"
        label="Xizmat turini tanlang"
        rules={[{ required: true, message: "Iltimos, xizmat turini tanlang!" }]}
      >
        <Select
          placeholder="Xizmat turi"
          onChange={(value) => setSelectedServiceType(value)}
        >
          {serviceTypes.map((type) => (
            <Option key={type.id} value={type.id}>
              {type.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {selectedServiceType === 'oil' && (
        <Form.Item
          name="mileage"
          label="Kilometr (km)"
          rules={[{ required: true, message: "Iltimos, Kilometr kiriting!" }]}
        >
          <InputNumber
            min={1000}
            max={500000}
            style={{ width: '100%' }}
            placeholder="Mashina necha km yurgani"
          />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          Xizmat qo`shish
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StandardServiceForm;
