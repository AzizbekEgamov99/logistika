import { message } from "antd";

export const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Faqat JPG/PNG formatdagi rasmlar qo`llab-quvvatlanadi!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Rasm hajmi 2MB dan kichik bo`lishi kerak!');
    }
    return isJpgOrPng && isLt2M;
}; 