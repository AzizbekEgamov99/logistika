'use client';
import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Dashboard } from '../pages/Dashboard';
import { DriversPage } from '../pages/Drivers';
import { ClientsPage } from '../pages/Clients';
import Navbar from '../components/Navbar/Navbar';
import dynamic from 'next/dynamic';
import '../styles/global.css';
import '../styles/Navbar.css';
import '../styles/Sidebar.css';
import CarsPage from '../pages/Cars';
import AllCarsPage from '../pages/Cars/pages/AllCars/AllCarsPage';
import RoadCars from '../pages/Cars/pages/RoadCars/RoadCars';
import AvailableCars from '../pages/Cars/pages/AvailableCars/AvailableCars';
import CarHistoryPage from '../pages/Cars/pages/CarHistory/CarHistoryPage';
import MaintenancePage from '../pages/Maintenance';
import FurgonPage from '../pages/Furgon';
import FreightDeliveryPage from '../pages/FreightDelivery';
import TripHistoryPage from '../pages/TripHistoryPage/index';
import KassaPage from '../pages/Kassa';
import DriverSalaryPage from '../pages/DriverSalary';
import RouteTransition from '@/components/RouteTransition';

const { Content } = Layout;

interface RouteComponents {
    [key: string]: React.ComponentType;
}

const ClientHistoryPage = dynamic(
    () => import('../pages/Clients/components/ClientHistoryPage'),
    { ssr: false }
);

const ROUTES: RouteComponents = {
    '/accounting': Dashboard,
    '/accounting/transactions': DriversPage,
    '/accounting/clients': ClientsPage,
    '/accounting/cars': CarsPage,
    '/accounting/cars/allpage': AllCarsPage,
    '/accounting/cars/roadcars': RoadCars,
    '/accounting/cars/availablecars': AvailableCars,
    '/accounting/cars/:id/history': CarHistoryPage,
    '/accounting/maintenance': MaintenancePage,
    '/accounting/furgon': FurgonPage,
    '/accounting/freight': FreightDeliveryPage,
    '/accounting/triphistory': TripHistoryPage,
    '/accounting/clients/:id/history': ClientHistoryPage,
    '/accounting/kassa': KassaPage,
    '/accounting/driversalary': DriverSalaryPage,
    // '/accounting/drivers/:id/history': DriverHistoryPage,
};

export function AccountingLayout() {
    const pathname = usePathname();
    const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.settings);

    // Optimize component selection with useMemo
    const currentComponent = useMemo(() => {
        const path = pathname.replace('/modules', '');

        if (path.match(/^\/accounting\/clients\/\d+\/history$/)) {
            return <ClientHistoryPage />;
        }

        if (path.match(/^\/accounting\/cars\/\d+\/history$/)) {
            return <CarHistoryPage />;
        }

        const Component = ROUTES[path] || Dashboard;
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