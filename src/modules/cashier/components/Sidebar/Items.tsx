import {
    DashboardOutlined,
    WalletOutlined,
    TeamOutlined,
    SwapOutlined,
    FileTextOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
    {
        key: '/modules/cashier',
        icon: <DashboardOutlined />,
        label: 'Dashboard'
    },
    {
        key: '/modules/cashier/transactions',
        icon: <SwapOutlined />,
        label: 'Tranzaksiyalar'
    },
    {
        key: '/modules/cashier/pending',
        icon: <WalletOutlined />,
        label: 'Tasdiqlanmagan'
    },
    {
        key: '/modules/cashier/via-driver',
        icon: <TeamOutlined />,
        label: 'Haydovchi orqali'
    },
    {
        key: '/modules/cashier/debts',
        icon: <FileTextOutlined />,
        label: 'Qarzlar'
    },
    {
        key: '/modules/cashier/history',
        icon: <DollarOutlined />,
        label: 'Kassa tarixi'
    },
];
