import React, { useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, DatePicker, Tag } from 'antd';
import { OptolType } from '../../types/maintenance';
import dayjs from 'dayjs';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';
import { CarOutlined } from '@ant-design/icons';

interface OptolFormProps {
  initialValues?: OptolType;
  onFinish: (values: OptolType) => void;
  onCancel?: () => void;
  cars: { id: number; name: string; car_number: string }[]; // Assuming you have car data
  loading?: boolean;
}

const OptolForm: React.FC<OptolFormProps> = ({ 
  initialValues, 
  onFinish, 
  onCancel, 
  cars, 
  loading 
}) => {
  const [form] = Form.useForm();
  const { currencies, loading: currenciesLoading } = useCurrencies();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        created_at: initialValues.created_at ? dayjs(initialValues.created_at) : undefined
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onFinish({
      ...values,
      custom_rate_to_uzs: values.custom_rate_to_uzs,
      created_at: values.created_at ? values.created_at.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : undefined
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ 
        price: 0,
        car: null,
        type: null,
        kilometr: null,
        count: 1,
        currency: currencies?.length > 0 ? currencies[0].id : undefined,
        custom_rate_to_uzs: currencies?.length > 0 ? currencies[0].rate_to_uzs : null,
        created_at: dayjs()
      }}
    >
      <Form.Item
        name="car"
        label="Avtomobil"
        rules={[{ required: true, message: 'Iltimos, avtomobilni tanlang' }]}
      >
        <Select placeholder="Avtomobilni tanlang">
          {cars.map(car => (
            <Select.Option key={car.id} value={car.id}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CarOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                <span style={{ fontWeight: 500 }}>{car.name}</span>
                <Tag color="blue" style={{ marginLeft: 4 }}>{car.car_number}</Tag>
              </span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="type"
        label="Moy turi"
      >
        <Input placeholder="Moy turi" />
      </Form.Item>

      <Form.Item
        name="price"
        label="Narx"
        rules={[{ required: true, message: 'Iltimos, narxni kiriting' }]}
      >
        <InputNumber 
          style={{ width: '100%' }} 
          placeholder="Narx" 
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value!.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="currency"
        label="Valyuta"
        rules={[{ required: true, message: 'Iltimos, valyutani tanlang!' }]}
      >
        <Select 
          placeholder="Valyutani tanlang" 
          loading={currenciesLoading}
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
            <Select.Option key={currency.id} value={currency.id}>
              {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
            </Select.Option>
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

      <Form.Item
        name="kilometr"
        label="Kilometr"
      >
        <InputNumber 
          style={{ width: '100%' }} 
          placeholder="Kilometr" 
        />
      </Form.Item>

      <Form.Item
        name="count"
        label="Soni"
      >
        <InputNumber 
          min={1}
          style={{ width: '100%' }} 
          placeholder="Soni" 
        />
      </Form.Item>

      <Form.Item 
        name="created_at" 
        label="Sana"
        rules={[{ required: true, message: 'Iltimos, sanani kiriting' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          showTime 
          format="YYYY-MM-DD HH:mm:ss" 
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {initialValues ? 'Saqlash' : 'Qo\'shish'}
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>
            Bekor qilish
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default OptolForm;
