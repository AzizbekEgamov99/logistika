import React from 'react';
import { Table, Typography, Tag, Space, Tooltip } from 'antd';
import { CarOutlined, UserOutlined, DollarOutlined, ToolOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../../../../utils/formatters';

const { Text } = Typography;

interface ExpenseData {
  id: number;
  date: Date;
  carId: number;
  driver: string | null;
  driverExpense: number;
  dispatcherExpense: number;
  fuelCost: number;
  maintenanceCost: number;
  otherExpenses: number;
  totalExpense: number;
}

interface ExpensesTableProps {
  data: ExpenseData[];
  loading?: boolean;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ data, loading = false }) => {
  const columns = [
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => <Text>{date.toLocaleDateString('uz-UZ')}</Text>,
      sorter: (a: ExpenseData, b: ExpenseData) => a.date.getTime() - b.date.getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Transport',
      dataIndex: 'carId',
      key: 'carId',
      render: (carId: number) => (
        <Tag color="blue" icon={<CarOutlined />}>
          {`Transport #${carId}`}
        </Tag>
      ),
    },
    {
      title: 'Haydovchi',
      dataIndex: 'driver',
      key: 'driver',
      render: (driver: string | null) => driver ? (
        <Text>
          <UserOutlined style={{ marginRight: 8 }} />
          {driver}
        </Text>
      ) : '-',
    },
    {
      title: 'Haydovchi xarajati',
      dataIndex: 'driverExpense',
      key: 'driverExpense',
      render: (amount: number) => (
        <Text>{formatCurrency(amount)}</Text>
      ),
      sorter: (a: ExpenseData, b: ExpenseData) => a.driverExpense - b.driverExpense,
    },
    {
      title: 'Dispetcher xarajati',
      dataIndex: 'dispatcherExpense',
      key: 'dispatcherExpense',
      render: (amount: number) => (
        <Text>{formatCurrency(amount)}</Text>
      ),
      sorter: (a: ExpenseData, b: ExpenseData) => a.dispatcherExpense - b.dispatcherExpense,
    },
    {
      title: 'Yoqilg\'i',
      dataIndex: 'fuelCost',
      key: 'fuelCost',
      render: (amount: number) => (
        <Text>
          <ThunderboltOutlined style={{ marginRight: 8 }} />
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a: ExpenseData, b: ExpenseData) => a.fuelCost - b.fuelCost,
    },
    {
      title: 'Texnik xizmat',
      dataIndex: 'maintenanceCost',
      key: 'maintenanceCost',
      render: (amount: number) => (
        <Text>
          <ToolOutlined style={{ marginRight: 8 }} />
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a: ExpenseData, b: ExpenseData) => a.maintenanceCost - b.maintenanceCost,
    },
    {
      title: 'Boshqa',
      dataIndex: 'otherExpenses',
      key: 'otherExpenses',
      render: (amount: number) => (
        <Text>{formatCurrency(amount)}</Text>
      ),
      sorter: (a: ExpenseData, b: ExpenseData) => a.otherExpenses - b.otherExpenses,
    },
    {
      title: 'Jami',
      dataIndex: 'totalExpense',
      key: 'totalExpense',
      render: (amount: number) => (
        <Text strong style={{ color: '#CF1322' }}>
          <DollarOutlined style={{ marginRight: 8 }} />
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a: ExpenseData, b: ExpenseData) => a.totalExpense - b.totalExpense,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data.map(item => ({ ...item, key: item.id }))}
      loading={loading}
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Jami: ${total} ta xarajat` 
      }}
      scroll={{ x: 'max-content' }}
      summary={(pageData) => {
        const totalDriverExpense = pageData.reduce((sum, item) => sum + item.driverExpense, 0);
        const totalDispatcherExpense = pageData.reduce((sum, item) => sum + item.dispatcherExpense, 0);
        const totalFuelCost = pageData.reduce((sum, item) => sum + item.fuelCost, 0);
        const totalMaintenanceCost = pageData.reduce((sum, item) => sum + item.maintenanceCost, 0);
        const totalOtherExpenses = pageData.reduce((sum, item) => sum + item.otherExpenses, 0);
        const grandTotal = pageData.reduce((sum, item) => sum + item.totalExpense, 0);

        return (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <Text strong>Jami</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>{formatCurrency(totalDriverExpense)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatCurrency(totalDispatcherExpense)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <Text strong>{formatCurrency(totalFuelCost)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text strong>{formatCurrency(totalMaintenanceCost)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <Text strong>{formatCurrency(totalOtherExpenses)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                <Text strong style={{ color: '#CF1322' }}>{formatCurrency(grandTotal)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
}; 