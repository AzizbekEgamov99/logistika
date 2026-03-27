import React, { useState } from 'react';
import { Input, DatePicker, Button, Card, Row, Col, Select, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TripSearchProps {
  onSearch: (values: {
    searchText: string;
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
    status: string;
  }) => void;
  onReset: () => void;
  loading: boolean;
}

const TripSearch: React.FC<TripSearchProps> = ({ onSearch, onReset, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [status, setStatus] = useState<string>('all');

  const handleSearch = () => {
    onSearch({
      searchText,
      dateRange,
      status,
    });
  };

  const handleReset = () => {
    setSearchText('');
    setDateRange(null);
    setStatus('all');
    onReset();
  };

  return (
    <Card style={{ marginBottom: '1rem' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={8}>
          <Input
            placeholder="Qidiruv (ID, haydovchi, mijoz, avtomobil...)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={handleSearch}
          />
        </Col>
        
        <Col xs={24} md={8}>
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            placeholder={['Boshlanish', 'Tugash']}
            format="DD.MM.YYYY"
          />
        </Col>
        
        <Col xs={24} md={8}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleSearch}
                loading={loading}
              >
                Qidirish
              </Button>
              
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                disabled={loading}
              >
                Tozalash
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default TripSearch; 