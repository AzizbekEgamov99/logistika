import React from 'react';
import { Row, Col, Input, DatePicker, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TripFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
  dateRange: any;
  setDateRange: (range: any) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  vehicleFilter: string;
  setVehicleFilter: (filter: string) => void;
}

export const TripFilters: React.FC<TripFiltersProps> = ({
  searchText,
  setSearchText,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  vehicleFilter,
  setVehicleFilter,
}) => {
  return (
    <Row gutter={[16, 16]} className="filters-container">
      <Col xs={24} sm={24} md={6}>
        <Input
          placeholder="Haydovchi, mijoz, transport va boshqalar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Col>
      <Col xs={24} sm={24} md={6}>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          style={{ width: '100%' }}
          placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
        />
      </Col>
      <Col xs={12} sm={12} md={4}>
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: '100%' }}
          placeholder="Holati"
          prefix={<FilterOutlined />}
        >
          <Option value="completed">Yakunlangan</Option>
          <Option value="in_progress">Jarayonda</Option>
          <Option value="scheduled">Rejalashtirilgan</Option>
          <Option value="cancelled">Bekor qilingan</Option>
        </Select>
      </Col>
      <Col xs={12} sm={12} md={4}>
        <Select
          value={vehicleFilter}
          onChange={(value) => setVehicleFilter(value)}
          style={{ width: '100%' }}
          placeholder="Transport turi"
        >
          <Option value="Truck">Yuk mashinasi</Option>
          <Option value="Furgon">Furgon</Option>
        </Select>
      </Col>

      <Col xs={24} sm={24} md={4}>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          style={{ width: '100%' }}
        >
          Filtrlash
        </Button>
      </Col>
    </Row>
  );
}; 