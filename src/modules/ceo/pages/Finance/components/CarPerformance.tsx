import React from 'react';
import { Table, Typography, Tag, Tooltip, Progress } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface CarMetric {
  carId: number;
  carName: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  trips: number;
}

interface CarPerformanceProps {
  carMetrics: CarMetric[];
  isLoading: boolean;
}

export const CarPerformance: React.FC<CarPerformanceProps> = ({
  carMetrics,
  isLoading
}) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format to millions for easier reading
  const formatToMillions = (value: number) => {
    return `${(value / 1000000).toFixed(1)} mln`;
  };

  // Determine profit margin status color
  const getProfitMarginColor = (margin: number) => {
    if (margin >= 15) return 'success';
    if (margin >= 5) return 'processing';
    if (margin >= 0) return 'warning';
    return 'error';
  };

  const columns = [
    {
      title: 'Avtomobil',
      dataIndex: 'carName',
      key: 'carName',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'Safarlar',
      dataIndex: 'trips',
      key: 'trips',
      width: 100,
      sorter: (a: CarMetric, b: CarMetric) => a.trips - b.trips,
    },
    {
      title: 'Daromad',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 150,
      sorter: (a: CarMetric, b: CarMetric) => a.revenue - b.revenue,
      render: (revenue: number) => formatToMillions(revenue) + ' so\'m',
    },
    {
      title: 'Xarajatlar',
      dataIndex: 'expenses',
      key: 'expenses',
      width: 150,
      sorter: (a: CarMetric, b: CarMetric) => a.expenses - b.expenses,
      render: (expenses: number) => formatToMillions(expenses) + ' so\'m',
    },
    {
      title: 'Foyda',
      dataIndex: 'profit',
      key: 'profit',
      width: 150,
      sorter: (a: CarMetric, b: CarMetric) => a.profit - b.profit,
      defaultSortOrder: 'descend',
      render: (profit: number) => (
        <Text strong style={{ color: profit >= 0 ? '#3f8600' : '#cf1322' }}>
          {formatToMillions(profit)} $
        </Text>
      ),
    },
    {
      title: (
        <span>
          foyda
          <Tooltip title="Daromadga nisbatan foydaning foizi">
            <InfoCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'profitMargin',
      key: 'profitMargin',
      width: 130,
      sorter: (a: CarMetric, b: CarMetric) => a.profitMargin - b.profitMargin,
      render: (margin: number) => (
        <div>
          <Tag color={getProfitMarginColor(margin)}>
            {Math.round(margin)}%
          </Tag>
          <Progress 
            percent={Math.min(Math.max(margin, 0), 100)} 
            size="small" 
            status={margin < 0 ? 'exception' : 'normal'}
            showInfo={false}
          />
        </div>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={carMetrics} 
      rowKey="carId"
      loading={isLoading}
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Jami: ${total} ta avtomobil`,
      }}
      summary={(pageData) => {
        const totalRevenue = pageData.reduce((sum, car) => sum + car.revenue, 0);
        const totalExpenses = pageData.reduce((sum, car) => sum + car.expenses, 0);
        const totalProfit = pageData.reduce((sum, car) => sum + car.profit, 0);
        const totalTrips = pageData.reduce((sum, car) => sum + car.trips, 0);
        const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        
        return (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="right">
                <strong>Jami:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{totalTrips}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{formatToMillions(totalRevenue)} $</Table.Summary.Cell>
              <Table.Summary.Cell index={3}>{formatToMillions(totalExpenses)} $</Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text strong style={{ color: totalProfit >= 0 ? '#3f8600' : '#cf1322' }}>
                  {formatToMillions(totalProfit)} $
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <Tag color={getProfitMarginColor(avgProfitMargin)}>
                  {Math.round(avgProfitMargin)}%
                </Tag>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
}; 