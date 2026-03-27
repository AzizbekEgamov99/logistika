import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Select, 
  InputNumber, 
  Upload,
  message,
  Image
} from 'antd';
import { PlusOutlined, CarOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { formatImageUrl } from '../../../../../api/axiosInstance';

const { Option } = Select;

interface CarModalProps {
  visible: boolean;
  car: any;
  onCancel: () => void;
  onSubmit: (values: FormData) => Promise<void>;
}

const CarModal: React.FC<CarModalProps> = ({ visible, car, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Reset form when modal opens/closes or car changes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // Set form fields with car data
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
          kilometer: car.kilometer || 0,
          mileage: car.mileage || 0,
          holat: car.holat || 'foal',
        });
        
        // Set image URL if car has a photo
        if (car.photo) {
          setImageUrl(formatImageUrl(car.photo) || undefined);
        } else {
          setImageUrl(undefined);
        }
      } else {
        setImageUrl(undefined);
      }
      
      setPhotoFile(null);
    }
  }, [visible, car, form]);

  // Handle file upload before sending to server
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Faqat JPG/PNG formatdagi rasmlarni yuklashingiz mumkin!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Rasm hajmi 2MB dan kichik bo\'lishi kerak!');
      return false;
    }
    
    return false; // Return false to stop antd's default upload behavior
  };

  // Handle image change
  const handleImageChange = (info: any) => {
    if (info.file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file);
      
      // Store the file in state
      setPhotoFile(info.file);
    } else if (info.file.originFileObj instanceof File) {
      // Handle Ant Design Upload component format which uses originFileObj
      const file = info.file.originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Store the file in state
      setPhotoFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Ensure all required fields are present with non-empty values
      const fieldsToSubmit = {
        name: values.name,
        number: values.number,
        year: values.year,
        engine: values.engine,
        transmission: values.transmission,
        power: values.power,
        capacity: values.capacity,
        fuel: values.fuel || 'benzin',
        mileage: values.mileage || '0',
        car_number: values.car_number,
        kilometer: values.kilometer || 0,
        holat: values.holat || 'foal',
        status: 'foal' // Add status field
      };
      
      // Add all form values to FormData
      Object.entries(fieldsToSubmit).forEach(([key, value]) => {
        // Ensure value is a non-empty string
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Add photo if available from state
      if (photoFile) {
        formData.append('photo', photoFile, photoFile.name);
        
        // Log photo details for debugging
        console.log('Adding photo to FormData. File info:', {
          name: photoFile.name,
          size: photoFile.size,
          type: photoFile.type,
          lastModified: new Date(photoFile.lastModified).toISOString()
        });
      }
      
      // Log all FormData entries for debugging
      console.log('FormData entries for car:');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      await onSubmit(formData);
      
      // Reset form fields
      form.resetFields();
      setImageUrl(undefined);
      setPhotoFile(null);
      
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Forma tekshirishda xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={car ? "Avtomobilni tahrirlash" : "Yangi avtomobil qo'shish"}
      open={visible}
      onCancel={onCancel}
      forceRender={true}
      footer={[
        <Button key="back" onClick={onCancel}>
          Bekor qilish
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<CarOutlined />}
        >
          {car ? "Saqlash" : "Qo'shish"}
        </Button>,
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          holat: 'foal',
          kilometer: 0,
          mileage: 0,
          fuel: 'petrol'
        }}
      >
        <Form.Item
          label="Rasm"
          name="photoUpload"
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
            customRequest={({  onSuccess }) => {
              setTimeout(() => {
                onSuccess?.("ok");
              }, 0);
            }}
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
                preview={false}
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
                <CarOutlined style={{ fontSize: '32px', color: '#999', marginBottom: 8 }} />
                <div>Rasm yuklash</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="name"
          label="Avtomobil nomi"
          rules={[{ required: true, message: 'Iltimos, avtomobil nomini kiriting' }]}
        >
          <Input placeholder="Misol: MAN TGX" />
        </Form.Item>

        <Form.Item
          name="car_number"
          label="Davlat raqami"
          rules={[{ required: true, message: 'Iltimos, davlat raqamini kiriting' }]}
        >
          <Input placeholder="Misol: 01A123BB" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Model raqami"
          rules={[{ required: true, message: 'Iltimos, model raqamini kiriting' }]}
        >
          <Input placeholder="Misol: TGX 26.400" />
        </Form.Item>

        <Form.Item
          name="year"
          label="Ishlab chiqarilgan yili"
          rules={[{ required: true, message: 'Iltimos, ishlab chiqarilgan yilini kiriting' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Misol: 2018" />
        </Form.Item>

        <Form.Item
          name="kilometer"
          label="Yurgan masofasi (km)"
          rules={[{ required: true, message: 'Iltimos, yurgan masofasini kiriting' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Misol: 150000" />
        </Form.Item>

        <Form.Item
          name="engine"
          label="Dvigatel"
        >
          <Input placeholder="Misol: D26" />
        </Form.Item>

        <Form.Item
          name="transmission"
          label="Uzatish qutisi"
        >
          <Input placeholder="Misol: Avtomat" />
        </Form.Item>

        <Form.Item
          name="power"
          label="Quvvati (ot kuchi)"
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Misol: 400" />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Sig'imi (m³)"
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Misol: 12" />
        </Form.Item>

        <Form.Item
          name="fuel"
          label="Yoqilg'i turi"
        >
          <Select placeholder="Yoqilg'i turini tanlang">
            <Option value="petrol">Benzin</Option>
            <Option value="diesel">Dizel</Option>
            <Option value="gas">Gaz</Option>
            <Option value="electric">Elektr</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="holat"
          label="Holati"
          rules={[{ required: true, message: 'Iltimos, holatini tanlang' }]}
        >
          <Select placeholder="Holatini tanlang">
            <Option value="foal">Faol</Option>
            <Option value="kutmoqda">Kutmoqda</Option>
            <Option value="tamirda">Ta'mirda</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarModal; 