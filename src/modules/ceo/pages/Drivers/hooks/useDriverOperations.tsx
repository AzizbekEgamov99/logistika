import { useState, useCallback } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DriverType } from '../../../../accounting/types/driver';

const { confirm } = Modal;

interface UseDriverOperationsProps {
  createDriver: (values: Partial<DriverType>) => Promise<any>;
  updateDriver: (id: number, values: Partial<DriverType>) => Promise<any>;
  deleteDriver: (id: number) => Promise<any>;
  onSuccess?: () => void;
}

export const useDriverOperations = ({
  createDriver,
  updateDriver,
  deleteDriver,
  onSuccess
}: UseDriverOperationsProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverType | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleAddDriver = useCallback(() => {
    setModalMode('create');
    setSelectedDriver(null);
    setIsModalVisible(true);
  }, []);

  const handleEditDriver = useCallback((driver: DriverType) => {
    if (!driver) return;

    setModalMode('edit');
    setSelectedDriver(driver);
    setIsModalVisible(true);
  }, []);

  const handleDeleteDriver = useCallback((driver: DriverType) => {
    confirm({
      title: "Haydovchini o'chirishni istaysizmi?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amal qaytarilmaydi va barcha ma'lumotlar yo'qoladi.",
      okText: 'Ha',
      okType: 'danger',
      cancelText: "Yo'q",
      async onOk() {
        try {
          await deleteDriver(driver.id);
          message.success("Haydovchi muvaffaqiyatli o'chirildi");
          if (onSuccess) {
            onSuccess();
          }
          return true;
        } catch (error) {
          console.error('Error deleting driver:', error);
          message.error("Haydovchini o'chirishda xatolik yuz berdi");
          return false;
        }
      },
    });
  }, [deleteDriver, onSuccess]);

  const handleModalSubmit = useCallback(async (values: Partial<DriverType>) => {
    try {
      if (modalMode === 'create') {
        await createDriver(values);
        message.success("Haydovchi muvaffaqiyatli qo'shildi");
      } else if (modalMode === 'edit' && selectedDriver) {
        await updateDriver(selectedDriver.id, values);
        message.success("Haydovchi ma'lumotlari yangilandi");
      }
      
      setIsModalVisible(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error; // Let the modal component handle the error
    }
  }, [modalMode, selectedDriver, createDriver, updateDriver, onSuccess]);

  return {
    isModalVisible,
    setIsModalVisible,
    selectedDriver,
    modalMode,
    handleAddDriver,
    handleEditDriver,
    handleDeleteDriver,
    handleModalSubmit
  };
}; 