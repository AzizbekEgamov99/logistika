import React from 'react';
import { Modal, List, Badge, Button, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { markAsRead, clearAll } from '../../../store/slices/notificationsSlice';
import { RootState } from '@/store/store';
import styles from './NotificationsModal.module.css';

interface NotificationsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notifications.items);

    const handleMarkAsRead = (id: string) => {
        dispatch(markAsRead(id));
    };

    const handleClearAll = () => {
        dispatch(clearAll());
    };

    return (
        <Modal
            title="Notifications"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="clear" onClick={handleClearAll} disabled={notifications.length === 0}>
                    Clear All
                </Button>
            ]}
            width={400}
            className={styles.notificationsModal}
        >
            <div className={styles.notificationsContainer}>
                {notifications.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={notifications as Notification[]}
                        renderItem={(item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <List.Item 
                                    className={`${styles.notificationItem} ${!item.read ? styles.unread : ''}`}
                                    onClick={() => handleMarkAsRead(item.id)}
                                >
                                    <List.Item.Meta
                                        title={
                                            <div className={styles.notificationTitle}>
                                                {!item.read && <Badge status="processing" />}
                                                {item.title}
                                            </div>
                                        }
                                        description={item.message}
                                    />
                                    <div className={styles.notificationTime}>
                                        {new Date(item.createdAt).toLocaleTimeString()}
                                    </div>
                                </List.Item>
                            </motion.div>
                        )}
                    />
                ) : (
                    <Empty description="No notifications" />
                )}
            </div>
        </Modal>
    );
};

export default NotificationsModal;