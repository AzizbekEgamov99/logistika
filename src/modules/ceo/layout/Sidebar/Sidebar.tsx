import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  LineChartOutlined,
  TeamOutlined,
  CarOutlined,
  SettingOutlined,
  FileTextOutlined,
  BellOutlined,
  MenuFoldOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const toggleCollapsed = () => {
    onCollapse(!collapsed);
  };
  
  // Get the current path to determine which menu item is active
  const getSelectedKey = () => {
    if (pathname?.includes('/modules/ceo/dashboard')) return '1';
    if (pathname?.includes('/modules/ceo/analytics')) return '2';
    if (pathname?.includes('/modules/ceo/drivers')) return '3';
    if (pathname?.includes('/modules/ceo/fleet')) return '4';
    if (pathname?.includes('/modules/ceo/trips')) return '5';
    if (pathname?.includes('/modules/ceo/finance')) return '6';
    if (pathname?.includes('/modules/ceo/admin')) return '7';
    return '1'; 
  };

  // Mock user data (should be fetched from authenticated user context)
  const user = {
    name: 'John Doe',
    photo: '/avatar.png'
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
  };
  
  return (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      style={{
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        zIndex: 10,
        borderRight: 'none',
        background: '#ffffff'
      }}
      className="custom-sidebar"
    >
      <div 
        className="sidebar-header"
        style={{ 
          padding: collapsed ? '20px 0' : '20px 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          background: 'linear-gradient(to right, #1a365d, #2a4a73)',
          color: 'white'
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 12
            }}>
              <BarChartOutlined style={{ color: '#1a365d', fontSize: 20 }} />
            </div>
            <Title level={4} style={{ margin: 0, color: 'white' }}>
              RBL LOGISTCS
            </Title>
          </div>
        )}
        {collapsed ? (
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChartOutlined style={{ color: '#1a365d', fontSize: 20 }} />
          </div>
        ) : (
          <MenuFoldOutlined onClick={toggleCollapsed} style={{ fontSize: '18px', color: 'white' }} />
        )}
      </div>
      
      <div className="sidebar-user" style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0', 
        display: collapsed ? 'none' : 'flex',
        alignItems: 'center',
        background: '#f9fafb'
      }}>
        <UserOutlined
          style={{
            fontSize: 24,
            backgroundColor: '#1a365d',
            color: 'white',
            borderRadius: '50%',
            padding: 8,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <div style={{ marginLeft: 12 }}>
          <Text strong style={{ fontSize: 14, display: 'block' }}>{user?.name || 'CEO'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Chief Executive Officer</Text>
        </div>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ borderRight: 0, paddingTop: '12px' }}
        onClick={({ key }) => {
          switch (key) {
            case '1':
              handleMenuClick('/modules/ceo/dashboard');
              break;
            case '2':
              handleMenuClick('/modules/ceo/analytics');
              break;
            case '3':
              handleMenuClick('/modules/ceo/drivers');
              break;
            case '4':
              handleMenuClick('/modules/ceo/fleet');
              break;
            case '5':
              handleMenuClick('/modules/ceo/trips');
              break;
            case '6':
              handleMenuClick('/modules/ceo/finance');
              break;
            case '7':
              handleMenuClick('/modules/ceo/admin');
              break;
          }
        }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<LineChartOutlined />}>
          Analytics
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />}>
          Team
        </Menu.Item>
        <Menu.Item key="4" icon={<CarOutlined />}>
          Fleet
        </Menu.Item>
        <Menu.Item key="5" icon={<FileTextOutlined />}>
          Reports
        </Menu.Item>
        <Menu.Item key="6" icon={<BellOutlined />}>
          Finance
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="7" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </Sider>
  );
}; 