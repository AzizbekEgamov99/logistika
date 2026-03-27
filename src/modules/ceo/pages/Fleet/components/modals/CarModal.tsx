import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Select, message, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Vehicle } from '../../types';
import { formatImageUrl } from '../../../../../../api/axiosInstance';

const { Option } = Select;

interface CarModalProps {
  visible: boolean;
  onCancel: () => void;
  car: Vehicle | null;
  onSubmit: (values: any) => Promise<void>;
}

const CarModal: React.FC<CarModalProps> = ({
  visible,
  onCancel,
  car,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (visible) {
      if (car) {
        form.setFieldsValue({
          name: car.name,
          number: car.number,
          car_number: car.car_number,
          year: car.year,
          engine: car.engine,
          transmission: car.transmission,
          power: car.power,
          capacity: car.capacity,
          fuel: car.fuel,
          mileage: car.mileage,
          holat: car.holat,
          description: car.description,
          kilometer: car.kilometer || 0,
        });

        if (car.photo) {
          setImageUrl(formatImageUrl(car.photo) || undefined);
        }
      } else {
        form.resetFields();
        setImageUrl(undefined);
        setPhotoFile(null);
      }
    }
  }, [visible, car, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      Object.keys(values).forEach(key => {
        if (key !== 'photo' && values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      
      // Add photo if available
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      
      if (!values.holat) {
        formData.append('holat', 'foal');
      }
      
      // Ensure kilometer is always sent with at least 0
      if (!formData.has('kilometer')) {
        formData.append('kilometer', '0');
      }
      
      await onSubmit(formData);
      form.resetFields();
      setImageUrl(undefined);
      setPhotoFile(null);
      onCancel();
    } catch (error) {
      console.error('Submit error:', error);
      message.error('Xatolik yuz berdi');
    }
  };

  const handleImageChange = (info: any) => {
    if (info.file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file);
      setPhotoFile(info.file);
    } else if (info.file.originFileObj instanceof File) {
      const file = info.file.originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Faqat JPG/PNG formatdagi rasmlar qabul qilinadi!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Rasm hajmi 2MB dan kichik bo\'lishi kerak!');
      return false;
    }
    return false;
  };

  return (
    <Modal
      open={visible}
      title={car ? 'Avtomobilni tahrirlash' : 'Yangi avtomobil qo\'shish'}
      okText={car ? 'Saqlash' : 'Qo\'shish'}
      cancelText="Bekor qilish"
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={false}
      width={800}
      forceRender={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          number: '',
          car_number: '',
          year: new Date().getFullYear(),
          holat: 'foal',
          mileage: 0,
          kilometer: 0
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              name="name"
              label="Avtomobil nomi"
              rules={[{ required: true, message: 'Avtomobil nomini kiritish shart' }]}
            >
              <Input placeholder="Avtomobil nomini kiriting" />
            </Form.Item>

            <Form.Item
              name="number"
              label="Davlat raqami"
              rules={[{ required: true, message: 'Davlat raqamini kiritish shart' }]}
            >
              <Input placeholder="Davlat raqamini kiriting" />
            </Form.Item>

            <Form.Item
              name="car_number"
              label="Avtomobil raqami"
            >
              <Input placeholder="Avtomobil raqamini kiriting" />
            </Form.Item>

            <Form.Item
              name="year"
              label="Ishlab chiqarilgan yil"
            >
              <InputNumber style={{ width: '100%' }} min={1900} max={new Date().getFullYear()} />
            </Form.Item>

            <Form.Item
              name="mileage"
              label="Yurgan masofasi (km)"
              rules={[{ type: 'number', min: 0, message: 'Musbat son kiriting' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Yurgan masofasi" />
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item
              name="engine"
              label="Dvigatel"
            >
              <Input placeholder="Dvigatel ma'lumotlarini kiriting" />
            </Form.Item>

            <Form.Item
              name="transmission"
              label="Transmission"
            >
              <Select placeholder="Transmissionni tanlang">
                <Option value="automatic">Avtomat</Option>
                <Option value="manual">Mexanik</Option>
                <Option value="semi-automatic">Yarim avtomat</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="power"
              label="Quvvat (ot kuchi)"
            >
              <InputNumber style={{ width: '100%' }} min={0} placeholder="Quvvat" />
            </Form.Item>

            <Form.Item
              name="capacity"
              label="Sig'im (litr)"
            >
              <InputNumber style={{ width: '100%' }} min={0} step={0.1} placeholder="Sig'im" />
            </Form.Item>

            <Form.Item
              name="fuel"
              label="Yoqilg'i turi"
            >
              <Select placeholder="Yoqilg'i turini tanlang">
                <Option value="benzin">Benzin</Option>
                <Option value="dizel">Dizel</Option>
                <Option value="gaz">Gaz</Option>
                <Option value="elektr">Elektr</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="holat"
              label="Holati"
            >
              <Select placeholder="Holatni tanlang">
                <Option value="foal">Faol</Option>
                <Option value="tamirda">Ta'mirda</Option>
                <Option value="kutmoqda">Kutmoqda</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="photo"
              label="Avtomobil rasmi"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
                maxCount={1}
              >
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt="car" 
                    width={100}
                    height={100}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <InboxOutlined style={{ fontSize: '32px', color: '#999', marginBottom: 8 }} />
                    <div>Rasm yuklash</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CarModal; 