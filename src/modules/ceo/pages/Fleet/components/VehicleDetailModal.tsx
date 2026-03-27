import React from 'react';
import { Modal, Descriptions, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: string;
  licensePlate: string;
  model: string;
  year: string;
  driverId?: string;
  driverName?: string;
}

interface VehicleDetailModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  visible,
  vehicle,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!vehicle) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'waiting':
        return 'orange';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Reysda';
      case 'waiting':
        return 'Kutmoqda';
      case 'inactive':
        return 'Nofaol';
      default:
        return status;
    }
  };

  return (
    <Modal
      title="Transport ma'lumotlari"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Yopish
        </Button>,
        <Space key="actions">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => onEdit(vehicle)}
          >
            Tahrirlash
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => onDelete(vehicle.id)}
          >
            O'chirish
          </Button>
        </Space>
      ]}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Nomi">{vehicle.name}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(vehicle.status)}>
            {getStatusText(vehicle.status)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Turi">{vehicle.type}</Descriptions.Item>
        <Descriptions.Item label="Davlat raqami">{vehicle.licensePlate}</Descriptions.Item>
        <Descriptions.Item label="Model">{vehicle.model}</Descriptions.Item>
        <Descriptions.Item label="Ishlab chiqarilgan yil">{vehicle.year}</Descriptions.Item>
        {vehicle.driverName && (
          <Descriptions.Item label="Haydovchi" span={2}>
            {vehicle.driverName}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default VehicleDetailModal; 