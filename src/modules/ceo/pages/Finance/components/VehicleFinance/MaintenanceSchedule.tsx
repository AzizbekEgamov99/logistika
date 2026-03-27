import React, { useState } from 'react';
import { Card, Table, Tag, Button, Typography, Row, Col, Select, Calendar, Badge, Modal, Form, Input, DatePicker, InputNumber, Space } from 'antd';
import { ToolOutlined, PlusOutlined, CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { Vehicle, VehicleService } from './VehicleFinance';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export interface MaintenanceScheduleProps {
  vehicles: Vehicle[];
  services: VehicleService[];
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ vehicles, services }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get filtered services
  const getFilteredServices = (): VehicleService[] => {
    return services.filter(service => 
      selectedVehicleId === 'all' || service.vehicleId === selectedVehicleId
    );
  };

  // Get service type translation
  const getServiceTypeTranslation = (type: string): string => {
    switch (type) {
      case 'maintenance':
        return 'Texnik xizmat';
      case 'repair':
        return 'Ta\'mirlash';
      case 'inspection':
        return 'Ko\'rik';
      default:
        return type;
    }
  };

  // Get service type color
  const getServiceTypeColor = (type: string): string => {
    switch (type) {
      case 'maintenance':
        return 'blue';
      case 'repair':
        return 'red';
      case 'inspection':
        return 'green';
      default:
        return 'default';
    }
  };

  // Show modal to add new service
  const showAddServiceModal = () => {
    form.resetFields();
    
    // Set default values if a vehicle is selected
    if (selectedVehicleId !== 'all') {
      form.setFieldsValue({ vehicleId: selectedVehicleId });
    }
    
    setIsModalVisible(true);
  };

  // Handle adding a new service
  const handleAddService = (values: any) => {
    console.log('New Service:', values);
    // In a real app, this would add to the database
    setIsModalVisible(false);
    form.resetFields();
  };

  // Table columns for services
  const serviceColumns = [
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => date.toLocaleDateString(),
      sorter: (a: VehicleService, b: VehicleService) => a.date.getTime() - b.date.getTime(),
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: 'Transport',
      key: 'vehicle',
      render: (text: string, record: VehicleService) => {
        const vehicle = vehicles.find(v => v.id === record.vehicleId);
        return vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : 'Unknown';
      },
    },
    {
      title: 'Xizmat turi',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getServiceTypeColor(type)}>
          {getServiceTypeTranslation(type)}
        </Tag>
      ),
      filters: [
        { text: 'Texnik xizmat', value: 'maintenance' },
        { text: 'Ta\'mirlash', value: 'repair' },
        { text: 'Ko\'rik', value: 'inspection' },
      ],
      onFilter: (value: string, record: VehicleService) => record.type === value,
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Xizmat ko\'rsatuvchi',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Qiymat',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => formatCurrency(cost),
      sorter: (a: VehicleService, b: VehicleService) => a.cost - b.cost,
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (text: string, record: VehicleService) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            onClick={() => console.log('View details', record)}
          >
            Batafsil
          </Button>
        </Space>
      ),
    },
  ];

  // Get data for calendar
  const getCalendarData = (value: dayjs.Dayjs) => {
    const date = value.toDate();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const matchingServices = services.filter(service => {
      const serviceDate = service.date;
      return serviceDate.getDate() === day && 
             serviceDate.getMonth() === month && 
             serviceDate.getFullYear() === year &&
             (selectedVehicleId === 'all' || service.vehicleId === selectedVehicleId);
    });
    
    return matchingServices;
  };

  // Calendar cell renderer
  const dateCellRender = (value: dayjs.Dayjs) => {
    const services = getCalendarData(value);
    
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {services.map(service => (
          <li key={service.id} style={{ marginBottom: 2 }}>
            <Badge 
              color={getServiceTypeColor(service.type)} 
              text={
                <Text style={{ fontSize: '12px' }}>
                  {getServiceTypeTranslation(service.type)} - {
                    vehicles.find(v => v.id === service.vehicleId)?.name || 'Unknown'
                  }
                </Text>
              } 
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="maintenance-schedule">
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Title level={4}>Texnik Xizmat Jadvali</Title>
          <Text type="secondary">
            Transport vositalariga ko'rsatilgan xizmatlar jadvali
          </Text>
        </Col>
        <Col>
          <Space>
            <Button
              icon={viewMode === 'list' ? <CalendarOutlined /> : <UnorderedListOutlined />}
              onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            >
              {viewMode === 'list' ? 'Kalendar ko\'rinishi' : 'Ro\'yxat ko\'rinishi'}
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddServiceModal}
            >
              Xizmat qo'shish
            </Button>
          </Space>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Select
            style={{ width: 300 }}
            value={selectedVehicleId}
            onChange={setSelectedVehicleId}
          >
            <Option value="all">Barcha transportlar</Option>
            {vehicles.map(vehicle => (
              <Option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} ({vehicle.licensePlate})
              </Option>
            ))}
          </Select>
        </div>
        
        {viewMode === 'list' ? (
          <Table
            columns={serviceColumns}
            dataSource={getFilteredServices()}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />
        ) : (
          <Calendar dateCellRender={dateCellRender} />
        )}
      </Card>
      
      {/* Add Service Modal */}
      <Modal
        title="Yangi Xizmat Qo'shish"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddService}
          initialValues={{
            type: 'maintenance',
            date: null,
            cost: null,
          }}
        >
          <Form.Item
            name="vehicleId"
            label="Transport"
            rules={[{ required: true, message: 'Iltimos, transportni tanlang' }]}
          >
            <Select placeholder="Transport tanlang">
              {vehicles.map(vehicle => (
                <Option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Xizmat turi"
            rules={[{ required: true, message: 'Iltimos, xizmat turini tanlang' }]}
          >
            <Select>
              <Option value="maintenance">Texnik xizmat</Option>
              <Option value="repair">Ta'mirlash</Option>
              <Option value="inspection">Ko'rik</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Sana"
            rules={[{ required: true, message: 'Iltimos, sanani tanlang' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: 'Iltimos, tavsifni kiriting' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="provider"
            label="Xizmat ko'rsatuvchi"
            rules={[{ required: true, message: 'Iltimos, xizmat ko\'rsatuvchini kiriting' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="cost"
            label="Qiymat ($)"
            rules={[{ required: true, message: 'Iltimos, qiymatni kiriting' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Izohlar"
          >
            <TextArea rows={2} />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setIsModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceSchedule; 