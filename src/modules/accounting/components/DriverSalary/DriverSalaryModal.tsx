import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message, InputNumber, Spin } from 'antd';
import { useDrivers } from '../../hooks/useDrivers';
import { useDriverSalaries } from '../../hooks/useDriverSalary';
import { useCurrencies } from '../../hooks/useCurrencies';
import { DriverSalary } from '../../types/driverSalary';

const { Option } = Select;

interface DriverSalaryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingRecord?: DriverSalary | null;
}

const DriverSalaryModal: React.FC<DriverSalaryModalProps> = ({
  visible,
  onClose,
  onSuccess,
  editingRecord
}) => {
  const [form] = Form.useForm();
  const { drivers } = useDrivers();
  const { createDriverSalary, updateDriverSalary } = useDriverSalaries();
  const { currencies, loading: currenciesLoading, error: currenciesError } = useCurrencies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editingRecord;

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      return;
    }

    if (isEditMode && editingRecord) {
      form.setFieldsValue({
        driver: editingRecord.driver,
        amount: Number(editingRecord.amount),
        currency: editingRecord.currency
      });
    } else {
      form.resetFields();
      if (currencies.length > 0) {
        form.setFieldsValue({ currency: currencies[0].id });
      }
    }
  }, [visible, form, editingRecord, isEditMode, currencies]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      if (!values.driver || values.driver === 0) {
        message.error('Iltimos, haydovchini tanlang');
        setIsSubmitting(false);
        return;
      }
      if (!values.amount || values.amount <= 0) {
        message.error('Iltimos, to\'g\'ri miqdorni kiriting');
        setIsSubmitting(false);
        return;
      }
      
      const salaryData = {
        driver: Number(values.driver),
        amount: Number(values.amount),
        currency: values.currency.toString(),
        custom_rate_to_uzs: Number(values.custom_rate_to_uzs),
        title: 'To\'lov',
        comment: ''       
      };

      if (isEditMode && editingRecord) {
        await updateDriverSalary({ 
          id: editingRecord.id, 
          data: salaryData 
        });
        message.success('To\'lov muvaffaqiyatli yangilandi');
      } else {
        await createDriverSalary(salaryData);
        message.success('To\'lov muvaffaqiyatli qo\'shildi');
      }

      form.resetFields();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('To\'lovni saqlashda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? "To'lovni tahrirlash" : "To'lov qo'shish"}
      open={visible}
      onCancel={onClose}
      forceRender={true}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Bekor qilish
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {isEditMode ? "Yangilash" : "Saqlash"}
        </Button>
      ]}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="driver"
          label="Haydovchi"
          rules={[{ required: true, message: 'Iltimos, haydovchini tanlang' }]}
        >
          <Select
            placeholder="Haydovchini tanlang"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            disabled={isEditMode} 
          >
            {drivers && drivers.length > 0 ? (
              drivers.map(driver => (
                <Option key={driver.id} value={driver.id}>
                  {driver.fullname}
                </Option>
              ))
            ) : (
              <Option value="" disabled>Haydovchilar mavjud emas</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Miqdor"
          rules={[{ required: true, message: 'Iltimos, miqdorni kiriting' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            placeholder="Miqdorni kiriting"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>

        <Form.Item
          name="currency"
          label="Valyuta"
          rules={[{ required: true, message: 'Iltimos, valyutani tanlang' }]}
        >
          {currenciesLoading ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Spin size="small" style={{ marginRight: 8 }} />
              <span>Valyutalar yuklanmoqda...</span>
            </div>
          ) : currenciesError ? (
            <Select placeholder="Valyutani tanlang">
              <Option value={1}>UZS</Option>
              <Option value={2}>USD</Option>
            </Select>
          ) : (
            <Select placeholder="Valyutani tanlang"
              onChange={(value) => {
                const selectedCurrency = currencies.find(c => c.id === value);
                if (selectedCurrency) {
                  form.setFieldsValue({
                    custom_rate_to_uzs: selectedCurrency.rate_to_uzs
                  });
                }
              }}
            >
              {currencies.map(currency => (
                <Option key={`currency-${currency.id}`} value={currency.id}>
                  {currency.currency} ({parseFloat(currency.rate_to_uzs).toLocaleString()} UZS)
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="custom_rate_to_uzs"
          label="Valyuta kursi"
          rules={[{ required: true, message: 'Iltimos, valyuta kursini kiriting' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Valyuta kursini kiriting"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DriverSalaryModal; 