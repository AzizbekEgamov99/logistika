'use client';
import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Sidebar } from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import ZaphosDashboard from '../pages/Dashboard/Dashboard';
import TexnicPage from '../pages/Texnic';
import OptolPage from '../pages/Optol';
import BalonPage from '../pages/Balon';
import CarsPage from '../pages/Cars';
import FurgonPage from '../pages/Furgon';

import RouteTransition from '@/components/RouteTransition';
import '../styles/global.css';
import '@/modules/accounting/styles/Navbar.css';
import '@/modules/accounting/styles/Sidebar.css';

const { Content } = Layout;

interface RouteComponents {
    [key: string]: React.ComponentType;
}

const ROUTES: RouteComponents = {
    '/zaphos': ZaphosDashboard,
    '/zaphos/texnic': TexnicPage,
    '/zaphos/optol': OptolPage,
    '/zaphos/balon': BalonPage,
    '/zaphos/cars': CarsPage,
    '/zaphos/furgon': FurgonPage,
};

export function ZaphosLayout() {
    const pathname = usePathname();
    const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.settings);

    const currentComponent = useMemo(() => {
        const path = pathname.replace('/modules', '');
        const Component = ROUTES[path] || ZaphosDashboard;
        return <Component />;
    }, [pathname]);

    return (
        <Layout className={`layout-container ${theme} ${sidebarCollapsed ? '' : 'sidebar-expanded'}`}>
            <Sidebar />
            <Layout className="content-area">
                <Navbar fixed />
                <Content>
                    <RouteTransition>
                        {currentComponent}
                    </RouteTransition>
                </Content>
            </Layout>
        </Layout>
    );
}
