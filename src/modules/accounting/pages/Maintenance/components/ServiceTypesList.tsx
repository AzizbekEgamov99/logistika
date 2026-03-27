import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tabs, 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Spin, 
  Empty, 
  Alert,
  Button,
  Tooltip,
  DatePicker,
  Statistic
} from 'antd';
import { 
  ReloadOutlined, 
  ToolOutlined, 
  CarOutlined, 
  ExperimentOutlined,
  SettingOutlined,
  TruckOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { cashApi } from '../../../api/cash/cashApi';
import { formatMoney } from '@/utils/format';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
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

const ServiceTypesList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cashApi.getServiceTotalsWithDate();
      setServiceData(data);
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

  // Filter services by type
  const getServicesByType = (type: string) => {
    return serviceData.all_expenses.filter(service => service.type === type);
  };

  const tehnicalServices = getServicesByType('Техобслуживание');
  const balonServices = getServicesByType('Балон');
  const balonFurgonServices = getServicesByType('Балон Фургон');
  const optolServices = getServicesByType('Масло');
  const otherServices = serviceData.all_expenses.filter(service => 
    !['Техобслуживание', 'Балон', 'Балон Фургон', 'Масло'].includes(service.type)
  );

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
        
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
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

  const renderSummary = () => {
    const { totals_usd } = serviceData;
    
    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap size="large">
          <Statistic 
            title={<Space><ToolOutlined /> Umumiy</Space>}
            value={formatMoney(totals_usd.total)}
            suffix="USD"
            valueStyle={{ color: '#1677ff' }}
          />
          <Statistic 
            title={<Space><SettingOutlined /> Texnik xizmat</Space>}
            value={formatMoney(totals_usd.texnic)}
            suffix="USD"
            valueStyle={{ color: '#52c41a' }}
          />
          <Statistic 
            title={<Space><CarOutlined /> Balon</Space>}
            value={formatMoney(totals_usd.balon)}
            suffix="USD"
            valueStyle={{ color: '#faad14' }}
          />
          <Statistic 
            title={<Space><TruckOutlined /> Balon Furgon</Space>}
            value={formatMoney(totals_usd.balon_furgon)}
            suffix="USD"
            valueStyle={{ color: '#722ed1' }}
          />
          <Statistic 
            title={<Space><ExperimentOutlined /> Moy</Space>}
            value={formatMoney(totals_usd.optol)}
            suffix="USD"
            valueStyle={{ color: '#eb2f96' }}
          />
        </Space>
      </Card>
    );
  };

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
      {serviceData.all_expenses.length > 0 && renderSummary()}
      
      <Tabs defaultActiveKey="all">
        <TabPane
          tab={
            <span>
              <ToolOutlined /> Barcha xizmatlar
            </span>
          }
          key="all"
        >
          <Table
            dataSource={serviceData.all_expenses}
            columns={serviceColumns}
            rowKey={(record) => `${record.car}-${record.created_at}`}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SettingOutlined /> Texnik xizmatlar
            </span>
          }
          key="tehnical"
        >
          <Table
            dataSource={tehnicalServices}
            columns={serviceColumns}
            rowKey={(record) => `${record.car}-${record.created_at}`}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <CarOutlined /> Balon xizmatlar
            </span>
          }
          key="balon"
        >
          <Table
            dataSource={balonServices}
            columns={serviceColumns}
            rowKey={(record) => `${record.car}-${record.created_at}`}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TruckOutlined /> Furgon Balon xizmatlar
            </span>
          }
          key="balonfurgon"
        >
          <Table
            dataSource={balonFurgonServices}
            columns={serviceColumns}
            rowKey={(record) => `${record.car}-${record.created_at}`}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ExperimentOutlined /> Moy xizmatlari
            </span>
          }
          key="optol"
        >
          <Table
            dataSource={optolServices}
            columns={serviceColumns}
            rowKey={(record) => `${record.car}-${record.created_at}`}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
          />
        </TabPane>
        {otherServices.length > 0 && (
          <TabPane
            tab={
              <span>
                <ToolOutlined /> Boshqa xizmatlar
              </span>
            }
            key="other"
          >
            <Table
              dataSource={otherServices}
              columns={serviceColumns}
              rowKey={(record) => `${record.car}-${record.created_at}`}
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: <Empty description="Ma'lumotlar topilmadi" /> }}
            />
          </TabPane>
        )}
      </Tabs>
    </Card>
  );
};

export default ServiceTypesList; 