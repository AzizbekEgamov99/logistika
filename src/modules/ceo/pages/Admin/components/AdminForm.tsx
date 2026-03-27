import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Row, Col, Select, Alert } from 'antd';
import { AdminFormValues, Admin, AdminStatus } from '../types/admin';

const { Option } = Select;

interface AdminFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminFormValues) => Promise<{ success: boolean; errors?: Record<string, string[]> }>;
  initialValues?: Admin;
  title?: string;
  loading?: boolean;
  isEdit?: boolean;
  errors?: Record<string, string[]>;
}

const AdminForm: React.FC<AdminFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title = 'Administrator qo\'shish',
  loading = false,
  isEdit = false,
  errors = {}
}) => {
  const [form] = Form.useForm();

  // Reset form fields when modal is opened/closed or initialValues change
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          username: initialValues.username,
          fullname: initialValues.fullname,
          phone_number: initialValues.phone_number,
          status: initialValues.status.toLowerCase(),
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await onSubmit(values);
      if (result.success) {
        onCancel();
      } else {
        // If there are field-specific errors, set them on the form
        if (result.errors) {
          const fieldErrors: Record<string, { errors: string[] }> = {};
          
          Object.entries(result.errors).forEach(([field, messages]) => {
            fieldErrors[field] = { errors: messages.map(msg => msg) };
          });
          
          form.setFields(Object.entries(fieldErrors).map(([name, errors]) => ({
            name,
            errors: errors.errors,
          })));
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const statusOptions = [
    { value: 'ceo', label: 'CEO' },
    { value: 'bugalter', label: 'Bugalter' },
  ];

  // Check if we have any general errors not tied to specific fields
  const generalErrors = errors.non_field_errors || errors.detail || [];

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Bekor qilish
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit} 
          loading={loading}
        >
          Saqlash
        </Button>
      ]}
      maskClosable={false}
      forceRender={true}
    >
      {generalErrors.length > 0 && (
        <Alert
          message="Xatolik"
          description={generalErrors.join(', ')}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          username: initialValues?.username || '',
          fullname: initialValues?.fullname || '',
          phone_number: initialValues?.phone_number || '',
          status: initialValues?.status.toLowerCase() || undefined,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="username"
              label="Foydalanuvchi nomi"
              validateStatus={errors.username ? 'error' : undefined}
              help={errors.username ? errors.username.join(', ') : undefined}
              rules={[
                { required: true, message: 'Foydalanuvchi nomini kiriting!' },
                { min: 3, message: 'Kamida 3 ta belgi bo\'lishi kerak' }
              ]}
            >
              <Input placeholder="Foydalanuvchi nomi" disabled={isEdit} />
            </Form.Item>
          </Col>

          {!isEdit && (
            <Col span={24}>
              <Form.Item
                name="password"
                label="Parol"
                validateStatus={errors.password ? 'error' : undefined}
                help={errors.password ? errors.password.join(', ') : undefined}
                rules={[
                  { required: !isEdit, message: 'Parolni kiriting!' },
                  { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }
                ]}
              >
                <Input.Password placeholder="Parol" />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              name="fullname"
              label="To'liq ism"
              validateStatus={errors.fullname ? 'error' : undefined}
              help={errors.fullname ? errors.fullname.join(', ') : undefined}
              rules={[{ required: true, message: 'To\'liq ismni kiriting!' }]}
            >
              <Input placeholder="To'liq ism" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="phone_number"
              label="Telefon raqami"
              validateStatus={errors.phone_number ? 'error' : undefined}
              help={errors.phone_number ? errors.phone_number.join(', ') : undefined}
              rules={[
                { required: true, message: 'Telefon raqamini kiriting!' },
                { pattern: /^\+?[0-9]{10,13}$/, message: 'Yaroqli telefon raqamini kiriting' }
              ]}
            >
              <Input placeholder="+998901234567" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="status"
              label="Status"
              validateStatus={errors.status ? 'error' : undefined}
              help={errors.status ? errors.status.join(', ') : undefined}
              rules={[{ required: true, message: 'Statusni tanlang!' }]}
            >
              <Select placeholder="Statusni tanlang">
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AdminForm; 