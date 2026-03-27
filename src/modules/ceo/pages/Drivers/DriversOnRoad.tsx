import React, { useState } from 'react';
import { Space, Tooltip, Button, Modal } from 'antd';
import { HistoryOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface DriverType {
  id: number;
  name: string;
  // Add any other necessary properties here
}

interface DriversOnRoadProps {
  drivers: DriverType[];
  onView?: (driver: DriverType) => void;
  onEdit?: (driver: DriverType) => void;
  onDelete?: (driver: DriverType) => void;
}

const DriversOnRoad: React.FC<DriversOnRoadProps> = ({ drivers, onView, onEdit, onDelete }) => {
  const [selectedDriver, setSelectedDriver] = useState<DriverType | null>(null);

  const handleView = (driver: DriverType) => {
    setSelectedDriver(driver);
    if (onView) {
      onView(driver);
    }
  };

  const handleEdit = (driver: DriverType) => {
    setSelectedDriver(driver);
    if (onEdit) {
      onEdit(driver);
    }
  };

  const handleDelete = (driver: DriverType) => {
    Modal.confirm({
      title: "Haydovchini o'chirishni istaysizmi?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amal qaytarilmaydi va barcha ma'lumotlar yo'qoladi.",
      okText: 'Ha',
      okType: 'danger',
      cancelText: "Yo'q",
      onOk() {
        if (onDelete) {
          onDelete(driver);
        }
      }
    });
  };

  return (
    <Space size="middle">
      {drivers.map((driver) => (
        <Tooltip key={driver.id} title={driver.name}>
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon={<HistoryOutlined />}
            onClick={() => handleView(driver)}
            style={{ backgroundColor: '#1890ff' }}
          />
        </Tooltip>
      ))}
      {selectedDriver && (
        <>
          <Tooltip title="Tahrirlash">
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(selectedDriver)}
              style={{ backgroundColor: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="primary"
              danger
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(selectedDriver)}
            />
          </Tooltip>
        </>
      )}
    </Space>
  );
};

export default DriversOnRoad; 