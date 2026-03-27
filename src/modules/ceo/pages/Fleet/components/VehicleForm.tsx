import React from 'react';
import { Form, Input, Button, Select, InputNumber, Row, Col, DatePicker } from 'antd';
import { CarOutlined, UserOutlined, NumberOutlined, CalendarOutlined } from '@ant-design/icons';

const { Option } = Select;

interface VehicleFormProps {
  form: any;
  onFinish: (values: any) => void;
  isEditMode: boolean;
  vehicleType: string;
  drivers: any[];
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  form,
  onFinish,
  isEditMode,
  vehicleType,
  drivers
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="nomi"
            label="Transport nomi"
            rules={[{ required: true, message: 'Iltimos, transport nomini kiriting' }]}
          >
            <Input prefix={<CarOutlined />} placeholder="Transport nomi" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="davlat_raqami"
            label="Davlat raqami"
            rules={[{ required: true, message: 'Iltimos, davlat raqamini kiriting' }]}
          >
            <Input prefix={<NumberOutlined />} placeholder="Davlat raqami" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="model"
            label="Model"
          >
            <Input placeholder="Transport modeli" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="haydovchi"
            label="Haydovchi"
          >
            <Select
              placeholder="Haydovchini tanlang"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {drivers.map(driver => (
                <Option key={driver.id} value={driver.id}>
                  {driver.fullname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="kilometer"
            label="Bosib o'tilgan masofa (km)"
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="Bosib o'tilgan masofa" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ishlab_chiqarilgan_yil"
            label="Ishlab chiqarilgan yil"
          >
            <DatePicker picker="year" style={{ width: '100%' }} placeholder="Ishlab chiqarilgan yil" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="holat"
            label="Holati"
            initialValue="active"
          >
            <Select>
              <Option value="active">Faol</Option>
              <Option value="available">Mavjud</Option>
              <Option value="tamirda">Ta'mirda</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEditMode ? 'Saqlash' : 'Qo\'shish'}
        </Button>
      </Form.Item>
    </Form>
  );
}; 