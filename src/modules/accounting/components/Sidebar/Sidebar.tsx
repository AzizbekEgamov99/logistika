'use client';
import React from 'react';
import { Layout, Menu, Divider } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import Logo from './Logo';
import { menuItems } from './Items';
import { toggleSidebar } from '../../../store/slices/settingsSlice';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const mainItems = [menuItems[0]]; // Dashboard
const managementItems = [menuItems[1], menuItems[2], menuItems[3], menuItems[4], menuItems[5]]; // Haydovchilar, Haydovchi to'lovlari, Mijozlar, Mashinalar, Furgon
const tripsItems = [menuItems[6], menuItems[7], menuItems[8]]; // Reyslar, Reyslar tarixi, Umumiy yuklar
const serviceItems = [menuItems[9]]; // Kassa

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.settings);

    const handleMenuClick = (key: string) => {
        router.push(key);
    };

    return (
        <Sider
            collapsible
            collapsed={sidebarCollapsed}
            width={240}
            collapsedWidth={80}
            className={`sidebar ${theme}`}
            trigger={null}
        >
            <div className="logo-container">
                <Logo collapsed={sidebarCollapsed} />
                <button 
                    className="sidebar-trigger"
                    onClick={() => dispatch(toggleSidebar())}
                >
                    {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
            </div>

            <div className="sidebar-scroll-container">
                {!sidebarCollapsed && <div className="menu-group-title">Asosiy</div>}
                <Menu
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={mainItems}
                    onClick={({ key }) => handleMenuClick(key)}
                    className="sidebar-menu"
                />

                {!sidebarCollapsed && <Divider className="menu-divider" />}

                {!sidebarCollapsed && <div className="menu-group-title">Boshqaruv</div>}
                <Menu
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={managementItems}
                    onClick={({ key }) => handleMenuClick(key)}
                    className="sidebar-menu"
                />

                {!sidebarCollapsed && <Divider className="menu-divider" />}

                {!sidebarCollapsed && <div className="menu-group-title">Reyslar</div>}
                <Menu
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={tripsItems}
                    onClick={({ key }) => handleMenuClick(key)}
                    className="sidebar-menu"
                />

                {!sidebarCollapsed && <Divider className="menu-divider" />}

                {!sidebarCollapsed && <div className="menu-group-title">Xizmatlar</div>}
                <Menu
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={serviceItems}
                    onClick={({ key }) => handleMenuClick(key)}
                    className="sidebar-menu"
                />
            </div>
        </Sider>
    );
}