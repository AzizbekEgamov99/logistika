import { Layout } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Dashboard } from '../components/Dashboard';
import { RoadExpenses } from '../components/expenses/RoadExpenses';
import { PostExpenses } from '../components/expenses/PostExpenses';
import { FuelExpenses } from '../components/expenses/FuelExpenses';
import { OilExpenses } from '../components/expenses/OilExpenses';
import { RoadApplications } from '../components/applications/RoadApplications';
import { AdditionalApplications } from '../components/applications/AdditionalApplications';

const { Content } = Layout;

const ROUTES = {
    '/modules/driver': {
        component: Dashboard,
        title: 'Asosiy Panel',
        breadcrumb: ['Asosiy']
    },
    '/modules/driver/expenses/road': {
        component: RoadExpenses,
        title: "Yo'l chiqimlari",
        breadcrumb: ['Chiqimlar', "Yo'l chiqimlari"]
    },
    '/modules/driver/expenses/post': {
        component: PostExpenses,
        title: 'Post chiqimlari',
        breadcrumb: ['Chiqimlar', 'Post chiqimlari']
    },
    '/modules/driver/expenses/fuel': {
        component: FuelExpenses,
        title: 'Zapravka chiqimlari',
        breadcrumb: ['Chiqimlar', 'Zapravka chiqimlari']
    },
    '/modules/driver/expenses/oil': {
        component: OilExpenses,
        title: 'Moy chiqimlari',
        breadcrumb: ['Chiqimlar', 'Moy chiqimlari']
    },
    '/modules/driver/applications/road': {
        component: RoadApplications,
        title: "Yo'l chiqimi arizalari",
        breadcrumb: ['Arizalar', "Yo'l chiqimi bo'yicha"]
    },
    '/modules/driver/applications/additional': {
        component: AdditionalApplications,
        title: "Qo'shimcha arizalar",
        breadcrumb: ['Arizalar', "Qo'shimcha"]
    }
};

export function DriverLayout() {
    const pathname = usePathname();
    const getCurrentComponent = () => {
        const route = ROUTES[pathname as keyof typeof ROUTES] || ROUTES['/modules/driver'];
        const Component = route.component;
        return {
            component: <Component />,
            title: route.title,
            breadcrumb: route.breadcrumb
        };
    };

    const current = getCurrentComponent();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout style={{ background: '#f0f2f5' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Content style={{ padding: '24px', maxWidth: '1368px', margin: '0 auto' }}>
                            {current.component}
                        </Content>
                    </motion.div>
                </AnimatePresence>
            </Layout>
        </Layout>
    );
}