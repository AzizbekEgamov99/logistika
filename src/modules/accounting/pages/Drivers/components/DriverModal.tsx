import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, Alert, message } from 'antd';
import {  UserOutlined, PhoneOutlined, LockOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { DriverType } from '../../../types/driver';
import axiosInstance from "../../../../../api/axiosInstance";
import { API_URLS } from "../../../../../api/apiConfig";
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import Image from 'next/image';
import { getDriverPhotoUrl } from '../photoUtils';

const { Option } = Select;

interface DriverModalProps {
    visible: boolean;
    mode: 'create' | 'edit';
    driver: DriverType | null;
    onClose: () => void;
    onSubmit: (values: FormData) => Promise<void>;
}

const DriverModal: React.FC<DriverModalProps> = ({
    visible,
    mode,
    driver,
    onClose,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [fetchingStatus, setFetchingStatus] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    
    // Fetch status options from backend
    useEffect(() => {
        if (visible) {
            fetchStatusOptions();
        }
    }, [visible]);
    
    // Set initial values including image if available
    useEffect(() => {
        form.resetFields();
        setError(null);
        setPhotoFile(null);
        
        if (mode === 'edit' && driver) {
            form.setFieldsValue({
                fullname: driver.fullname,
                username: driver.username,
                phone_number: driver.phone_number,
                status: driver.status,
                // Don't set password for edit mode
            });
            
            // Set image URL if driver has a photo
            if (driver.photo) {
                setImageUrl(getDriverPhotoUrl(driver.photo));
            } else {
                setImageUrl(null);
            }
        } else {
            // Default values for create mode
            form.setFieldsValue({
                status: 'driver',
            });
            setImageUrl(null);
        }
    }, [form, mode, driver, visible]);
    
    // Get status options from backend
    const fetchStatusOptions = async () => {
        try {
            setFetchingStatus(true);
            
            // Check if there's a template response from the backend
            const response = await axiosInstance.get(`${API_URLS.drivers}template/`);
            
            if (response.data && response.data.status) {
                // If the API returns a template with status options
                const options = Array.isArray(response.data.status) 
                    ? response.data.status 
                    : [response.data.status];
                    
                setStatusOptions(options);
                console.log('Status options from API:', options);
            }
        } catch (error) {
            console.error('Error fetching status options:', error);
            // Fallback to default options if API fails
            setStatusOptions(['driver', 'owner', 'ceo', 'bugalter', 'zaphos']);
        } finally {
            setFetchingStatus(false);
        }
    };
    
    // Handle image before upload
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
        
        // Don't automatically upload
        return false;
    };
    
    // Handle image change
    const handleImageChange: UploadProps['onChange'] = (info) => {
        if (info.file instanceof File) {
            setImageLoading(true);
            setPhotoFile(info.file);
            
            // Read file as data URL to display preview
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result as string);
                setImageLoading(false);
            };
            reader.readAsDataURL(info.file);
        } else if (info.file.originFileObj instanceof File) {
            // Handle Ant Design Upload component format
            const file = info.file.originFileObj;
            setImageLoading(true);
            setPhotoFile(file);
            
            // Read file as data URL to display preview
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result as string);
                setImageLoading(false);
            };
            reader.readAsDataURL(file);
            console.log('Setting photo file from originFileObj:', file.name);
        }
    };
    
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate form
            const values = await form.validateFields();
            
            // Create FormData object to handle file upload
            const formData = new FormData();
            
            // Add text fields to FormData
            formData.append('fullname', values.fullname);
            
            // If username is not provided, use phone number
            if (!values.username && values.phone_number) {
                values.username = values.phone_number.replace(/\D/g, '');
            }
            formData.append('username', values.username);
            
            // Handle password for both create and edit modes
            if (mode === 'create') {
                // For create mode, if password is not provided, use phone number
                const password = values.password || values.phone_number.replace(/\D/g, '');
                formData.append('password', password);
            } else if (values.password) {
                // For edit mode, only include password if it's provided
                formData.append('password', values.password);
            }
            
            formData.append('phone_number', values.phone_number);
            formData.append('status', values.status);
            
            // Add photo file if selected
            if (photoFile) {
                console.log('Adding photo to FormData. File info:', {
                    name: photoFile.name,
                    size: photoFile.size,
                    type: photoFile.type,
                    lastModified: new Date(photoFile.lastModified).toISOString()
                });
                formData.append('photo', photoFile, photoFile.name);
                
                // Verify photo is in FormData
                console.log('Verifying photo in FormData:', formData.has('photo'));
                const photoInForm = formData.get('photo');
                console.log('Retrieved photo from FormData:', 
                    photoInForm instanceof File ? 
                    `File: ${photoInForm.name} (${photoInForm.size} bytes)` : 
                    String(photoInForm)
                );
            }
            
            // Log form data entries for debugging
            console.log('FormData entries:');
            for (const pair of formData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'File: ' + pair[1].name : pair[1]));
            }
            
            // Submit form
            await onSubmit(formData);
            
            // Close modal on success
            form.resetFields();
            setImageUrl(null);
            setPhotoFile(null);
        } catch (err) {
            console.error("Form submission error:", err);
            setError(err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };
    
    // Render status options
    const renderStatusOptions = () => {
        // If we're still loading status options
        if (fetchingStatus) {
            return <Option value="">Yuklanmoqda...</Option>;
        }
        
        // Map through available status options from API
        return statusOptions.map((status, index) => (
            <Option key={index} value={status}>
                {getStatusLabel(status)}
            </Option>
        ));
    };
    
    // Get readable status label
    const getStatusLabel = (status) => {
        const statusLabels = {
            'driver': 'Haydovchi',
            'owner': 'Egasi',
            'ceo': 'CEO',
            'bugalter': 'Bugalter',
            'zaphos': 'Zaphos'
        };
        
        return statusLabels[status] || status;
    };
    
    // Upload button
    const uploadButton = (
        <div>
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Rasm yuklash</div>
        </div>
    );
    
    // Password field is required for create mode, optional for edit
    const getPasswordRules = () => {
        if (mode === 'create') {
            return [{ required: false, message: 'Parol kiriting' }];
        }
        return [{ required: false, message: 'Parolni o\'zgartirish uchun yangi parolni kiriting' }];
    };
    
    return (
        <Modal
            title={mode === "create" ? "Yangi haydovchi qo'shish" : "Haydovchini tahrirlash"}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Bekor qilish
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleSubmit}
                    loading={loading}
                >
                    {mode === "create" ? "Qo'shish" : "Saqlash"}
                </Button>
            ]}
            width={600}
            forceRender={true}
        >
            {error && (
                <Alert
                    message="Xatolik"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                    onClose={() => setError(null)}
                />
            )}
            
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="Rasm"
                    name="photo"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e?.fileList;
                    }}
                >
                    <Upload
                        name="photo"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleImageChange}
                        customRequest={({  onSuccess }) => {
                            setTimeout(() => {
                                onSuccess?.("ok");
                            }, 0);
                        }}
                    >
                        {imageUrl ? 
                            <Image 
                                src={imageUrl} 
                                alt="avatar" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            /> : uploadButton}
                    </Upload>
                </Form.Item>
                
                <Form.Item
                    label="F.I.O"
                    name="fullname"
                    rules={[{ required: true, message: "F.I.O ni kiriting!" }]}
                >
                    <Input 
                        placeholder="Haydovchi F.I.O" 
                        prefix={<UserOutlined />} 
                    />
                </Form.Item>
                
                <Form.Item
                    label="Foydalanuvchi nomi"
                    name="username"
                    extra="Bo'sh qoldirilsa telefon raqami ishlatiladi"
                >
                    <Input placeholder="Foydalanuvchi nomi" />
                </Form.Item>
                
                <Form.Item
                    label="Telefon raqami"
                    name="phone_number"
                    rules={[
                        { required: true, message: "Telefon raqamini kiriting!" },
                        { 
                            pattern: /^\+?[0-9]{9,15}$/, 
                            message: "Telefon raqami noto'g'ri formatda" 
                        }
                    ]}
                >
                    <Input 
                        placeholder="+998XXXXXXXXX" 
                        prefix={<PhoneOutlined />}
                    />
                </Form.Item>
                
                <Form.Item
                    label="Parol"
                    name="password"
                    rules={getPasswordRules()}
                    extra={mode === 'create' ? "Bo'sh qoldirilsa telefon raqami ishlatiladi" : "Yangi parol kiriting yoki bo'sh qoldiring"}
                >
                    <Input.Password 
                        placeholder={mode === 'create' ? "Parolni kiriting" : "Yangi parol kiriting"}
                        prefix={<LockOutlined />}
                    />
                </Form.Item>
                
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Statusni tanlang!" }]}
                >
                    <Select placeholder="Status tanlang">
                        {renderStatusOptions()}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DriverModal;