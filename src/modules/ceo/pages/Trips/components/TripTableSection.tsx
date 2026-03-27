import React from 'react';
import { Table, Card, Tag, Button, Space, Typography } from 'antd';
import { 
  EyeOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CarOutlined, 
  UserOutlined,
  DollarOutlined 
} from '@ant-design/icons';
import { formatPrice } from '../../../../../utils/formatCurrency';

const { Text } = Typography;

interface TripTableSectionProps {
  displayTrips: any[];
  loading: boolean;
  onViewTrip: (record: any) => void;
  currentPage: number;
  pageSize: number;
  totalTrips: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export const TripTableSection: React.FC<TripTableSectionProps> = ({
  displayTrips,
  loading,
  onViewTrip,
  currentPage,
  pageSize,
  totalTrips,
  onPaginationChange
}) => {
  // Columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Status',
      dataIndex: 'is_completed',
      key: 'status',
      render: (isCompleted: boolean) => (
        isCompleted ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Yakunlangan</Tag>
        ) : (
          <Tag color="processing" icon={<ClockCircleOutlined />}>Jarayonda</Tag>
        )
      ),
      width: 120,
    },
    {
      title: 'Haydovchi',
      dataIndex: 'driver',
      key: 'driver',
      render: (driver: any) => (
        <Space>
          <UserOutlined />
          {driver?.fullname || 'Noma\'lum'}
        </Space>
      ),
    },
    {
      title: 'Transport',
      dataIndex: 'car',
      key: 'vehicle',
      render: (car: any) => (
        <Space>
          <CarOutlined />
          {car ? `${car.name} (${car.number})` : 'Noma\'lum'}
        </Space>
      ),
    },
    {
      title: 'Mijoz',
      dataIndex: 'client',
      key: 'client',
      render: (clients: any[]) => (
        clients && clients.length > 0 ? (
          <Space>
            <UserOutlined />
            {`${clients[0].first_name} ${clients[0].last_name}`}
          </Space>
        ) : 'Mijoz kiritilmagan'
      ),
    },
    {
      title: 'Yo\'nalish',
      key: 'route',
      render: (record: any) => (
        <>
          {record.from1 || 'Noma\'lum'} → {record.to_go || 'Noma\'lum'}
          <div><small>{record.kilometer || 0} km</small></div>
        </>
      ),
    },
    {
      title: 'Narx (USD)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong>{formatPrice(price, 'price', 'USD')}</Text>
      ),
    },
    {
      title: 'Haydovchi to\'lovi (USD)',
      dataIndex: 'dr_price',
      key: 'driverPayment',
      render: (drPrice: number) => (
        <Text>{formatPrice(drPrice, 'dr_price', 'USD')}</Text>
      ),
    },
    {
      title: 'Boshqa xarajat',
      key: 'otherExpense',
      render: (record: any) => (
        <Text>
          {formatPrice(record.dp_price, 'dp_price', record.dp_currency_name || 'UZS')}
          {record.dp_currency_name && <small> ({record.dp_currency_name})</small>}
        </Text>
      ),
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (record: any) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          size="small"
          onClick={() => onViewTrip(record)}
        >
          Ko'rish
        </Button>
      ),
    },
  ];

  return (
    <Card 
      title={<Space><DollarOutlined /> Reyslar</Space>}
      className="trip-table-card"
      style={{ marginBottom: 24 }}
    >
      <Table
        dataSource={displayTrips}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalTrips,
          onChange: onPaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Jami ${total} ta reys`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default TripTableSection; 