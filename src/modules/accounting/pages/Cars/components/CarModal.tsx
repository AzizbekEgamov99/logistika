import React from 'react';
import { Modal, Form, Input, Select, Upload, message, Image } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import type { Car } from '../../../types/car';
import styles from './CarModal.module.css';
import { formatImageUrl } from '@/api/axiosInstance';

interface CarModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: FormData) => Promise<void>;
    initialValues?: Car | null;
    isView?: boolean;
}

const CarModal: React.FC<CarModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    isView = false
}) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = React.useState<string>();
    const [loading, setLoading] = React.useState(false);
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);

    React.useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                ...initialValues,
                // Don't set photo in form data
            });
            
            if (initialValues.photo && typeof initialValues.photo === 'string') {
                setImageUrl(formatImageUrl(initialValues.photo) || undefined);
            }
        } else if (!visible) {
            form.resetFields();
            setImageUrl(undefined);
            setPhotoFile(null);
        }
    }, [visible, initialValues, form]);

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Faqat JPG/PNG formatdagi rasmlar qabul qilinadi!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Rasm hajmi 2MB dan kichik bo\'lishi kerak!');
            return false;
        }
        return false;
    };

    const handleImageChange = (info: any) => {
        if (info.file instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target?.result as string);
            };
            reader.readAsDataURL(info.file);
            
            // Store the file in state instead of form
            console.log('Setting photo file:', info.file.name);
            setPhotoFile(info.file);
        } else if (info.file.originFileObj instanceof File) {
            // Handle Ant Design Upload component format which uses originFileObj
            const file = info.file.originFileObj;
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            
            // Store the file in state
            console.log('Setting photo file from originFileObj:', file.name);
            setPhotoFile(file);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            // Create FormData object
            const formData = new FormData();
            
            // Ensure all required fields are present with non-empty values
            const fieldsToSubmit = {
                name: values.name,
                number: values.number,
                year: values.year,
                engine: values.engine,
                transmission: values.transmission,
                power: values.power,
                capacity: values.capacity,
                fuel: values.fuel || 'benzin',
                mileage: values.mileage || '0',
                kilometer: values.mileage || '0',
                car_number: values.car_number,
                holat: values.holat || 'foal',
                driver: values.driver || 1
            };
            
            // Add all form values to FormData
            Object.entries(fieldsToSubmit).forEach(([key, value]) => {
                // Ensure value is a non-empty string
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                } else {
                    throw new Error(`Field ${key} cannot be empty`);
                }
            });
            
            // Add photo if available from state
            if (photoFile) {
                console.log('Adding photo to FormData. File info:', {
                    name: photoFile.name,
                    size: photoFile.size,
                    type: photoFile.type,
                    lastModified: new Date(photoFile.lastModified).toISOString()
                });
                formData.append('photo', photoFile, photoFile.name);
                console.log('Photo added to FormData with name:', photoFile.name);
                
                // Verify photo is in FormData
                console.log('Verifying photo in FormData:', formData.has('photo'));
                const photoInForm = formData.get('photo');
                console.log('Retrieved photo from FormData:', 
                    photoInForm instanceof File ? 
                    `File: ${photoInForm.name} (${photoInForm.size} bytes)` : 
                    String(photoInForm)
                );
            } else {
                console.warn('No photo file available to add to FormData');
            }
            
            // Log all FormData entries for debugging
            console.log('FormData entries:');
            for (const pair of formData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'File: ' + pair[1].name : pair[1]));
            }
            
            // Call onSubmit with the formData
            await onSubmit(formData);
            form.resetFields();
            setImageUrl(undefined);
            setPhotoFile(null);
        } catch (error) {
            console.error('Form validation failed:', error);
            message.error('Forma tekshirishda xatolik: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={isView ? "Transport ma'lumotlari" : (initialValues ? "Transportni tahrirlash" : "Yangi transport qo'shish")}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={isView ? "Yopish" : "Saqlash"}
            cancelText="Bekor qilish"
            confirmLoading={loading}
            okButtonProps={{ style: { display: isView ? 'none' : 'inline' } }}
            width={800}
            className={styles.carModal}
            forceRender={true}
        >
            <Form
                form={form}
                layout="vertical"
                disabled={isView}
                className={styles.carForm}
                onFinish={handleSubmit}
            >
                <div className={styles.formGrid}>
                    <Form.Item
                        label="Rasm"
                        name="photoUpload" // Changed from 'photo' to avoid circular references
                        className={styles.uploadItem}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                        rules={[{ required: !initialValues?.id && !photoFile, message: "Rasm tanlang!" }]}
                    >
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleImageChange}
                            customRequest={({  onSuccess }) => {
                                setTimeout(() => {
                                    onSuccess?.("ok");
                                }, 0);
                            }}
                            maxCount={1}
                        >
                            {imageUrl ? (
                                <Image 
                                    src={imageUrl} 
                                    alt="car" 
                                    width={100}
                                    height={100}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }} 
                                />
                            ) : (
                                <div style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <CarOutlined style={{ fontSize: '32px', color: '#999', marginBottom: 8 }} />
                                    <div>Rasm yuklash</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Transport nomi"
                        rules={[{ required: true, message: 'Iltimos, transport nomini kiriting' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="car_number"
                        label="Davlat raqami"
                        rules={[{ required: true, message: 'Iltimos, davlat raqamini kiriting' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="number"
                        label="Model"
                        rules={[{ required: true, message: 'Iltimos, modelni kiriting' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="year"
                        label="Ishlab chiqarilgan yili"
                        rules={[{ required: true, message: "Yilni kiriting!" }]}
                    >
                        <Input placeholder="Yilni kiriting" type="number" />
                    </Form.Item>

                    <Form.Item
                        name="engine"
                        label="Dvigatel"
                        rules={[{ required: true, message: "Dvigatel hajmini kiriting!" }]}
                    >
                        <Input placeholder="Dvigatel hajmini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="transmission"
                        label="Transmissiya"
                        rules={[{ required: true, message: "Transmissiyani tanlang!" }]}
                    >
                        <Select placeholder="Transmissiyani tanlang">
                            <Select.Option value="manual">Mexanika</Select.Option>
                            <Select.Option value="automatic">Avtomat</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="power"
                        label="Quvvati"
                        rules={[{ required: true, message: "Quvvatini kiriting!" }]}
                    >
                        <Input placeholder="Quvvatini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="capacity"
                        label="Sig'imi"
                        rules={[{ required: true, message: "Sig'imini kiriting!" }]}
                    >
                        <Input placeholder="Sig'imini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="fuel"
                        label="Yoqilg'i turi"
                        initialValue="benzin"
                        rules={[{ required: true, message: "Yoqilg'i turini tanlang!" }]}
                    >
                        <Select placeholder="Yoqilg'i turini tanlang">
                            <Select.Option value="benzin">Benzin</Select.Option>
                            <Select.Option value="diesel">Dizel</Select.Option>
                            <Select.Option value="gas">Gaz</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="mileage"
                        label="Yurish masofa"
                        initialValue="0"
                        rules={[{ required: true, message: "Yurish masofasini kiriting!" }]}
                    >
                        <Input placeholder="Yurish masofasini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="holat"
                        label="Holati"
                        initialValue="foal"
                        rules={[{ required: true, message: "Holatini tanlang!" }]}
                    >
                        <Select placeholder="Holatini tanlang">
                            <Select.Option value="foal">Faol</Select.Option>
                            <Select.Option value="tamirda">Ta`mirda</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="driver"
                        hidden
                        initialValue={1}
                    >
                        <Input type="hidden" />
                    </Form.Item>
                </div>
                
                {!isView && (
                    <Form.Item style={{ display: 'none' }}>
                        <button type="submit"></button>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default CarModal;