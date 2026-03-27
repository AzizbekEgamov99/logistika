import React from 'react';
import { Card, Table, Tag, Button, Avatar, Empty } from 'antd';
import { TrophyOutlined, UserOutlined, CarOutlined, HistoryOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { DriverType } from '../../../../../accounting/types/driver';

import { baseURL, formatImageUrl } from '../../../../../../api/axiosInstance';

interface TopDriversSectionProps {
  topDrivers: DriverType[];
  onViewAllClick: () => void;
  onViewDriverHistory: (driver: DriverType) => void;
}

const TopDriversSection: React.FC<TopDriversSectionProps> = ({
  topDrivers,
  onViewAllClick,
  onViewDriverHistory,
}) => {
  const columns = [
    {
      title: 'Haydovchi',
      dataIndex: 'fullname',
      key: 'driver',
      render: (_: any, record: DriverType, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background:
                index < 3
                  ? ['gold', 'silver', '#cd7f32'][index]
                  : '#eee',
              color: index < 3 ? '#fff' : '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
              fontWeight: 'bold',
            }}
          >
            {index + 1}
          </div>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ marginRight: 8, backgroundColor: '#1890ff' }}
          />
          <span>
            {record.fullname ||
              `${record.first_name} ${record.last_name}`}
          </span>
        </div>
      ),
    },
    {
      title: 'Reyslar',
      dataIndex: 'rays_count',
      key: 'trips',
      render: (count: number) => (
        <Tag color="blue">
          <CarOutlined /> {count || 0}
        </Tag>
      ),
    },
    {
      title: "Ko'rish",
      key: 'view',
      render: (_: any, record: DriverType) => (
        <Button
          type="primary"
          size="small"
          icon={<HistoryOutlined />}
          onClick={() => onViewDriverHistory(record)}
        >
          Tarixi
        </Button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card
        title={
          <>
            <TrophyOutlined /> Eng faol haydovchilar
          </>
        }
        className="content-card"
        extra={
          <Button type="link" onClick={onViewAllClick}>
            Hammasi
          </Button>
        }
      >
        {topDrivers.length > 0 ? (
          <Table
            dataSource={topDrivers}
            rowKey="id"
            pagination={false}
            columns={columns}
          />
        ) : (
          <Empty description="Ma'lumot topilmadi" />
        )}
      </Card>
    </motion.div>
  );
};

export default TopDriversSection; 