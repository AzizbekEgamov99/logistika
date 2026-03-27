'use client';
import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Divider, 
  Form, 
  Input, 
  Modal, 
  Table, 
  Switch, 
  Tooltip, 
  Space,
  Statistic
} from 'antd';
import { 
  BankOutlined, 
  CreditCardOutlined, 
  DollarOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface PaymentType {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  transactionCount: number;
  totalAmount: number;
}

interface PaymentStatistics {
  type: string;
  totalAmount: number;
  percentOfTotal: number;
  transactionCount: number;
}

const PaymentTypes: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPaymentType, setCurrentPaymentType] = useState<PaymentType | null>(null);
  const [form] = Form.useForm();

  // Mock data for payment types
  const paymentTypes: PaymentType[] = [
    {
      id: 1,
      name: 'Naqd pul',
      description: 'Naqd pul to\'lovlari',
      icon: <DollarOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
      isActive: true,
      transactionCount: 156,
      totalAmount: 45000000
    },
    {
      id: 2,
      name: 'Bank kartasi',
      description: 'Visa, Mastercard, UzCard orqali to\'lovlar',
      icon: <CreditCardOutlined style={{ fontSize: 36, color: '#1890ff' }} />,
      isActive: true,
      transactionCount: 203,
      totalAmount: 78000000
    },
    {
      id: 3,
      name: 'Bank o\'tkazmasi',
      description: 'Bank hisob raqami orqali to\'lovlar',
      icon: <BankOutlined style={{ fontSize: 36, color: '#722ed1' }} />,
      isActive: true,
      transactionCount: 87,
      totalAmount: 120000000
    }
  ];

  // Mock data for payment statistics
  const paymentStatistics: PaymentStatistics[] = [
    {
      type: 'Naqd pul',
      totalAmount: 45000000,
      percentOfTotal: 18.5,
      transactionCount: 156
    },
    {
      type: 'Bank kartasi',
      totalAmount: 78000000,
      percentOfTotal: 32.1,
      transactionCount: 203
    },
    {
      type: 'Bank o\'tkazmasi',
      totalAmount: 120000000,
      percentOfTotal: 49.4,
      transactionCount: 87
    }
  ];

  const handleAddPaymentType = () => {
    setIsEditMode(false);
    setCurrentPaymentType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPaymentType = (paymentType: PaymentType) => {
    setIsEditMode(true);
    setCurrentPaymentType(paymentType);
    form.setFieldsValue({
      name: paymentType.name,
      description: paymentType.description,
      isActive: paymentType.isActive
    });
    setIsModalVisible(true);
  };

  const handleDeletePaymentType = (id: number) => {
    Modal.confirm({
      title: 'To\'lov turini o\'chirish',
      content: 'Haqiqatan ham bu to\'lov turini o\'chirmoqchimisiz?',
      okText: 'Ha',
      cancelText: 'Yo\'q',
      onOk: () => {
        // Handle delete logic here
        console.log('Deleting payment type with id:', id);
      }
    });
  };

  const handleModalSubmit = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      // Here you would handle form submission to add/edit payment type
      setIsModalVisible(false);
    });
  };

  const columns: ColumnsType<PaymentStatistics> = [
    {
      title: 'To\'lov turi',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Umumiy summa',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString()} UZS`,
    },
    {
      title: 'Foiz',
      dataIndex: 'percentOfTotal',
      key: 'percentOfTotal',
      render: (percent: number) => `${percent}%`,
    },
    {
      title: 'Tranzaksiyalar soni',
      dataIndex: 'transactionCount',
      key: 'transactionCount',
    }
  ];

  return (
    <div className="payment-types">
      <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Title level={4}>To`lov turlari</Title>
          <Paragraph>
            Mijozlar va haydovchilar bilan hisob-kitob qilish uchun to'lov turlarini boshqaring
          </Paragraph>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddPaymentType}
          >
            Yangi to`lov turi qo`shish
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {paymentTypes.map(paymentType => (
          <Col xs={24} sm={12} md={8} key={paymentType.id}>
            <Card 
              className="payment-type-card"
              actions={[
                <Tooltip title="Tahrirlash">
                  <EditOutlined key="edit" onClick={() => handleEditPaymentType(paymentType)} />
                </Tooltip>,
                <Tooltip title="O'chirish">
                  <DeleteOutlined key="delete" onClick={() => handleDeletePaymentType(paymentType.id)} />
                </Tooltip>,
                <Tooltip title={paymentType.isActive ? 'Faol' : 'Nofaol'}>
                  {paymentType.isActive ? 
                    <CheckCircleOutlined key="active" style={{ color: '#52c41a' }} /> : 
                    <CloseCircleOutlined key="inactive" style={{ color: '#ff4d4f' }} />
                  }
                </Tooltip>
              ]}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                {paymentType.icon}
                <Title level={4} style={{ marginTop: 12 }}>{paymentType.name}</Title>
                <Paragraph type="secondary">{paymentType.description}</Paragraph>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic 
                    title="Tranzaksiyalar" 
                    value={paymentType.transactionCount} 
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Summa" 
                    value={`${(paymentType.totalAmount / 1000000).toFixed(1)} mln`} 
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left">
        <Space>
          <LineChartOutlined />
          To`lovlar statistikasi
        </Space>
      </Divider>

      <Card>
        <Table 
          columns={columns} 
          dataSource={paymentStatistics} 
          rowKey="type"
          pagination={false}
        />
      </Card>

      <Modal
        title={isEditMode ? "To'lov turini tahrirlash" : "Yangi to'lov turi qo'shish"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Bekor qilish
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalSubmit}>
            {isEditMode ? "Saqlash" : "Qo'shish"}
          </Button>,
        ]}
      >
        <Form 
          form={form}
          layout="vertical"
        >
          <Form.Item 
            name="name" 
            label="To'lov turi nomi"
            rules={[{ required: true, message: 'Iltimos, to\'lov turi nomini kiriting!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Tavsif"
          >
            <TextArea rows={3} />
          </Form.Item>
          
          <Form.Item 
            name="isActive" 
            label="Holat" 
            valuePropName="checked"
            initialValue={true}
          >
            <Switch 
              checkedChildren="Faol" 
              unCheckedChildren="Nofaol" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentTypes; 