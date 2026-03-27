import React, { useEffect, useState } from 'react';
import { Form, Button, Select, InputNumber, DatePicker, message, Tag } from 'antd';
import { BalonFurgonType } from '../../types/maintenance';
import dayjs from 'dayjs';
import axiosInstance from '@/api/axiosInstance';
import { useCurrencies } from '@/modules/accounting/hooks/useCurrencies';
import { CarOutlined } from '@ant-design/icons';

interface BalonFurgonFormProps {
  initialValues?: BalonFurgonType;
  onFinish: (values: BalonFurgonType) => void;
  onCancel?: () => void;
  furgons: { id: number; name: string; number?: string }[]; // Furgon data
  loading?: boolean;
}

interface BalonTypeOption {
  value: string;
  label: string;
}

const BalonFurgonForm: React.FC<BalonFurgonFormProps> = ({
  initialValues,
  onFinish,
  onCancel,
  furgons,
  loading
}) => {
  const [form] = Form.useForm();
  const [balonTypes, setBalonTypes] = useState<BalonTypeOption[]>([
    { value: 'standart', label: 'Standart' },
    { value: 'qishki', label: 'Qishki' },
    { value: 'yozgi', label: 'Yozgi' },
    { value: 'universal', label: 'Universal' },
  ]);
  const [typesLoading, setTypesLoading] = useState(false);
  const { currencies, loading: currenciesLoading } = useCurrencies();

  // Fetch balon types from backend
  useEffect(() => {
    const fetchBalonTypes = async () => {
      setTypesLoading(true);
      try {
        // This endpoint should return available balon types
        const response = await axiosInstance.get('/balonfurgon/types/');
        
        if (Array.isArray(response.data)) {
          // If backend returns an array of strings ["standart", "qishki", "yozgi", "universal"]
          const types = response.data.map((type: string) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1) // Capitalize first letter
          }));
          setBalonTypes(types);
        }
      } catch (error) {
        console.error('Error fetching balon types:', error);
        // Keep default values, no need to show error message
      } finally {
        setTypesLoading(false);
      }
    };

    fetchBalonTypes();
  }, []);

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

  // Fix any type with a proper interface
  interface FormValues {
    furgon: number | null;
    type: string | null;
    price: number | null;
    kilometr: number | null;
    count: number | null;
    currency: number | null;
    custom_rate_to_uzs: number | null;
    created_at?: dayjs.Dayjs;
  }

  const handleFinish = (values: FormValues) => {
    onFinish({
      ...values,
      custom_rate_to_uzs: values.custom_rate_to_uzs?.toString(),
      created_at: values.created_at ? values.created_at.format('YYYY-MM-DDTHH:mm:ss.SSSZ') : undefined
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        price: null,
        furgon: null,
        type: 'qishki',
        kilometr: null,
        count: 1,
        currency: currencies?.length > 0 ? currencies[0].id : undefined,
        custom_rate_to_uzs: currencies?.length > 0 ? parseFloat(currencies[0].rate_to_uzs) : null,
        created_at: dayjs()
      }}
    >
      <Form.Item
        name="furgon"
        label="Furgon"
        rules={[{ required: true, message: 'Iltimos, furgonni tanlang' }]}
      >
        <Select placeholder="Furgonni tanlang">
          {furgons.map(furgon => (
            <Select.Option key={furgon.id} value={furgon.id}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CarOutlined style={{ color: '#faad14', fontSize: 16 }} />
                <span style={{ fontWeight: 500 }}>{furgon.name}</span>
                {furgon.number && (
                  <Tag color="blue" style={{ marginLeft: 4 }}>{furgon.number}</Tag>
                )}
              </span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="type"
        label="Balon turi"
        rules={[{ required: true, message: 'Iltimos, balon turini tanlang' }]}
      >
        <Select 
          placeholder="Balon turini tanlang" 
          loading={typesLoading}
        >
          {balonTypes.map(type => (
            <Select.Option key={type.value} value={type.value}>
              {type.label}
            </Select.Option>
          ))}
        </Select>
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

export default BalonFurgonForm; 