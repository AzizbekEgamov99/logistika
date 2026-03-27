import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, DatePicker, Select, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { PaymentStatus, Client, Trip } from '../../mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface PaymentStatusListProps {
  paymentStatuses: PaymentStatus[];
  clients: Client[];
  trips: Trip[];
  onAddPayment: (clientId: string) => void;
  searchText: string;
}

const PaymentStatusList: React.FC<PaymentStatusListProps> = ({
  paymentStatuses,
  clients,
  trips,
  onAddPayment,
  searchText,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Format currency with fixed options to prevent hydration errors
  const formatCurrency = (amount: number): string => {
    // Use fixed options without relying on user's locale
    return "$" + amount.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
  };

  // Get client name by ID
  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  // Get client company by ID
  const getClientCompany = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.company : '';
  };

  // Get trip details by ID
  const getTripDetails = (tripId: string): { origin: string; destination: string } => {
    const trip = trips.find(t => t.id === tripId);
    return trip 
      ? { origin: trip.origin, destination: trip.destination }
      : { origin: 'Unknown', destination: 'Unknown' };
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'processing';
      case 'unpaid':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get status text in Uzbek
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'To\'langan';
      case 'partial':
        return 'Qisman to\'langan';
      case 'unpaid':
        return 'To\'lanmagan';
      case 'overdue':
        return 'Muddati o\'tgan';
      default:
        return status;
    }
  };

  // Get payment type text in Uzbek
  const getPaymentTypeText = (type: string): string => {
    switch (type) {
      case 'full':
        return 'To\'liq to\'lov';
      case 'partial':
        return 'Qisman to\'lov';
      case 'credit':
        return 'Qarzga savdo';
      case 'driver':
        return 'Haydovchi orqali';
      default:
        return type;
    }
  };

  // Filter payment statuses based on search, status filter, and date range
  const filteredPaymentStatuses = paymentStatuses.filter(payment => {
    // Filter by search text
    if (searchText) {
      const client = clients.find(c => c.id === payment.clientId);
      const trip = trips.find(t => t.id === payment.tripId);

      if (!client || (
        !client.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !client.company.toLowerCase().includes(searchText.toLowerCase()) &&
        !trip?.origin.toLowerCase().includes(searchText.toLowerCase()) &&
        !trip?.destination.toLowerCase().includes(searchText.toLowerCase())
      )) {
        return false;
      }
    }

    // Filter by status
    if (filterStatus !== 'all' && payment.status !== filterStatus) {
      return false;
    }

    // Filter by date range
    if (dateRange[0] && dateRange[1] && payment.dueDate) {
      if (payment.dueDate < dateRange[0] || payment.dueDate > dateRange[1]) {
        return false;
      }
    }

    return true;
  });

  const columns = [
    {
      title: 'Mijoz',
      dataIndex: 'clientId',
      key: 'client',
      render: (clientId: string) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{getClientName(clientId)}</div>
          <div style={{ color: '#888' }}>{getClientCompany(clientId)}</div>
        </div>
      ),
    },
    {
      title: 'Yo\'nalish',
      dataIndex: 'tripId',
      key: 'trip',
      render: (tripId: string) => {
        const { origin, destination } = getTripDetails(tripId);
        return `${origin} - ${destination}`;
      },
    },
    {
      title: 'Summa',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: PaymentStatus, b: PaymentStatus) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'To\'langan',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: PaymentStatus, b: PaymentStatus) => a.paidAmount - b.paidAmount,
    },
    {
      title: 'Qolgan',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a: PaymentStatus, b: PaymentStatus) => a.remainingAmount - b.remainingAmount,
    },
    {
      title: 'To\'lov turi',
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (type: string) => getPaymentTypeText(type),
      filters: [
        { text: 'To\'liq to\'lov', value: 'full' },
        { text: 'Qisman to\'lov', value: 'partial' },
        { text: 'Qarzga savdo', value: 'credit' },
        { text: 'Haydovchi orqali', value: 'driver' },
      ],
      onFilter: (value: string, record: PaymentStatus) => record.paymentType === value,
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'To\'langan', value: 'paid' },
        { text: 'Qisman to\'langan', value: 'partial' },
        { text: 'To\'lanmagan', value: 'unpaid' },
        { text: 'Muddati o\'tgan', value: 'overdue' },
      ],
      onFilter: (value: string, record: PaymentStatus) => record.status === value,
    },
    {
      title: 'Muddat',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: Date | undefined) => date ? date.toLocaleDateString() : '-',
      sorter: (a: PaymentStatus, b: PaymentStatus) => {
        if (!a.dueDate) return -1;
        if (!b.dueDate) return 1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      },
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (text: string, record: PaymentStatus) => (
        <Space size="small">
          <Tooltip title="Batafsil ko'rish">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => console.log('View details', record)}
            />
          </Tooltip>
          <Tooltip title="To'lov qo'shish">
            <Button
              type="primary"
              icon={<DollarOutlined />}
              size="small"
              onClick={() => onAddPayment(record.clientId)}
              disabled={record.status === 'paid'}
            >
              To'lov
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="payment-status-list">
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder="Holatni filtrlash"
            style={{ width: 200 }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="all">Barcha holatlar</Option>
            <Option value="paid">To'langan</Option>
            <Option value="partial">Qisman to'langan</Option>
            <Option value="unpaid">To'lanmagan</Option>
            <Option value="overdue">Muddati o'tgan</Option>
          </Select>
          
          <RangePicker
            placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            onChange={(dates) => {
              if (dates) {
                setDateRange([dates[0]?.toDate() || null, dates[1]?.toDate() || null]);
              } else {
                setDateRange([null, null]);
              }
            }}
          />
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredPaymentStatuses}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Jami ${total} to'lov holati`,
        }}
      />
    </div>
  );
};

export default PaymentStatusList; 