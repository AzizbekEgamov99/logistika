import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Typography } from 'antd';

const { Text } = Typography;

interface LogoProps {
    collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
    return (
        <Link href="/modules/cashier" className="logo-link">
            <motion.div
                className={`logo ${collapsed ? 'collapsed' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {!collapsed && (
                    <Text strong className="logo-text">
                        RBL<span className="highlight">LOGISTICS</span>
                    </Text>
                )}
                
                {collapsed && (
                    <Text strong className="logo-text-small">
                        <span className="highlight">BT</span>
                    </Text>
                )}
            </motion.div>
        </Link>
    );
}

export default Logo;
