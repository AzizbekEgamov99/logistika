import React from 'react';
import { Drawer, Form, Input, Select, Button, Space } from 'antd';
import { Car } from '../../../types/car.types';
import { useCars } from '../../../hooks/useCars';

interface CarDrawerProps {
    open: boolean;
    onClose: () => void;
    editingCar?: Car;
}

export const CarDrawer: React.FC<CarDrawerProps> = ({ open, onClose, editingCar }) => {
    const [form] = Form.useForm();
    const { createCar, updateCar, isCreating, isUpdating } = useCars();

    React.useEffect(() => {
        if (editingCar) {
            form.setFieldsValue(editingCar);
        } else {
            form.resetFields();
        }
    }, [editingCar, form]);

    const onFinish = async (values: any) => {
        try {
            if (editingCar?.id) {
                await updateCar({ ...values, id: editingCar.id });
            } else {
                await createCar(values);
            }
            onClose();
            form.resetFields();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };
    return (
        <Drawer
            title={editingCar ? "Avtomobilni tahrirlash" : "Yangi avtomobil qo'shish"}
            width={420}
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Bekor qilish</Button>
                    <Button 
                        type="primary" 
                        onClick={form.submit}
                        loading={isCreating || isUpdating}
                    >
                        {editingCar ? "Saqlash" : "Qo'shish"}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label="Nomi"
                    rules={[{ required: true, message: 'Nomini kiriting' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    name="number"
                    label="Raqami"
                    rules={[{ required: true, message: 'Raqamini kiriting' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="year"
                    label="Yili"
                    rules={[{ required: true, message: 'Yilini kiriting' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="engine"
                    label="Dvigatel"
                    rules={[{ required: true, message: 'Dvigatel hajmini kiriting' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="transmission"
                    label="Transmission"
                    rules={[{ required: true, message: 'Transmissionni tanlang' }]}
                >
                    <Select>
                        <Select.Option value="manual">Manual</Select.Option>
                        <Select.Option value="automatic">Automatic</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="power"
                    label="Quvvati"
                    rules={[{ required: true, message: 'Quvvatini kiriting' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="capacity"
                    label="Sig'imi"
                    rules={[{ required: true, message: "Sig'imini kiriting" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="fuel"
                    label="Yoqilg'i turi"
                    rules={[{ required: true, message: "Yoqilg'i turini tanlang" }]}
                >
                    <Select>
                        <Select.Option value="benzin">Benzin</Select.Option>
                        <Select.Option value="diesel">Diesel</Select.Option>
                        <Select.Option value="gas">Gas</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="mileage"
                    label="Probeg"
                    rules={[{ required: true, message: 'Probegni kiriting' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="car_number"
                    label="Davlat raqami"
                    rules={[{ required: true, message: 'Davlat raqamini kiriting' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    );
}; 