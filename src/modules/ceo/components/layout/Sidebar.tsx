import React from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import { 
  DashboardOutlined, 
  CarOutlined, 
  UserOutlined, 
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;
const { Title } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname();
  
  // Get the active key based on current path
  const getActiveKey = () => {
    if (pathname.includes('/modules/ceo/dashboard')) return 'dashboard';
    if (pathname.includes('/modules/ceo/fleet')) return 'fleet';
    if (pathname.includes('/modules/ceo/drivers')) return 'drivers';
    if (pathname.includes('/modules/ceo/clients')) return 'clients';
    if (pathname.includes('/modules/ceo/trips')) return 'trips';
    if (pathname.includes('/modules/ceo/finance')) return 'finance';
    if (pathname.includes('/modules/ceo/admin')) return 'admin';
    return 'dashboard';
  };
  
  // Create menu items array
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/modules/ceo/dashboard">Dashboard</Link>
    },
    {
      key: 'fleet',
      icon: <CarOutlined />,
      label: <Link href="/modules/ceo/fleet">Transport</Link>
    },
    {
      key: 'drivers',
      icon: <TeamOutlined />,
      label: <Link href="/modules/ceo/drivers">Haydovchilar</Link>
    },
    {
      key: 'clients',
      icon: <TeamOutlined />,
      label: <Link href="/modules/ceo/clients">Mijozlar</Link>
    },
    {
      key: 'trips',
      icon: <EnvironmentOutlined />,
      label: <Link href="/modules/ceo/trips">Reyslar</Link>
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: <Link href="/modules/ceo/finance">Moliya</Link>
    },
    {
      key: 'admin',
      icon: <AppstoreOutlined />,
      label: 'Admin',
      children: [
        {
          key: 'admin-users',
          icon: <UserAddOutlined />,
          label: <Link href="/modules/ceo/admin/admins">Administratorlar</Link>
        },
      ]
    }
  ];

  return (
    <Sider
      width={260}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="ceo-sidebar"
      trigger={null}
    >
      <div className="logo-container">
        {!collapsed ? (
          <div className="logo">
            <Title level={4} style={{ color: '#fff', margin: 0 }}>RBL LOGISTCS</Title>
          </div>
        ) : (
          <div className="logo-small">
            <Title level={4} style={{ color: '#fff', margin: 0 }}>BT</Title>
          </div>
        )}
        <button 
          className="collapse-btn" 
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
      
      <div className="user-info">
        <Avatar size={collapsed ? 32 : 40} icon={<UserOutlined />} />
        {!collapsed && (
          <div className="user-details">
            <span style={{ color: '#fff' }}>Administrator</span>
          </div>
        )}
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getActiveKey()]}
        defaultOpenKeys={collapsed ? [] : ['admin']}
        items={menuItems}
      />
      
      <style jsx global>{`
        .ceo-sidebar {
          position: fixed;
          height: 100vh;
          left: 0;
          z-index: 100;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .collapse-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .user-details {
          margin-left: 12px;
          display: flex;
          flex-direction: column;
        }
        
        .ant-menu-dark .ant-menu-item-selected {
          background-color: #1890ff;
        }
        
        .ant-layout-sider-children {
          display: flex;
          flex-direction: column;
        }
        
        .ant-menu {
          flex: 1;
          padding-top: 12px;
        }
        
        .ant-menu-sub.ant-menu-inline {
          background: rgba(0, 0, 0, 0.2) !important;
        }
        
        .ant-menu-item:hover,
        .ant-menu-submenu-title:hover {
          background-color: rgba(24, 144, 255, 0.3) !important;
        }
      `}</style>
    </Sider>
  );
}; 