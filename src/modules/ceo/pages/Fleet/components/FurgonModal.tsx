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
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { Furgon } from '../../../../accounting/types/furgon';
import { formatImageUrl } from '../../../../../api/axiosInstance';

const { Option } = Select;

// Extended interface to include additional form fields
interface FurgonFormData extends Partial<Furgon> {
  capacity?: number;
  max_weight?: number;
  holat?: string;
  width?: number;
  height?: number;
  length?: number;
}

interface FurgonModalProps {
  visible: boolean;
  furgon: FurgonFormData | null;
  onCancel: () => void;
  onSubmit: (values: FormData) => Promise<void>;
}

const FurgonModal: React.FC<FurgonModalProps> = ({ visible, furgon, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Reset form when modal opens/closes or furgon changes
  useEffect(() => {
    if (visible) {
      form.resetFields();

      // Set form fields with furgon data
      if (furgon) {
        form.setFieldsValue({
          name: furgon.name,
          number: furgon.number,
          capacity: furgon.capacity || 0,
          width: furgon.width || 0,
          height: furgon.height || 0,
          length: furgon.length || 0,
          max_weight: furgon.max_weight || 0,
          holat: furgon.holat || 'foal',
          description: furgon.description || '',
          kilometer: furgon.kilometer || 0,
        });

        // Set image URL if furgon has a photo
        if (furgon.photo) {
          setImageUrl(formatImageUrl(furgon.photo) || undefined);
        } else {
          setImageUrl(undefined);
        }
      } else {
        setImageUrl(undefined);
      }

      setPhotoFile(null);
    }
  }, [visible, furgon, form]);

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
        capacity: values.capacity || 0,
        width: values.width || 0,
        height: values.height || 0,
        length: values.length || 0,
        max_weight: values.max_weight || 0,
        holat: values.holat || 'foal',
        description: values.description || '',
        kilometer: values.kilometer || 0,
        status: 'foal' // Make sure status field is included 
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
      }

      // Log FormData contents for debugging
      console.log('FormData contents before submission:');
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
      title={furgon ? "Furgonni tahrirlash" : "Yangi furgon qo'shish"}
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
          {furgon ? "Saqlash" : "Qo'shish"}
        </Button>,
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          holat: 'foal',
          capacity: 0,
          max_weight: 0,
          kilometer: 0,
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
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess?.("ok");
              }, 0);
            }}
            maxCount={1}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="furgon"
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
          label="Furgon nomi"
          rules={[{ required: true, message: 'Iltimos, furgon nomini kiriting' }]}
        >
          <Input placeholder="Misol: MAN TGX" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Davlat raqami"
          rules={[{ required: true, message: 'Iltimos, davlat raqamini kiriting' }]}
        >
          <Input placeholder="Misol: 01A123BB" />
        </Form.Item>

        <Form.Item
          name="kilometer"
          label="Yurgan masofasi (km)"
          rules={[{ required: true, message: 'Yurgan masofasini kiriting' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Kilometr" />
        </Form.Item>

        <Form.Item
          name="holat"
          label="Holati"
          rules={[{ required: true, message: 'Holatini tanlang' }]}
        >
          <Select placeholder="Holati">
            <Option value="foal">Faol</Option>
            <Option value="kutmoqda">Kutmoqda</Option>
            <Option value="tamirda">Ta`mirda</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Qo'shimcha ma'lumot"
        >
          <Input.TextArea rows={4} placeholder="Qo'shimcha ma'lumotlar..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FurgonModal; 