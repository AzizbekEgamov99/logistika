import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Spin, 
  Empty, 
  Alert,
  Button,
  Tooltip,
  DatePicker
} from 'antd';
import { 
  ReloadOutlined, 
  ToolOutlined, 
  CarOutlined, 
  ExperimentOutlined,
  SettingOutlined,
  TruckOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { cashApi } from '../../../api/cash/cashApi';
import { formatMoney } from '@/utils/format';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ServiceData {
  type: string;
  price: number;
  currency: string;
  usd_value: number;
  car: number;
  car_name: string;
  kilometer: number;
  created_at: string;
}

const SimpleServiceList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [serviceData, setServiceData] = useState<{
    all_expenses: ServiceData[];
    totals_usd: {
      texnic: number;
      balon: number;
      balon_furgon: number;
      chiqimlik: number;
      optol: number;
      total: number;
    };
  }>({
    all_expenses: [],
    totals_usd: {
      texnic: 0,
      balon: 0,
      balon_furgon: 0,
      chiqimlik: 0,
      optol: 0,
      total: 0
    }
  });
  const [allServiceData, setAllServiceData] = useState<ServiceData[]>([]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cashApi.getServiceTotalsWithDate();
      setServiceData(data);
      setAllServiceData(data.all_expenses);
      console.log('Fetched service data:', data);
    } catch (err) {
      console.error('Error fetching service data:', err);
      setError('Xizmat ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

  // Filter data by date range
  useEffect(() => {
    if (!allServiceData.length) return;
    
    const [startDate, endDate] = dateRange;
    
    if (!startDate && !endDate) {
      // If no date range is selected, show all data
      setServiceData(prev => ({...prev, all_expenses: allServiceData}));
      return;
    }
    
    const filteredData = allServiceData.filter(service => {
      const serviceDate = dayjs(service.created_at);
      
      if (startDate && endDate) {
        // If both start and end dates are provided, check if the service date is between them
        return serviceDate.isAfter(startDate, 'day') && serviceDate.isBefore(endDate, 'day') || 
               serviceDate.isSame(startDate, 'day') || serviceDate.isSame(endDate, 'day');
      } else if (startDate) {
        // If only start date is provided, check if the service date is after or on the start date
        return serviceDate.isAfter(startDate, 'day') || serviceDate.isSame(startDate, 'day');
      } else if (endDate) {
        // If only end date is provided, check if the service date is before or on the end date
        return serviceDate.isBefore(endDate, 'day') || serviceDate.isSame(endDate, 'day');
      }
      
      return true;
    });
    
    setServiceData(prev => ({...prev, all_expenses: filteredData}));
  }, [dateRange, allServiceData]);

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates || [null, null]);
  };

  const serviceColumns = [
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: 'Xizmat turi',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          'Техобслуживание': 'blue',
          'Балон': 'green',
          'Балон Фургон': 'purple',
          'Масло': 'orange'
        };
        
        let icon = <ToolOutlined />;
        if (type === 'Техобслуживание') icon = <SettingOutlined />;
        else if (type === 'Балон') icon = <CarOutlined />;
        else if (type === 'Балон Фургон') icon = <TruckOutlined />;
        else if (type === 'Масло') icon = <ExperimentOutlined />;
        
        return (
          <Tag color={colorMap[type] || 'default'} icon={icon}>
            {type}
          </Tag>
        );
      }
    },
    {
      title: 'Mashina',
      dataIndex: 'car_name',
      key: 'car_name',
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (km: number) => km ? `${km.toLocaleString()} km` : '-'
    },
    {
      title: 'Narxi',
      key: 'price',
      render: (_, record: ServiceData) => (
        <Space direction="vertical" size="small">
          <Text>{formatMoney(record.price)} {record.currency}</Text>
          <Text type="secondary">(${formatMoney(record.usd_value)} USD)</Text>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginLeft: '16px' }}>Ma'lumotlar yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
        action={
          <Button type="primary" size="small" onClick={fetchServiceData}>
            Qayta urinish
          </Button>
        }
      />
    );
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <ToolOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
            <Title level={5} style={{ margin: 0 }}>Xizmatlar tarixi</Title>
          </Space>
          <Space>
            <Space>
              <CalendarOutlined />
              <RangePicker 
                onChange={handleDateRangeChange}
                format="DD.MM.YYYY"
                placeholder={['Boshlanish', 'Tugatish']}
                allowClear
              />
            </Space>
            <Tooltip title="Yangilash">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchServiceData}
                type="primary"
                size="small"
              />
            </Tooltip>
          </Space>
        </div>
      }
    >
      <Table
        dataSource={serviceData.all_expenses}
        columns={serviceColumns}
        rowKey={(record) => `${record.car}-${record.created_at}`}
        pagination={{ pageSize: 20 }}
        locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
      />
    </Card>
  );
};

export default SimpleServiceList; 