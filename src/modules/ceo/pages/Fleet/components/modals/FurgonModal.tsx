import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, message, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Vehicle } from '../../types';
import { formatImageUrl } from '../../../../../../api/axiosInstance';

interface FurgonModalProps {
  visible: boolean;
  onCancel: () => void;
  furgon: Vehicle | null;
  onSubmit: (values: any) => Promise<void>;
}

const FurgonModal: React.FC<FurgonModalProps> = ({
  visible,
  onCancel,
  furgon,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (visible) {
      if (furgon) {
        form.setFieldsValue({
          name: furgon.name,
          number: furgon.number,
          description: furgon.description,
          kilometer: furgon.kilometer || 0,
        });

        if (furgon.photo) {
          setImageUrl(formatImageUrl(furgon.photo) || undefined);
        }
      } else {
        form.resetFields();
        setImageUrl(undefined);
        setPhotoFile(null);
      }
    }
  }, [visible, furgon, form]);

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
      
      if (!furgon) {
        formData.append('status', 'foal');
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
      title={furgon ? 'Furgonni tahrirlash' : 'Yangi furgon qo\'shish'}
      okText={furgon ? 'Saqlash' : 'Qo\'shish'}
      cancelText="Bekor qilish"
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={false}
      width={600}
      forceRender={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          number: '',
          description: '',
          kilometer: 0
        }}
      >
        <Form.Item
          name="name"
          label="Furgon nomi"
          rules={[{ required: true, message: 'Furgon nomini kiritish shart' }]}
        >
          <Input placeholder="Furgon nomini kiriting" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Davlat raqami"
          rules={[{ required: true, message: 'Davlat raqamini kiritish shart' }]}
        >
          <Input placeholder="Davlat raqamini kiriting" />
        </Form.Item>

        <Form.Item
          name="kilometer"
          label="Kilometr"
          rules={[{ type: 'number', min: 0, message: 'Musbat son kiriting' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Kilometr" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Tavsif"
        >
          <Input.TextArea rows={4} placeholder="Furgon haqida qo'shimcha ma'lumot" />
        </Form.Item>

        <Form.Item
          name="photo"
          label="Furgon rasmi"
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
                alt="furgon" 
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
      </Form>
    </Modal>
  );
};

export default FurgonModal; 