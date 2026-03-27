import React from 'react';
import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { FilterValues, StatusOption, VehicleTypeOption } from '../types';

interface FilterFormProps {
  onFilter: (values: FilterValues) => void;
  statusOptions: StatusOption[];
  vehicleTypeOptions: VehicleTypeOption[];
  loading: boolean;
}

const FilterForm: React.FC<FilterFormProps> = ({
  onFilter,
  statusOptions,
  vehicleTypeOptions,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFilter}
      className="mb-4"
    >
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="search">
            <Input 
              placeholder="Qidirish..." 
              suffix={<SearchOutlined />} 
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status">
            <Select
              placeholder="Status bo'yicha"
              allowClear
              options={statusOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="vehicleType">
            <Select
              placeholder="Transport turi bo'yicha"
              allowClear
              options={vehicleTypeOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
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
        </Col>
      </Row>
    </Form>
  );
};

export default FilterForm; 