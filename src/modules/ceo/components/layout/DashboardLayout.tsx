import React, { useState, useEffect } from 'react';
import { Layout, Button, Avatar, Space, message, Dropdown, Spin, Modal, Form, Input } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  KeyOutlined,
  BankOutlined
} from '@ant-design/icons';
import { Sidebar } from './Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  extra
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [form] = Form.useForm();

  // Saqlangan collapsed holatini olish
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    } else if (pathname && pathname.includes('/modules/owner')) {
      setCollapsed(true);
    }
  }, [pathname]);

  // Collapsed holatini saqlash
  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem('sidebar-collapsed', String(value));
  };


  const handlePasswordChange = async (values: any) => {
    try {
      setChangePasswordLoading(true);

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success notification
      message.success('Parol muvaffaqiyatli o\'zgartirildi');
      setPasswordModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Parolni o\'zgartirishda xatolik yuz berdi');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      type: 'item' as const
    },
    {
      key: 'change-password',
      label: 'Parolni o\'zgartirish',
      icon: <KeyOutlined />,
      onClick: () => setPasswordModalVisible(true),
    },
    {
      key: 'divider',
      type: 'divider' as const
    },
    {
      key: 'logout',
      label: 'Chiqish',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.removeItem('token'); // Clear auth token
        router.push('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />

      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s' }}>
        <Header className="dashboard-header">
          <div className="header-left">
            <div className="header-title">
              <h1 className="dashboard-title">{title}</h1>
              {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="header-actions">
            <Space size="middle">
              {extra}

              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <Button type="text" className="header-btn user-btn">
                  <Avatar icon={<UserOutlined />} size="small" />
                  <span className="username">Administrator</span>
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content className="dashboard-content">
          {children}
        </Content>

        <Footer className="dashboard-footer">
          RBL LOGISTCS &copy; {new Date().getFullYear()} - Boshqaruv tizimi
        </Footer>
      </Layout>

      <Modal
        title="Parolni o'zgartirish"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
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
            <Button type="primary" htmlType="submit" loading={changePasswordLoading} block>
              Parolni o'zgartirish
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .dashboard-header {
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          padding: 0 16px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .header-left {
          display: flex;
          align-items: center;
        }
        
        .collapse-btn-header {
          background: transparent;
          border: none;
          font-size: 18px;
          padding: 0;
          margin-right: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #595959;
        }
        
        .header-title {
          display: flex;
          flex-direction: column;
        }
        
        .header-title h1 {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
        }
        
        .header-title p {
          margin: 4px 0 0 0;
          font-size: 14px;
          line-height: 1.2;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
        }
        
        .header-btn {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 12px;
          border-radius: 6px;
        }
        
        .header-btn:hover {
          background: rgba(0, 0, 0, 0.03);
        }
        
        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .username {
          margin-left: 8px;
        }
        
        .currency-rates {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #595959;
        }
        
        .currency-item {
          margin-right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .currency-item .anticon {
          color: #1890ff;
        }
        
        .dashboard-content {
          padding: 16px;
          background: #f5f7fa;
          min-height: calc(100vh - 64px - 48px);
        }
        
        .dashboard-footer {
          text-align: center;
          padding: 12px 24px;
          background: #fff;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.03);
        }
        
        @media (max-width: 768px) {
          .username {
            display: none;
          }
          
          .dashboard-header {
            padding: 0 12px;
          }
          
          .dashboard-content {
            padding: 16px;
          }
          
          .currency-rates {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
};