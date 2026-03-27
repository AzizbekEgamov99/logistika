"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface LoginValues {
  username: string;
  password: string;
}

const AdminLoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual authentication logic
      // This is just a placeholder
      if (values.username === 'admin' && values.password === 'admin123') {
        // Success - redirect to dashboard
        localStorage.setItem('adminToken', 'example-token');
        router.push('/dashboard');
      } else {
        setError('Noto\'g\'ri login yoki parol');
      }
    } catch (err) {
      setError('Tizimga kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="admin-login-form" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin panelga kirish</h2>
      
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      
      <Form
        name="admin_login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Iltimos, loginingizni kiriting!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Login" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Iltimos, parolingizni kiriting!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Parol"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
          >
            Kirish
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdminLoginForm; 