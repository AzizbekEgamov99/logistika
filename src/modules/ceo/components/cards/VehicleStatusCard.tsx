import React from 'react';
import { Card, Divider, Tag } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';


interface VehicleStatusCardProps {
  activeVehicles: number;
  availableVehicles: number;
  maintenanceVehicles?: number;
  utilizationRate?: number;
  averageDistance?: number;
  fuelConsumption?: number;
  loading?: boolean;
  type?: 'car' | 'furgon';
  title?: string;
}

export const VehicleStatusCard: React.FC<VehicleStatusCardProps> = ({
  activeVehicles,
  availableVehicles,
  loading = false,
  type = 'car',
  title = "Transport vositalari holati"
}) => {
  // Transport turi uchun nomi
  const vehicleTypeName = type === 'car' ? 'avtomobil' : 'furgon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        variant="borderless"
        className="vehicle-status-card"
        loading={loading}
        title={title}
      >
        <div className="status-item">
          <div className="status-icon" style={{ background: 'rgba(24, 144, 255, 0.1)' }}>
            <CarOutlined style={{ color: '#1890ff' }} />
          </div>
          <div className="status-info">
            <span className="status-title">Yo&apos;ldagi {vehicleTypeName}lar</span>
            <span className="status-value">{activeVehicles}</span>
          </div>
          <Tag color="processing">Faol</Tag>
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div className="status-item">
          <div className="status-icon" style={{ background: 'rgba(114, 46, 209, 0.1)' }}>
            <CarOutlined style={{ color: '#722ed1' }} />
          </div>
          <div className="status-info">
            <span className="status-title">Mavjud {vehicleTypeName}lar</span>
            <span className="status-value">{availableVehicles}</span>
          </div>
          <Tag color="default">Bo&apos;sh</Tag>
        </div>
      </Card>
      
      <style jsx global>{`
        .vehicle-status-card {
          height: 100%;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .vehicle-status-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        
        .vehicle-status-card .ant-card-head {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .vehicle-status-card .ant-card-head-title {
          font-weight: 600;
        }
        
        .status-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }
        
        .status-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        .status-info {
          flex: 1;
          margin: 0 12px;
        }
        
        .status-title {
          display: block;
          font-size: 14px;
          color: #6b7280;
        }
        
        .status-value {
          display: block;
          font-size: 18px;
          font-weight: 600;
          color: #1a365d;
        }
      `}</style>
    </motion.div>
  );
};