import React, { useState } from 'react';
import { Avatar, Dropdown, Modal, Form, Input, Button, message } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import { UserOutlined, LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const Profile: React.FC = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const items: MenuProps['items'] = [
        {
            key: '1',
            icon: <KeyOutlined />,
            label: 'Parolni o\'zgartirish'
        },
        {
            key: '2',
            icon: <LogoutOutlined />,
            label: 'Chiqish',
            danger: true
        }
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1') {
            setPasswordModalVisible(true);
        } else if (e.key === '2') {
            // Logout
            localStorage.removeItem('token'); // Clear auth token
            router.push('/login');
        }
    };

    const handlePasswordChange = (values: any) => {
        console.log('Changing password:', values);
        setLoading(true);
        
        // For demonstration, using a simple timeout to simulate API call
        setTimeout(() => {
            // Success notification
            message.success('Parol muvaffaqiyatli o\'zgartirildi!');
            setPasswordModalVisible(false);
            form.resetFields();
            setLoading(false);
        }, 1000);
        
        // Note: In production, implement actual API call here:
        // api.changePassword(values)
        //    .then(() => {
        //        message.success('Parol muvaffaqiyatli o\'zgartirildi!');
        //        setPasswordModalVisible(false);
        //        form.resetFields();
        //    })
        //    .catch(error => {
        //        message.error('Xatolik yuz berdi: ' + error.message);
        //    })
        //    .finally(() => {
        //        setLoading(false);
        //    });
    };

    return (
        <>
            <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Avatar icon={<UserOutlined />} className="user-avatar" />
                </motion.div>
            </Dropdown>

            <Modal
                title="Parolni o'zgartirish"
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
                destroyOnHidden
                forceRender={true}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                    preserve={false}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Joriy parol"
                        rules={[{ required: true, message: 'Joriy parolni kiriting' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Yangi parol"
                        rules={[
                            { required: true, message: 'Yangi parolni kiriting' },
                            { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Yangi parolni tasdiqlang"
                        rules={[
                            { required: true, message: 'Yangi parolni tasdiqlang' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Yangi parollar mos kelmadi'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Parolni o'zgartirish
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Profile;
