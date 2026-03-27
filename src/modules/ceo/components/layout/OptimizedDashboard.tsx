'use client';

import React, { useState, useEffect, memo } from 'react';
import { Layout, Button, Avatar, Space, message, Dropdown, Spin } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  KeyOutlined,
  DollarOutlined,
  EuroOutlined,
  BankOutlined
} from '@ant-design/icons';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/navigation';
import { MenuProps } from 'antd';
import { useCurrencies } from '../../../accounting/hooks/useCurrencies';
import RouteTransition from '@/components/RouteTransition';

const { Header, Content, Footer } = Layout;

export interface OptimizedDashboardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// Performance-optimized dashboard
const OptimizedDashboard: React.FC<OptimizedDashboardProps> = memo(({ 
  children,
  title,
  subtitle
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { currencies, loading } = useCurrencies();
  
  // Saqlangan collapsed holatini olish
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    }
  }, []);
  
  // Collapsed holatini saqlash
  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem('sidebar-collapsed', String(value));
  };

  const getCurrencyIcon = (code: string) => {
    switch (code) {
      case 'USD': return <DollarOutlined />;
      case 'EUR': return <EuroOutlined />;
      case 'RUB': return <BankOutlined />;
      case 'UZS': return <BankOutlined />;
      default: return <DollarOutlined />;
    }
  };

  // Filtering in a memoized way
  const availableCurrencies = React.useMemo(() => {
    return currencies && currencies.length > 0 
      ? currencies.filter(c => c.currency !== 'UZS').slice(0, 3) // Show top 3 non-UZS currencies
      : [
          { id: 2, currency: 'USD', rate_to_uzs: '1' },
          { id: 3, currency: 'EUR', rate_to_uzs: '1' },
          { id: 4, currency: 'RUB', rate_to_uzs: '1' }
        ];
  }, [currencies]);

  const userMenuItems: MenuProps['items'] = React.useMemo(() => [
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
      onClick: () => router.push('/modules/ceo/change-password'),
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
      onClick: () => router.push('/login'),
    },
  ], [router]);
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
      
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s' }}>
        <Header className="dashboard-header">
          <div className="header-left">
            <button 
              className="collapse-btn-header" 
              onClick={() => handleCollapse(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div className="header-title">
              <h1 className="dashboard-title">{title}</h1>
              {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
            </div>
          </div>
          
          <div className="header-actions">
            <Space size="middle">
              {/* Valyuta kurslari */}
              <div className="currency-rates">
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <Space>
                    {availableCurrencies.map(currency => (
                      <div className="currency-item" key={currency.id}>
                        {getCurrencyIcon(currency.currency)}
                        <span>{currency.currency}: {Number(currency.rate_to_uzs).toLocaleString()} UZS</span>
                      </div>
                    ))}
                  </Space>
                )}
              </div>
              
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
          <RouteTransition>
            {children}
          </RouteTransition>
        </Content>
        
        <Footer className="dashboard-footer">
          RBL LOGISTCS &copy; {new Date().getFullYear()} - Boshqaruv tizimi
        </Footer>
      </Layout>
      
      <style jsx global>{`
        .dashboard-header {
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          padding: 0 24px;
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
          padding: 24px;
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
});

export default OptimizedDashboard; 