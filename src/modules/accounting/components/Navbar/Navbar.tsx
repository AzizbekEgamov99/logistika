'use client';
import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import NavRight from './NavRight';
import { CarOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

interface NavbarProps {
    fixed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ fixed = true }) => {
    // const dispatch = useDispatch();
    const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.settings);
    
    return (
        <Header 
            className={`navbar ${theme} ${fixed ? 'fixed' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                zIndex: 1000,
                background: theme === 'dark' ? '#001529' : '#fff',
            }}
        >
            <div className="navbar-left">
                <Space align="center">
                    <CarOutlined 
                        style={{ 
                            fontSize: '28px', 
                            color: theme === 'dark' ? '#1890ff' : '#1890ff' 
                        }} 
                    />
                    <Title 
                        level={4} 
                        style={{ 
                            margin: 0,
                            color: theme === 'dark' ? '#fff' : '#001529'
                        }}
            >
                        RBL LOGISTCS
                    </Title>
                </Space>
            </div>

            <div className="navbar-right">
                <NavRight />
            </div>
        </Header>
    );
};

export default Navbar;