import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handlePasswordChange = async (values: any) => {
    try {
      setLoading(true);
      
      // Here you would implement the actual API call to change the password
      // Example: await authService.changePassword(values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Parol muvaffaqiyatli o\'zgartirildi');
      form.resetFields();
    } catch (error) {
      message.error('Parolni o\'zgartirishda xatolik yuz berdi');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Parolni o'zgartirish">
      <Card title="Parolni o'zgartirish" style={{ maxWidth: 500, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Joriy parol"
            rules={[{ required: true, message: 'Joriy parolni kiriting' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Yangi parol"
            rules={[
              { required: true, message: 'Yangi parolni kiriting' },
              { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Yangi parolni tasdiqlang"
            rules={[
              { required: true, message: 'Yangi parolni tasdiqlang' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Yangi parollar mos kelmadi'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Parolni o'zgartirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </DashboardLayout>
  );
};

export default ChangePassword; 