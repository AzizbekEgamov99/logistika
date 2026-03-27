import React, { useState } from 'react';
import { Card, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BalonForm from './BalonForm';
import { BalonType } from '../../types/maintenance';
import { useCars } from '@/modules/accounting/hooks/useCars'; // Assuming this hook exists

interface BalonAddProps {
  addBalonService: (service: BalonType) => void;
}

const BalonAdd: React.FC<BalonAddProps> = ({ addBalonService }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cars = [] } = useCars(); // Assuming this hook to fetch cars

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdd = async (values: BalonType) => {
    setLoading(true);
    try {
      await addBalonService(values);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding balon service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Yangi balon almashtirish xizmatini qo`shish
        </Button>
      </Card>
      
      <Modal
        title="Yangi balon almashtirish xizmatini qo'shish"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <BalonForm 
          onFinish={handleAdd} 
          onCancel={handleCancel} 
          cars={cars} 
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default BalonAdd;

