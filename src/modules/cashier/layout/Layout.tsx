'use client';
import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Sidebar } from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import CashierDashboard from '../pages/Dashboard/Dashboard';
import TransactionsPage from '../pages/Transactions';
import PendingPage from '../pages/Pending';
import ViaDriverPage from '../pages/ViaDriver';
import DebtsPage from '../pages/Debts';
import HistoryPage from '../pages/History';

import RouteTransition from '@/components/RouteTransition';
import '../styles/global.css';
import '@/modules/accounting/styles/Navbar.css';
import '@/modules/accounting/styles/Sidebar.css';

const { Content } = Layout;

interface RouteComponents {
    [key: string]: React.ComponentType;
}

const ROUTES: RouteComponents = {
    '/cashier': CashierDashboard,
    '/cashier/transactions': TransactionsPage,
    '/cashier/pending': PendingPage,
    '/cashier/via-driver': ViaDriverPage,
    '/cashier/debts': DebtsPage,
    '/cashier/history': HistoryPage,
};

export function CashierLayout() {
    const pathname = usePathname();
    const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.settings);

    const currentComponent = useMemo(() => {
        const path = pathname.replace('/modules', '');
        const Component = ROUTES[path] || CashierDashboard;
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
