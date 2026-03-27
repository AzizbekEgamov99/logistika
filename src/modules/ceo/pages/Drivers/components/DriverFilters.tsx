import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Slider, Space, Divider, Typography, Collapse } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined, 
  CarOutlined, 
  UserOutlined, 
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { DriverFilter } from '../../../../accounting/types/driver';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Panel } = Collapse;

interface DriverFiltersProps {
  onFilterChange: (filters: Partial<DriverFilter>) => void;
  initialFilters: Partial<DriverFilter>;
  loading?: boolean;
}

const DriverFilters: React.FC<DriverFiltersProps> = ({ 
  onFilterChange, 
  initialFilters, 
  loading = false 
}) => {
  const [form] = Form.useForm();
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Handle form submission
  const handleFinish = (values: any) => {
    // Transform values to match the filter structure
    const filters: Partial<DriverFilter> = {
      search: values.search,
      status: values.status === 'all' ? 'all' : values.status,
      is_busy: values.is_busy === 'all' ? undefined : 
               values.is_busy === 'true' ? true : 
               values.is_busy === 'false' ? false : undefined,
      page: 1, // Reset to first page on filter change
      pageSize: initialFilters.pageSize || 10
    };
    
    onFilterChange(filters);
  };
  
  // Reset all filters
  const handleReset = () => {
    form.resetFields();
    onFilterChange({
      search: '',
      status: 'all',
      is_busy: undefined,
      page: 1,
      pageSize: initialFilters.pageSize || 10
    });
  };
  
  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };
  
  return (
    <Card className="driver-filters" size="small">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          search: initialFilters.search || '',
          status: initialFilters.status || 'all',
          is_busy: initialFilters.is_busy === undefined ? 'all' : 
                  initialFilters.is_busy ? 'true' : 'false'
        }}
      >
        {/* Basic filters row */}
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={8} lg={8}>
            <Form.Item name="search" label="Qidirish">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Ism yoki telefon raqami..." 
                allowClear
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Barcha statuslar">
                <Option value="all">Barchasi</Option>
                <Option value="driver">Haydovchi</Option>
                <Option value="Owner">Egasi</Option>
                <Option value="CEO">CEO</Option>
                <Option value="Bugalter">Bugalter</Option>
                <Option value="Zaphos">Zaphos</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item name="is_busy" label="Holati">
              <Select placeholder="Holatni tanlang">
                <Option value="all">Barchasi</Option>
                <Option value="true">Yo'lda</Option>
                <Option value="false">Kutishda</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={4} lg={6}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<FilterOutlined />}
                loading={loading}
              >
                Filtrlash
              </Button>
              <Button 
                onClick={handleReset} 
                icon={<ClearOutlined />}
                disabled={loading}
              >
                Tozalash
              </Button>
            </Space>
          </Col>
        </Row>
        
        {/* Advanced filters - collapsible */}
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <FilterOutlined rotate={isActive ? 90 : 0} />
          )}
          activeKey={advancedMode ? ['1'] : []}
          onChange={() => toggleAdvancedMode()}
          style={{ marginTop: 8, background: 'transparent' }}
        >
          <Panel header="Qo'shimcha filtrlar" key="1">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="salary_range" label="Maosh diapazoni">
                  <Slider
                    range
                    min={0}
                    max={5000}
                    marks={{ 0: '0$', 2500: '2500$', 5000: '5000$' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="trips_range" label="Reyslar soni">
                  <Slider
                    range
                    min={0}
                    max={50}
                    marks={{ 0: '0', 25: '25', 50: '50' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="joined_date" label="Qo'shilgan sana">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="license_expire" label="Guvohnoma muddati">
                  <Select placeholder="Muddatni tanlang">
                    <Option value="all">Barchasi</Option>
                    <Option value="valid">Faol</Option>
                    <Option value="expired">Muddati tugagan</Option>
                    <Option value="expiring_soon">Tez orada tugaydi</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Form>
    </Card>
  );
};

export default DriverFilters; 