import React, { useState } from 'react';
import { Card, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BalonFurgonForm from './BalonFurgonForm';
import { BalonFurgonType } from '../../types/maintenance';
import { useFurgons } from '@/modules/accounting/hooks/useFurgon';

interface BalonFurgonAddProps {
  addBalonFurgonService: (service: BalonFurgonType) => void;
}

const BalonFurgonAdd: React.FC<BalonFurgonAddProps> = ({ addBalonFurgonService }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { furgons = [] } = useFurgons(); // Use the furgons hook

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdd = async (values: BalonFurgonType) => {
    setLoading(true);
    try {
      await addBalonFurgonService(values);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding balon furgon service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Yangi furgon balon xizmatini qo`shish
        </Button>
      </Card>
      
      <Modal
        title="Yangi furgon balon xizmatini qo'shish"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <BalonFurgonForm 
          onFinish={handleAdd} 
          onCancel={handleCancel} 
          furgons={furgons} 
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default BalonFurgonAdd; 
