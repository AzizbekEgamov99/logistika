import { useState, useCallback } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { vehicleApi } from '../../../api/vehicleApi';
import { Vehicle } from '../types';

const { confirm } = Modal;

export const useCarHandlers = (
  handleUpdateCar: (id: number, formData: any) => Promise<any>,
  addCar: (formData: any) => Promise<any>,
  deleteCar: (id: number) => Promise<any>
) => {
  const [isCarModalVisible, setIsCarModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

  // Car modal handlers
  const handleAddCar = useCallback(() => {
    setSelectedCar(null);
    setIsCarModalVisible(true);
  }, []);

  const handleEditCar = useCallback((car: Vehicle) => {
    setSelectedCar(car);
    setIsCarModalVisible(true);
  }, []);

  const handleCarModalSubmit = useCallback(
    async (formData) => {
      try {
        if (selectedCar?.id) {
          await handleUpdateCar(selectedCar.id, formData);
        } else {
          await addCar(formData);
        }
        setIsCarModalVisible(false);
      } catch (error) {
        console.error('Car operation error:', error);
      }
    },
    [selectedCar, handleUpdateCar, addCar]
  );

  const handleDeleteCar = useCallback(
    (car: Vehicle) => {
      confirm({
        title: 'Avtomobilni o\'chirmoqchimisiz?',
        icon: <ExclamationCircleOutlined />,
        content: 'Bu amal qaytarib bo\'lmaydi. Barcha ma\'lumotlar yo\'qoladi.',
        okText: 'Ha, o\'chirish',
        okType: 'danger',
        cancelText: 'Bekor qilish',
        onOk: async () => {
          try {
            // Debug log
            console.log('Attempting to delete car with ID:', car.id);

            if (!car.id) {
              throw new Error('Car ID is missing');
            }

            // Show loading message
            const loadingMessage = message.loading('Avtomobil o\'chirilmoqda...', 0);

            try {
              // Try the hook method first
              await deleteCar(car.id);
              loadingMessage();
              message.success("Avtomobil muvaffaqiyatli o'chirildi");
            } catch (hookError) {
              console.error('Hook delete failed, trying direct API:', hookError);

              // If hook method fails, try direct API call
              await vehicleApi.deleteCar(car.id);
              loadingMessage();
              message.success("Avtomobil muvaffaqiyatli o'chirildi");
            }

            // Force refresh the page to ensure UI is updated
            setTimeout(() => {
              window.location.reload();
            }, 1000);

            return true;
          } catch (error: any) {
            console.error(
              'Delete car error details:',
              error.response?.data || error.message || error
            );

            // Show detailed error
            if (error.response?.data?.detail) {
              message.error(error.response.data.detail);
            } else if (error.response?.data?.message) {
              message.error(error.response.data.message);
            } else if (error.message) {
              message.error('O\'chirishda xatolik yuz berdi. Avtomobil boshqa ma\'lumotlarga bog\'langan bo\'lishi mumkin.');
            }

            // Return rejected promise to keep modal open
            return Promise.reject('Delete failed');
          }
        },
      });
    },
    [deleteCar]
  );

  const handleViewCarHistory = useCallback((carId: number) => {
    if (carId) {
      window.location.href = `/modules/ceo/fleet/${carId}/history`;
    }
  }, []);

  return {
    isCarModalVisible,
    setIsCarModalVisible,
    selectedCar,
    handleAddCar,
    handleEditCar,
    handleCarModalSubmit,
    handleDeleteCar,
    handleViewCarHistory,
  };
}; 