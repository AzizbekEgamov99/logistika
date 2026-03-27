import React from 'react';
import { Input, Select, Row, Col, Form } from 'antd';
import { SearchOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

interface FleetFiltersProps {
  drivers: any[];
  currentFilters: {
    status: string;
    driver: string;
    searchTerm: string;
  };
  onFilterChange: (filters: any) => void;
}

export const FleetFilters: React.FC<FleetFiltersProps> = ({ 
  drivers, 
  currentFilters, 
  onFilterChange 
}) => {
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      status: value
    });
  };

  const handleDriverChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      driver: value
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...currentFilters,
      searchTerm: e.target.value
    });
  };

  return (
    <Form layout="vertical">
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} sm={8}>
          <Form.Item label={<span><SearchOutlined /> Qidirish</span>}>
            <Input
              placeholder="Transport nomini kiriting..."
              value={currentFilters.searchTerm}
              onChange={handleSearchChange}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item label={<span><FilterOutlined /> Holati bo'yicha</span>}>
            <Select
              value={currentFilters.status}
              onChange={handleStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="all">Barchasi</Option>
              <Option value="active">Faol qatnovda</Option>
              <Option value="available">Mavjud</Option>
              <Option value="maintenance">Ta'mirda</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item label={<span><UserOutlined /> Haydovchi bo'yicha</span>}>
            <Select
              value={currentFilters.driver}
              onChange={handleDriverChange}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              <Option value="all">Barcha haydovchilar</Option>
              {drivers.map(driver => (
                <Option key={driver.id} value={driver.id}>
                  {driver.fullname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}; 