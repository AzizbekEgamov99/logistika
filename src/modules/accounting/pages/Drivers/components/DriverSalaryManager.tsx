'use client';
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Typography, 
  Space, 
  Popconfirm,
  DatePicker,
  Row,
  Col,
  Statistic,
  Spin,
  Empty,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  DollarOutlined,
  CalendarOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { useDriverSalaries } from '../../../hooks/useDriverSalary';
import { useDrivers } from '../../../hooks/useDrivers';
import dayjs from 'dayjs';
import { DriverSalaryCreate } from '../../../types/driverSalary';

const {  Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DriverSalaryManagerProps {
  driverId?: number; // Optional: to filter by specific driver
}

const DriverSalaryManager: React.FC<DriverSalaryManagerProps> = ({ driverId }) => {
  // State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [form] = Form.useForm();
  const { 
    driverSalaries, 
    total, 
    loading, 
    filters, 
    setFilters, 
    createDriverSalary, 
    deleteDriverSalary 
  } = useDriverSalaries({
    driver: driverId,
    page: 1,
    pageSize: 10
  });

  const { drivers } = useDrivers();

  useEffect(() => {
    if (driverId) {
      setFilters(prev => ({ ...prev, driver: driverId }));
    }
  }, [driverId, setFilters]);

  const showAddModal = () => {
    form.resetFields();
    if (driverId) {
      form.setFieldsValue({ driver: driverId });
    }
    setIsModalVisible(true);
  };

  // Handle date range change
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setFilters({
        ...filters,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
        page: 1
      });
    } else {
      // Clear date filters
      const newFilters = { ...filters };
      delete newFilters.start_date;
      delete newFilters.end_date;
      setFilters(newFilters);
    }
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues: DriverSalaryCreate = {
        driver: values.driver,
        amount: values.amount.toString(),
        currency: values.currency,
        title: values.title || 'To\'lov',
        comment: values.comment || ''
      };
      
      await createDriverSalary(formattedValues);
      
      setIsModalVisible(false);
      message.success('To\'lov muvaffaqiyatli saqlandi');
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('Ma\'lumotlarni saqlashda xatolik yuz berdi');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteDriverSalary(id);
      message.success('To\'lov muvaffaqiyatli o\'chirildi');
    } catch {
      message.error('To\'lovni o\'chirishda xatolik');
    }
  };

  const totalAmount = driverSalaries.reduce((sum, salary) => sum + Number(salary.amount), 0);

  const columns = [
    {
      title: 'Haydovchi',
      dataIndex: 'driver',
      key: 'driver',
      width: '25%',
      render: (driverId: number) => {
        const driver = drivers.find(d => d.id === driverId);
        return driver ? (
          <span style={{ fontWeight: 500 }}>{driver.first_name} {driver.last_name}</span>
        ) : `ID: ${driverId}`;
      }
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      render: (amount: number, record: any) => (
        <Text strong style={{ color: '#1890ff' }}>
          {new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: record.currency,
            minimumFractionDigits: 0
          }).format(amount)}
        </Text>
      )
    },
    {
      title: 'Sana',
      dataIndex: 'paid_at',
      key: 'paid_at',
      width: '20%',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
      sorter: (a: any, b: any) => new Date(a.paid_at).getTime() - new Date(b.paid_at).getTime()
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: '10%',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="O'chirish">
            <Popconfirm
              title="To'lovni o'chirishni xohlaysizmi?"
              onConfirm={() => handleDelete(record.id)}
              okText="Ha"
              cancelText="Yo'q"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="driver-salary-manager">
      <Spin spinning={loading}>
        <Row gutter={[24, 24]} className="salary-stats-row">
          <Col xs={24} sm={12}>
            <Card className="summary-card">
              <Statistic
                title="Jami to'lovlar soni"
                value={driverSalaries.length}
                prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="summary-card">
              <Statistic
                title="Jami to'langan summa"
                value={totalAmount}
                precision={0}
                prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
                suffix="UZS"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={16}>
            <Card className="filter-card">
              <Text strong>Sana bo`yicha filtrlash:</Text>
              <RangePicker 
                style={{ width: '100%', marginTop: 8 }}
                onChange={handleDateRangeChange as any}
                format="DD.MM.YYYY"
              />
              
              {!driverId && (
                <div style={{ marginTop: 16 }}>
                  <Text strong>Haydovchi bo`yicha filtrlash:</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Haydovchini tanlang"
                    allowClear
                    onChange={(value) => setFilters({ ...filters, driver: value, page: 1 })}
                  >
                    {drivers.map(driver => (
                      <Option key={driver.id} value={driver.id}>
                        {driver.first_name} {driver.last_name}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="action-card" style={{ height: '100%' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={showAddModal}
                block
                size="large"
                style={{ marginBottom: 10, height: 50 }}
              >
                Yangi to`lov qo`shish
              </Button>
              <Button 
                icon={<ExportOutlined />} 
                block
              >
                Hisobotni yuklab olish
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card>
          {driverSalaries.length > 0 ? (
            <Table
              columns={columns}
              dataSource={driverSalaries}
              rowKey="id"
              pagination={{
                total,
                current: filters.page,
                pageSize: filters.pageSize,
                onChange: (page, pageSize) => {
                  setFilters({ ...filters, page, pageSize });
                },
                showSizeChanger: true,
                showTotal: (total) => `Jami: ${total} ta to'lov`
              }}
              bordered={false}
              size="middle"
            />
          ) : (
            <Empty 
              description={loading ? "Ma'lumotlar yuklanmoqda..." : "To'lovlar mavjud emas"} 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      </Spin>

      {/* Modal for adding salary */}
      <Modal
        title="Yangi to'lov qo'shish"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        forceRender={true}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Bekor qilish
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            Saqlash
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="driverSalaryForm"
        >
          {!driverId && (
            <Form.Item
              name="driver"
              label="Haydovchi"
              rules={[{ required: true, message: 'Iltimos, haydovchini tanlang' }]}
            >
              <Select
                placeholder="Haydovchini tanlang"
                showSearch
                optionFilterProp="children"
              >
                {drivers.map(driver => (
                  <Option key={driver.id} value={driver.id}>
                    {driver.first_name} {driver.last_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="amount"
            label="To'lov miqdori"
            rules={[{ required: true, message: 'Iltimos, to\'lov miqdorini kiriting' }]}
          >
            <Input
              style={{ width: '100%' }}
              placeholder="Miqdorni kiriting"
              prefix={<DollarOutlined />}
              suffix={form.getFieldValue('currency') || 'UZS'}
              type="number"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Valyuta"
            initialValue="UZS"
            rules={[{ required: true, message: 'Iltimos, valyutani tanlang' }]}
          >
            <Select placeholder="Valyutani tanlang">
              <Option value="UZS">UZS</Option>
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="To'lov nomi"
            initialValue="To'lov"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Izoh"
            initialValue=""
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DriverSalaryManager; 