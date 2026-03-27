import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Upload, Space, Row, Col, DatePicker, Divider } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

interface VehicleFormProps {
  type: 'car' | 'furgon';
  initialValues?: any;
  onFinish: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ 
  type, 
  initialValues, 
  onFinish, 
  onCancel,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    // Initialize file list if we have a photo
    if (initialValues?.photo) {
      return [
        {
          uid: '-1',
          name: 'vehicle-photo.png',
          status: 'done',
          url: initialValues.photo,
        },
      ];
    }
    return [];
  });

  // Handle form submission
  const handleSubmit = (values: any) => {
    const formattedValues = { ...values };
    
    // Process file upload if exists
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formattedValues.photo = {
        fileList: [{
          originFileObj: fileList[0].originFileObj
        }]
      };
    }
    
    // Format manufacturing date if exists
    if (values.manufacturingDate) {
      formattedValues.year = dayjs(values.manufacturingDate).format('YYYY');
      delete formattedValues.manufacturingDate;
    }
    
    // Add specific fields based on vehicle type
    if (type === 'car' && !formattedValues.holat) {
      formattedValues.holat = 'kutmoqda';
    }
    
    if (type === 'furgon') {
      // Convert status dropdown to is_busy flag for furgons
      if (formattedValues.status === 'foal') {
        formattedValues.is_busy = true;
      } else if (formattedValues.status === 'kutmoqda') {
        formattedValues.is_busy = false;
      }
      delete formattedValues.status;
    }
    
    onFinish(formattedValues);
  };

  // Handle file upload
  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    // Only keep the latest file
    const latestFile = fileList.length > 0 ? [fileList[fileList.length - 1]] : [];
    setFileList(latestFile);
  };

  // File upload props
  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    fileList,
    onChange: handleFileChange,
    maxCount: 1,
    accept: '.jpg,.jpeg,.png',
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        manufacturingDate: initialValues?.year ? dayjs(initialValues.year) : undefined,
        status: initialValues?.is_busy === true ? 'foal' : 'kutmoqda' // For furgons, map is_busy to status
      }}
    >
      <Divider orientation="left">Asosiy ma'lumotlar</Divider>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Nomi"
            name="name"
            rules={[{ required: true, message: 'Iltimos, nomni kiriting' }]}
          >
            <Input placeholder="Transport nomini kiriting" />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            label="Raqami"
            name="number"
            rules={[{ required: true, message: 'Iltimos, raqamni kiriting' }]}
          >
            <Input placeholder="Transport raqamini kiriting" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {type === 'car' && (
          <Col span={12}>
            <Form.Item
              label="Davlat raqami"
              name="car_number"
              rules={[{ required: true, message: 'Iltimos, davlat raqamini kiriting' }]}
            >
              <Input placeholder="Davlat raqamini kiriting" />
            </Form.Item>
          </Col>
        )}
        
        <Col span={type === 'car' ? 12 : 24}>
          {type === 'car' ? (
            <Form.Item
              label="Holati"
              name="holat"
              rules={[{ required: true, message: 'Iltimos, holatni tanlang' }]}
            >
              <Select placeholder="Holatni tanlang">
                <Select.Option value="kutmoqda">Mavjud</Select.Option>
                <Select.Option value="foal">Reysda</Select.Option>
                <Select.Option value="tamirda">Ta'mirlashda</Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              label="Holati"
              name="status"
              rules={[{ required: true, message: 'Iltimos, holatni tanlang' }]}
            >
              <Select placeholder="Holatni tanlang">
                <Select.Option value="kutmoqda">Mavjud</Select.Option>
                <Select.Option value="foal">Reysda</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ishlab chiqarilgan yili"
            name="manufacturingDate"
          >
            <DatePicker 
              picker="year" 
              style={{ width: '100%' }} 
              placeholder="Yilni tanlang"
            />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            label="Bosib o'tilgan masofa (km)"
            name="kilometer"
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0} 
              placeholder="Masofani kiriting" 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
            />
          </Form.Item>
        </Col>
      </Row>

      {type === 'car' && (
        <>
          <Divider orientation="left">Texnik ma'lumotlar</Divider>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Dvigatel"
                name="engine"
              >
                <Input placeholder="Dvigatel ma'lumotlarini kiriting" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                label="Transmissiya"
                name="transmission"
              >
                <Select placeholder="Transmissiya turini tanlang">
                  <Select.Option value="Mexanika">Mexanika</Select.Option>
                  <Select.Option value="Avtomat">Avtomat</Select.Option>
                  <Select.Option value="Yarim avtomat">Yarim avtomat</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                label="Quvvati (o.k.)"
                name="power"
              >
                <Input style={{ width: '100%' }} placeholder="Quvvatini kiriting" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Yoqilg'i turi"
                name="fuel"
              >
                <Select placeholder="Yoqilg'i turini tanlang">
                  <Select.Option value="Benzin">Benzin</Select.Option>
                  <Select.Option value="Dizel">Dizel</Select.Option>
                  <Select.Option value="Gaz">Gaz</Select.Option>
                  <Select.Option value="Elektr">Elektr</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label="Sig'imi"
                name="capacity"
              >
                <Input placeholder="Sig'imini kiriting" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {type === 'furgon' && (
        <>
          <Divider orientation="left">Furgon ma'lumotlari</Divider>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tavsif"
                name="description"
              >
                <Input.TextArea 
                  rows={4}
                  placeholder="Furgon haqida qo'shimcha ma'lumotlar"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <Divider orientation="left">Qo'shimcha ma'lumotlar</Divider>
      
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Rasm yuklash"
            name="photo"
            valuePropName="fileList"
            getValueFromEvent={e => e.fileList}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Rasmni tanlang</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button type="default" onClick={onCancel}>
            Bekor qilish
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Saqlash' : 'Qo\'shish'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}; 