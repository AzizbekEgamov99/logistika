import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Row, Col } from 'antd';
import { CurrencyFormValues, Currency } from '../types/currency';

interface CurrencyFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CurrencyFormValues) => Promise<boolean>;
  initialValues?: Currency;
  title?: string;
  loading?: boolean;
}

const CurrencyForm: React.FC<CurrencyFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title = 'Valyuta qo\'shish',
  loading = false
}) => {
  const [form] = Form.useForm();

  // Reset form fields when modal is opened/closed or initialValues change
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          currency: initialValues.currency,
          rate_to_uzs: initialValues.rate_to_uzs,
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await onSubmit(values);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      forceRender={true}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Bekor qilish
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit} 
          loading={loading}
        >
          Saqlash
        </Button>
      ]}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          currency: initialValues?.currency || '',
          rate_to_uzs: initialValues?.rate_to_uzs || '', 
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="currency"
              label="Valyuta kodi"
              rules={[
                { required: true, message: 'Valyuta kodini kiriting!' },
                { max: 3, message: 'Valyuta kodi 3 ta belgidan oshmasligi kerak!' }
              ]}
            >
              <Input 
                placeholder="Masalan: USD" 
                maxLength={3} 
                onChange={(e) => {
                  form.setFieldsValue({ currency: e.target.value.toUpperCase() });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="rate_to_uzs"
              label="So'mga nisbatan kursi"
              rules={[
                { required: true, message: 'Kursni kiriting!' },
                { 
                  pattern: /^[0-9]+(\.[0-9]{1,2})?$/, 
                  message: 'Faqat raqam va nuqta kiritishingiz mumkin (masalan: 12000.50)!' 
                }
              ]}
            >
              <Input placeholder="Masalan: 12000.50" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CurrencyForm; 