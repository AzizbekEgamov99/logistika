import {
    DashboardOutlined,
    ToolOutlined,
    CarOutlined,
    ContainerOutlined,
    ThunderboltOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
    {
        key: '/modules/zaphos',
        icon: <DashboardOutlined />,
        label: 'Dashboard'
    },
    {
        key: '/modules/zaphos/texnic',
        icon: <ToolOutlined />,
        label: 'Texnik xizmat'
    },
    {
        key: '/modules/zaphos/optol',
        icon: <ThunderboltOutlined />,
        label: 'Yoqilg\'i (Optol)'
    },
    {
        key: '/modules/zaphos/balon',
        icon: <SettingOutlined />,
        label: 'Balonlar'
    },
    {
        key: '/modules/zaphos/cars',
        icon: <CarOutlined />,
        label: 'Mashinalar'
    },
    {
        key: '/modules/zaphos/furgon',
        icon: <ContainerOutlined />,
        label: 'Furgonlar'
    },
];
