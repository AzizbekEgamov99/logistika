'use client';
import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Sidebar } from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import OwnerDashboard from '../pages/Dashboard/Dashboard';
import FinancePage from '../pages/Finance';
import CarsPage from '../pages/Cars';
import FurgonPage from '../pages/Furgon';
import DriversPage from '../pages/Drivers';
import ReportsPage from '../pages/Reports';
import DebtsPage from '../pages/Debts';

import RouteTransition from '@/components/RouteTransition';
import '../styles/global.css';
import '@/modules/accounting/styles/Navbar.css';
import '@/modules/accounting/styles/Sidebar.css';

const { Content } = Layout;

interface RouteComponents {
    [key: string]: React.ComponentType;
}

const ROUTES: RouteComponents = {
    '/owner': OwnerDashboard,
    '/owner/finance': FinancePage,
    '/owner/cars': CarsPage,
    '/owner/furgon': FurgonPage,
    '/owner/drivers': DriversPage,
    '/owner/reports': ReportsPage,
    '/owner/debts': DebtsPage,
};

export function OwnerLayout() {
    const pathname = usePathname();
    const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.settings);

    const currentComponent = useMemo(() => {
        const path = pathname.replace('/modules', '');
        const Component = ROUTES[path] || OwnerDashboard;
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
