import React from 'react';
import { Table, Avatar, Progress, Typography, Tag } from 'antd';
import { CarOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import { baseURL, formatImageUrl } from '../../../../api/axiosInstance';

const { Text } = Typography;

interface DriverStats {
  id: number;
  driverId: number;
  driverName: string;
  photo?: string | null;
  completedTrips: number;
  totalTrips: number;
  successRate?: number;
  totalRevenue?: number;
  total_rays_usd?: number;
  totalKilometers?: number;
  rating?: number;
}

interface TopDriversTableProps {
  data: DriverStats[];
  loading?: boolean;
}

export const TopDriversTable: React.FC<TopDriversTableProps> = ({ data, loading = false }) => {
 console.log(data);
 
  const processedData = data.map(driver => ({
    ...driver,
    successRate: driver.successRate || (driver.totalTrips > 0 
      ? (driver.completedTrips / driver.totalTrips) * 100 
      : 0)
  }));

  // Haydovchi samaradorligiga qarab rang berish
  const getSuccessRateColor = (rate: number) => {
    if (!rate && rate !== 0) return '#f5222d';
    
    if (rate >= 95) return '#52c41a';
    if (rate >= 80) return '#1890ff';
    if (rate >= 60) return '#faad14';
    return '#f5222d';
  };

  // Qisqa ism formati
  const formatName = (name?: string) => {
    if (!name) return 'N/A';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return name;
  };

  function formatNumberSafe(num: any) {
    if (!num && num !== 0) return '0';
    const fixed = Number(num).toFixed(0);
    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const columns = [
    {
      title: 'Haydovchi',
      dataIndex: 'driverName',
      key: 'driverName',
      render: (name: string | undefined, record: DriverStats) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            icon={<UserOutlined />}
            size={40}
            style={{ marginRight: 12, backgroundColor: '#1890ff' }}
          />
          <div>
            <Text strong>{formatName(name)}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.driverId}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Reyslar',
      dataIndex: 'completedTrips',
      key: 'trips',
      render: (completed: number, record: DriverStats) => (
        <div style={{ minWidth: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
            <Text strong>{formatNumberSafe(completed)}</Text>
            <Text type="secondary" style={{ marginLeft: 4 }}>/ {formatNumberSafe(record.totalTrips)}</Text>
          </div>
          <Progress 
            percent={record.successRate} 
            size="small" 
            showInfo={false}
            strokeColor={getSuccessRateColor(record.successRate || 0)}
            style={{ marginTop: 6 }}
          />
        </div>
      ),
    },
    {
      title: 'Samaradorlik',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <Tag color={getSuccessRateColor(rate)} style={{ fontWeight: 500, fontSize: '14px' }}>
          {rate}%
        </Tag>
      ),
      sorter: (a: DriverStats, b: DriverStats) => (a.successRate || 0) - (b.successRate || 0),
    },
    {
      title: 'Daromad',
      dataIndex: 'total_rays_usd',
      key: 'total_rays_usd',
      render: (revenue: number) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DollarOutlined style={{ marginRight: 6, color: '#52c41a' }} />
            {/* <Text strong>{!revenue && revenue !== 0 ? '0' : formatNumberSafe(revenue)} USD</Text> */}
            <Text strong>{revenue} USD</Text>
          </div>
        </div>
      ),
      sorter: (a: DriverStats, b: DriverStats) => (a.totalRevenue || 0) - (b.totalRevenue || 0),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={columns}
        dataSource={processedData.map(d => ({ ...d, key: d.id }))}
        loading={loading}
        pagination={false}
        className="top-drivers-table"
        scroll={{ x: 'max-content' }}
      />

      <style jsx global>{`
        .top-drivers-table .ant-table-thead > tr > th {
          background-color: #f7fafc;
          font-weight: 600;
          color: #4b5563;
        }
        
        .top-drivers-table .ant-table-tbody > tr:hover > td {
          background-color: #f5f9ff;
        }
        
        .top-drivers-table .ant-progress-bg {
          height: 6px !important;
          border-radius: 3px;
        }
        
        .top-drivers-table .ant-table-cell {
          padding: 12px 16px;
        }
      `}</style>
    </motion.div>
  );
};