import {
    DashboardOutlined,
    CarOutlined,
    UserOutlined,
    ContainerOutlined,
    HistoryOutlined,
    ToolOutlined,
    PlusCircleOutlined,
    TeamOutlined,
    WalletOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export interface MenuGroup {
    title?: string;
    items: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        key: '/modules/accounting',
        icon: <DashboardOutlined />,
        label: 'Dashboard'
    },
    {
        key: '/modules/accounting/transactions',
        icon: <TeamOutlined />,
        label: 'Haydovchilar'
    },
    {
        key: '/modules/accounting/driversalary',
        icon: <DollarOutlined />,
        label: 'Haydovchi to\'lovlari'
    },
    {
        key: '/modules/accounting/clients',
        icon: <UserOutlined />,
        label: 'Mijozlar'
    },
    {
        key: '/modules/accounting/cars',
        icon: <CarOutlined />,
        label: 'Mashinalar'
    },
    {
        key: '/modules/accounting/furgon',
        icon: <ContainerOutlined />,
        label: 'Furgon'
    },
    {
        key: '/modules/accounting/freight',
        icon: <PlusCircleOutlined />,
        label: 'Reyslar'
    },
    {
        key: '/modules/accounting/triphistory',
        icon: <HistoryOutlined />,
        label: 'Reyslar tarixi'
    },
    {
        key: '/modules/accounting/maintenance',
        icon: <ToolOutlined />,
        label: 'Texnik xizmat'
    },
    {
        key: '/modules/accounting/kassa',
        icon: <WalletOutlined />,
        label: 'Kassa'
    }
];

// Organize menu items into logical groups
export const getMenuGroups = (): MenuGroup[] => {
    return [
        {
            title: 'Asosiy',
            items: [
                menuItems[0], // Dashboard
                menuItems[8], // Kassa
            ]
        },
        {
            title: 'Boshqaruv',
            items: [
                menuItems[1], // Haydovchilar
                menuItems[2], // Mijozlar
                menuItems[3], // Mashinalar
                menuItems[4], // Furgon
            ]
        },
        {
            title: 'Reyslar',
            items: [
                menuItems[5], // Reyslar
                menuItems[6], // Reyslar tarixi
                menuItems[7], // Umumiy yuklar
            ]
        },
    ];
};