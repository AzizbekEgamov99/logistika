import React from 'react';
import {
  Layout,
  Avatar,
  Button,
  Dropdown,
  Badge,
  Space,
  Typography,
} from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ collapsed }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link href="/modules/ceo/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <Link href="/modules/ceo/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <Text strong>New delivery completed</Text>
          <p style={{ margin: 0 }}>Driver Alex completed delivery #1234</p>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            5 min ago
          </Text>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <Text strong>Maintenance alert</Text>
          <p style={{ margin: 0 }}>
            Vehicle TB-123 requires scheduled maintenance
          </p>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            2 hours ago
          </Text>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div>
          <Text strong>Revenue milestone reached</Text>
          <p style={{ margin: 0 }}>
            Monthly revenue target of $100,000 achieved
          </p>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            1 day ago
          </Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'all',
      label: <Link href="/modules/ceo/notifications">View all notifications</Link>,
    },
  ];

  const sidebarWidth = collapsed ? 80 : 280;

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: `calc(100% - ${sidebarWidth}px)`,
        right: 0,
        zIndex: 9,
        transition: 'width 0.2s',
      }}
    >
      <div className="header-search">
        <Button type="text" icon={<SearchOutlined />} size="large">
          Search...
        </Button>
      </div>

      <Space size={16}>
        <Dropdown
          menu={{ items: notificationMenuItems }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined />} size="large" />
          </Badge>
        </Dropdown>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <span style={{ marginLeft: 8, display: 'inline-block' }}>
              <Text strong>John Doe</Text>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  CEO
                </Text>
              </div>
            </span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}; 