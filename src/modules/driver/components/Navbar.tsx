import { Layout, Menu, Typography, Button, Drawer } from 'antd';
import { MenuOutlined, CarOutlined, FileOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MenuItem } from '../types/types';

const { Header } = Layout;
const { Title } = Typography;

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navigateTo = (path: string) => {
        router.push(path);
        setMobileMenuOpen(false);
    };

    const menuItems = [
        {
            key: '/modules/driver/dashboard',
            icon: <CarOutlined />,
            label: 'Asosiy',
            onClick: () => navigateTo('/modules/driver/dashboard')
        },
        {
            key: 'expenses',
            icon: <CarOutlined />,
            label: 'Chiqimlar',
            children: [
                {
                    key: '/modules/driver/expenses/road',
                    label: "Yo'l chiqimlari",
                    onClick: () => navigateTo('/modules/driver/expenses/road')
                },
                {
                    key: '/modules/driver/expenses/post',
                    label: 'Post chiqimlari',
                    onClick: () => navigateTo('/modules/driver/expenses/post')
                },
                {
                    key: '/modules/driver/expenses/fuel',
                    label: 'Zapravka chiqimlari',
                    onClick: () => navigateTo('/modules/driver/expenses/fuel')
                },
                {
                    key: '/modules/driver/expenses/oil',
                    label: 'Moy chiqimlari',
                    onClick: () => navigateTo('/modules/driver/expenses/oil')
                },
            ]
        },
        {
            key: 'applications',
            icon: <FileOutlined />,
            label: 'Arizalar',
            children: [
                {
                    key: '/modules/driver/applications/road',
                    label: "Yo'l chiqimi bo'yicha",
                    onClick: () => navigateTo('/modules/driver/applications/road')
                },
                {
                    key: '/modules/driver/applications/additional',
                    label: "Qo'shimcha",
                    onClick: () => navigateTo('/modules/driver/applications/additional')
                },
            ]
        }
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        const findMenuItem = (items: MenuItem[], key: string): MenuItem | null => {
            for (const item of items) {
                if (item.key === key) return item;
                if (item.children) {
                    const found = findMenuItem(item.children, key);
                    if (found) return found;
                }
            }
            return null;
        };

        const item = findMenuItem(menuItems, key);
        if (item?.onClick) {
            item.onClick();
        }
    };


    const renderMenu = () => (
        <Menu
            theme={isMobile ? "light" : "dark"}
            selectedKeys={[pathname]}
            mode={isMobile ? "inline" : "horizontal"}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ background: 'transparent', border: 'none' }}
        />
    );

    return (
        <Header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: '#001529'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Title level={4} style={{ margin: 0, color: '#fff', flexShrink: 0 }}>
                    Driver Panel
                </Title>
                {!isMobile && renderMenu()}
            </div>
            <Title level={5} style={{ margin: 0, color: '#fff', textAlign: 'center' }}>
                <span style={{ color: '#fff' }}>Foydalanuvchi ismi va familiyasi</span>
            </Title>
            <div>
                {isMobile ? (
                    <>
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setMobileMenuOpen(true)}
                            style={{ color: '#fff' }}
                        />
                        <Drawer
                            title="Menu"
                            placement="left"
                            onClose={() => setMobileMenuOpen(false)}
                            open={mobileMenuOpen}
                            bodyStyle={{ padding: 0 }}
                        >
                            {renderMenu()}
                            <Button
                                type="primary"
                                danger
                                style={{ width: '100%', marginTop: 16 }}
                            >
                                Log Out
                            </Button>
                        </Drawer>
                    </>
                ) : (
                    <Button type="primary" danger >
                        Log Out
                    </Button>
                )}
            </div>
        </Header>
    );

}
