import React from 'react';
import { Row, Col, Input, Select, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface DriversTableFiltersProps {
  searchText: string;
  statusFilter: string | undefined;
  onSearch: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onAddDriver: () => void;
}

const DriversTableFilters: React.FC<DriversTableFiltersProps> = ({
  searchText,
  statusFilter,
  onSearch,
  onStatusChange,
  onAddDriver,
}) => {
  return (
    <Row gutter={[16, 16]} className="filter-row">
      <Col xs={24} sm={24} md={10} lg={10}>
        <Input
          placeholder="Ism, telefon yoki holat bo'yicha qidirish (kutishda/yo'lda)..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Select
          placeholder="Status bo'yicha filtrlash"
          style={{ width: '100%' }}
          allowClear
          value={statusFilter}
          onChange={onStatusChange}
        >
          <Option value="driver">Haydovchi</Option>
          <Option value="on_trip">Yo'lda</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={6} lg={6}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddDriver}
          block
        >
          Yangi haydovchi qo'shish
        </Button>
      </Col>
    </Row>
  );
};

export default DriversTableFilters; 