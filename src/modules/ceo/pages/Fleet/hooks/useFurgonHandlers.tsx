import { useState, useCallback } from 'react';
import { Modal, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
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
      if (!furgon.id) {
        message.error('Furgon ID is missing');
        return;
      }
      
      try {
        deleteFurgon(furgon.id)
          .then(() => {
            message.success("Furgon muvaffaqiyatli o'chirildi");
          })
          .catch((error) => {
            console.error('Delete error:', error);
            
            // Display specific error message
            let errorMessage = 'Furgonni o\'chirishda xatolik yuz berdi';
            
            if (error.message && error.message.includes('bog\'langan')) {
              errorMessage = error.message;
            } else if (error.response?.data?.detail) {
              errorMessage = error.response.data.detail;
            } else if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (typeof error.response?.data === 'object') {
              // Try to extract error message from the response data
              const errorData = error.response.data;
              const errorTexts = Object.values(errorData).flat().join(', ');
              if (errorTexts) {
                errorMessage = `Xatolik: ${errorTexts}`;
              }
            }
            
            message.error(errorMessage);
          });
      } catch (error) {
        console.error('Delete furgon error:', error);
        message.error('Furgon o\'chirishda xatolik yuz berdi');
      }
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