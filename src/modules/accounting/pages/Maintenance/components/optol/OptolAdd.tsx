import React, { useState } from 'react';
import { Card, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import OptolForm from './OptolForm';
import { OptolType } from '../../types/maintenance';
import { useCars } from '@/modules/accounting/hooks/useCars'; // Assuming this hook exists

interface OptolAddProps {
  addOptolService: (service: OptolType) => void;
}

const OptolAdd: React.FC<OptolAddProps> = ({ addOptolService }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cars = [] } = useCars(); // Assuming this hook to fetch cars

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdd = async (values: OptolType) => {
    setLoading(true);
    try {
      await addOptolService(values);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding optol service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Yangi moy almashtirish xizmatini qo`shish
        </Button>
      </Card>
      
      <Modal
        title="Yangi moy almashtirish xizmatini qo'shish"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <OptolForm 
          onFinish={handleAdd} 
          onCancel={handleCancel} 
          cars={cars} 
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default OptolAdd;

