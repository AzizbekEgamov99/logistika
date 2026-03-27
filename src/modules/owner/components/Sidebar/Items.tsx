import {
    DashboardOutlined,
    DollarCircleOutlined,
    CarOutlined,
    ContainerOutlined,
    TeamOutlined,
    BarChartOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
    {
        key: '/modules/owner',
        icon: <DashboardOutlined />,
        label: 'Dashboard'
    },
    {
        key: '/modules/owner/finance',
        icon: <DollarCircleOutlined />,
        label: 'Moliya'
    },
    {
        key: '/modules/owner/cars',
        icon: <CarOutlined />,
        label: 'Mashinalar'
    },
    {
        key: '/modules/owner/furgon',
        icon: <ContainerOutlined />,
        label: 'Furgonlar'
    },
    {
        key: '/modules/owner/drivers',
        icon: <TeamOutlined />,
        label: 'Haydovchilar'
    },
    {
        key: '/modules/owner/reports',
        icon: <BarChartOutlined />,
        label: 'Hisobotlar'
    },
    {
        key: '/modules/owner/debts',
        icon: <FileTextOutlined />,
        label: 'Qarzlar'
    },
];
