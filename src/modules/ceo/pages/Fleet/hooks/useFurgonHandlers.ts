import { useState, useCallback } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { vehicleApi } from '../../../api/vehicleApi';
import { Vehicle } from '../types';

const { confirm } = Modal;

export const useFurgonHandlers = (
  handleUpdateFurgon: (id: number, formData: any) => Promise<any>,
  addFurgon: (formData: any) => Promise<any>,
  deleteFurgon: (id: number) => Promise<any>
) => {
  const [isFurgonModalVisible, setIsFurgonModalVisible] = useState(false);
  const [selectedFurgon, setSelectedFurgon] = useState<Vehicle | null>(null);

  // Furgon modal handlers
  const handleAddFurgon = useCallback(() => {
    setSelectedFurgon(null);
    setIsFurgonModalVisible(true);
  }, []);

  const handleEditFurgon = useCallback((furgon: Vehicle) => {
    setSelectedFurgon(furgon);
    setIsFurgonModalVisible(true);
  }, []);

  const handleFurgonModalSubmit = useCallback(
    async (formData) => {
      try {
        if (selectedFurgon?.id) {
          await handleUpdateFurgon(selectedFurgon.id, formData);
        } else {
          await addFurgon(formData);
        }
        setIsFurgonModalVisible(false);
      } catch (error) {
        console.error('Furgon operation error:', error);
      }
    },
    [selectedFurgon, handleUpdateFurgon, addFurgon]
  );

  const handleDeleteFurgon = useCallback(
    (furgon: Vehicle) => {
      confirm({
        title: 'Furgonni o\'chirmoqchimisiz?',
        icon: <ExclamationCircleOutlined />,
        content: 'Bu amal qaytarib bo\'lmaydi. Barcha ma\'lumotlar yo\'qoladi.',
        okText: 'Ha, o\'chirish',
        okType: 'danger',
        cancelText: 'Bekor qilish',
        onOk: async () => {
          try {
            // Debug log
            console.log('Attempting to delete furgon with ID:', furgon.id);

            if (!furgon.id) {
              throw new Error('Furgon ID is missing');
            }

            // Show loading message
            const loadingMessage = message.loading('Furgon o\'chirilmoqda...', 0);

            try {
              // Try the hook method first
              await deleteFurgon(furgon.id);
              loadingMessage();
              message.success("Furgon muvaffaqiyatli o'chirildi");
            } catch (hookError) {
              console.error('Hook delete failed, trying direct API:', hookError);

              // If hook method fails, try direct API call
              await vehicleApi.deleteFurgon(furgon.id);
              loadingMessage();
              message.success("Furgon muvaffaqiyatli o'chirildi");
            }

            // Force refresh the page to ensure UI is updated
            setTimeout(() => {
              window.location.reload();
            }, 1000);

            return true;
          } catch (error: any) {
            console.error(
              'Delete furgon error details:',
              error.response?.data || error.message || error
            );

            // Show detailed error
            if (error.response?.data?.detail) {
              message.error(error.response.data.detail);
            } else if (error.response?.data?.message) {
              message.error(error.response.data.message);
            } else if (error.message) {
              message.error(error.message);
            } else {
              message.error('Furgon o\'chirishda xatolik yuz berdi. Furgon boshqa ma\'lumotlarga bog\'langan bo\'lishi mumkin.');
            }

            // Return rejected promise to keep modal open
            return Promise.reject('Delete failed');
          }
        },
      });
    },
    [deleteFurgon]
  );

  const handleViewFurgonHistory = useCallback((furgonId: number) => {
    if (furgonId) {
      window.location.href = `/modules/ceo/fleet/furgon/${furgonId}/history`;
    }
  }, []);

  return {
    isFurgonModalVisible,
    setIsFurgonModalVisible,
    selectedFurgon,
    handleAddFurgon,
    handleEditFurgon,
    handleFurgonModalSubmit,
    handleDeleteFurgon,
    handleViewFurgonHistory,
  };
}; 