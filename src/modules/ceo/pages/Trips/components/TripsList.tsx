import React, { useState } from 'react';
import { Table, Tag, Button, Space, Tooltip, Tabs, Skeleton, Card, Empty } from 'antd';
import { EyeOutlined, RollbackOutlined, CarOutlined, UserOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { TripData } from '../../../hooks/useTrips';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

interface TripsListProps {
  activeTrips: TripData[];
  historyTrips: TripData[];
  isLoading: boolean;
  onViewDetails: (trip: TripData) => void;
  onCompleteTrip: (id: number) => void;
  onReactivateTrip: (id: number) => void;
  isCompletingTrip: boolean;
  isReactivatingTrip: boolean;
}

const TripsList: React.FC<TripsListProps> = ({
  activeTrips,
  historyTrips,
  isLoading,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState('active');

  // Format currency function
  const formatCurrency = (amount: number = 0) => {
    return amount.toLocaleString('uz-UZ') + ' so\'m';
  };
  const baseColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Haydovchi',
      key: 'driver',
      render: (_, record: TripData) => (
        <Space>
          <UserOutlined />
          {record.driver?.fullname || 'Noma\'lum'}
        </Space>
      ),
    },
    {
      title: 'Mijoz',
      key: 'client',
      render: (_, record: TripData) => (
        record.client && record.client.length > 0
          ? `${record.client[0]?.first_name || ''} ${record.client[0]?.last_name || ''}`
          : 'Mijoz kiritilmagan'
      ),
    },
    {
      title: 'Transport',
      key: 'vehicle',
      render: (_, record: TripData) => (
        <Space>
          <CarOutlined />
          {record.car ? `${record.car.name} (${record.car.number})` : 'Noma\'lum'}
        </Space>
      ),
    },
    {
      title: 'Masofa',
      key: 'route',
      render: (_, record: TripData) => (
        <Space direction="vertical" size={0}>
          <div>{record.kilometer || 0} km</div>
        </Space>
      ),
    },
    {
      title: 'Sana',
      key: 'date',
      render: (_, record: TripData) => (
        <Space direction="vertical" size={0}>
          <div>
            <CalendarOutlined /> {dayjs(record.created_at).format('DD.MM.YYYY')}
          </div>
          {record.end_date && (
            <div>
              - {dayjs(record.end_date).format('DD.MM.YYYY')}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Narx',
      key: 'price',
      render: (_, record: TripData) => `${record.price} $`,
    },
    {
      title: 'Foyda',
      key: 'profit',
      render: (_, record: TripData) => {
        const profit = (record.price || 0) - (record.dr_price || 0) - (record.dp_price || 0);
        return (
          <Tag color={profit > 0 ? 'success' : 'error'}>
            {profit.toLocaleString()} $
          </Tag>
        );
      },
    },
  ];

  const activeColumns = [
    ...baseColumns,
    {
      title: 'Amallar',
      key: 'action',
      width: 120,
      render: (_, record: TripData) => (
        <Space>
          <Tooltip title="Batafsil ko'rish">
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Columns for history trips
  const historyColumns = [
    ...baseColumns,
    {
      title: 'Amallar',
      key: 'action',
      width: 120,
      render: (_, record: TripData) => (
        <Space>
          <Tooltip title="Batafsil ko'rish">
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Render function for loading state
  const renderLoading = () => (
    <Card>
      <Skeleton active paragraph={{ rows: 10 }} />
    </Card>
  );

  // Render function for empty data
  const renderEmpty = (message: string) => (
    <Card>
      <Empty description={message} />
    </Card>
  );

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
      <TabPane
        tab={`Aktiv reyslar (${activeTrips?.length || 0})`}
        key="active"
      >
        {isLoading ? (
          renderLoading()
        ) : activeTrips.length === 0 ? (
          renderEmpty('Aktiv reyslar mavjud emas')
        ) : (
          <Table
            columns={activeColumns}
            dataSource={activeTrips}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta reys`
            }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        )}
      </TabPane>
      <TabPane
        tab={`Tarix (${historyTrips?.length || 0})`}
        key="history"
      >
        {isLoading ? (
          renderLoading()
        ) : historyTrips.length === 0 ? (
          renderEmpty('Tarixdagi reyslar mavjud emas')
        ) : (
          <Table
            columns={historyColumns}
            dataSource={historyTrips}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta reys`
            }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        )}
      </TabPane>
    </Tabs>
  );
};

export default TripsList; 