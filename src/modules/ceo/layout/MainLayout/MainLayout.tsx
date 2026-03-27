'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import '../../styles/index.css';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const sidebarWidth = collapsed ? 80 : 280;
  
  return (
    <Layout style={{ minHeight: '100vh' }} className="ceo-main-layout">
      <Sidebar collapsed={collapsed} onCollapse={onCollapse} />
      <Layout style={{ marginLeft: sidebarWidth, transition: 'margin 0.2s' }}>
        <Header collapsed={collapsed} />
        <Content
          style={{
            margin: '88px 24px 24px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}; 