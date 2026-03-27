import React from 'react';
import { Form, Select, Input, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface VehicleFilterFormProps {
  onSearch: (value: string) => void;
  onFilterByStatus: (status: string | null) => void;
  onFilterByType: (type: string | null) => void;
  onReset: () => void;
  loading?: boolean;
}

export const VehicleFilterForm: React.FC<VehicleFilterFormProps> = ({
  onSearch,
  onFilterByStatus,
  onFilterByType,
  onReset,
  loading = false
}) => {
  const [form] = Form.useForm();
  
  const statusOptions = [
    { value: 'active', label: 'Reysda' },
    { value: 'waiting', label: 'Kutmoqda' },
    { value: 'inactive', label: 'Nofaol' },
  ];
  
  const typeOptions = [
    { value: 'car', label: 'Avtomobil' },
    { value: 'furgon', label: 'Furgon' },
  ];
  
  const handleReset = () => {
    form.resetFields();
    onReset();
  };
  
  return (
    <Form form={form} layout="inline" className="vehicle-filter-form">
      <Form.Item name="search">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          onChange={e => onSearch(e.target.value)}
          allowClear
          style={{ width: 200 }}
        />
      </Form.Item>
      
      <Form.Item name="status">
        <Select
          placeholder="Status"
          style={{ width: 150 }}
          onChange={onFilterByStatus}
          allowClear
        >
          {statusOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item name="type">
        <Select
          placeholder="Transport turi"
          style={{ width: 150 }}
          onChange={onFilterByType}
          allowClear
        >
          {typeOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item>
        <Space>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            loading={loading}
          >
            Filter
          </Button>
          <Button
            onClick={handleReset}
            icon={<ReloadOutlined />}
          >
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default VehicleFilterForm; 