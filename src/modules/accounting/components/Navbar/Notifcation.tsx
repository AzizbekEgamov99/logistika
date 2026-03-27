import React, { useState } from 'react';
import NotificationsModal from './Notifications/NotificationsModal';
import { BellOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Notification: React.FC = () => {
    const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
    const [notificationsVisible, setNotificationsVisible] = useState(false);

    return (
        <>
            <Badge count={unreadCount} overflowCount={99}>
                <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <BellOutlined 
                        className="nav-icon" 
                        onClick={() => setNotificationsVisible(true)}
                    />
                </motion.span>
            </Badge>
            
            <NotificationsModal 
                visible={notificationsVisible} 
                onClose={() => setNotificationsVisible(false)}
            />
        </>
    );
};

export default Notification;