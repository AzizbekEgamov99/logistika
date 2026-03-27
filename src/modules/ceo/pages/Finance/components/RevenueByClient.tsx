import React from 'react';
import { Column } from '@ant-design/charts';
import { Card, Typography, Empty } from 'antd';

const { Title } = Typography;

interface ClientRevenue {
  clientId: number;
  clientName: string;
  revenue: number;
  color?: string;
}

interface RevenueByClientProps {
  clientRevenues: ClientRevenue[];
  isLoading: boolean;
}

export const RevenueByClient: React.FC<RevenueByClientProps> = ({
  clientRevenues,
  isLoading
}) => {
  // Format to millions for easier reading
  const formatToMillions = (value: number) => {
    return `${(value / 1000000).toFixed(1)} mln`;
  };

  // Sort clients by revenue (highest first)
  const sortedData = [...clientRevenues]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10); // Show top 10 clients

  const config = {
    data: sortedData,
    xField: 'clientName',
    yField: 'revenue',
    label: {
      position: 'top',
      formatter: (v: any) => formatToMillions(v.revenue),
      style: {
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
      },
      title: {
        text: 'Mijozlar',
      },
    },
    yAxis: {
      title: {
        text: 'Daromad (UZS)',
      },
      label: {
        formatter: (v: string) => formatToMillions(Number(v)),
      },
    },
    tooltip: {
      formatter: (datum: ClientRevenue) => {
        return { name: datum.clientName, value: formatToMillions(datum.revenue) + ' so\'m' };
      },
    },
    color: (datum: ClientRevenue) => datum.color || '#1890ff',
    loading: isLoading,
    meta: {
      clientName: {
        alias: 'Mijoz',
      },
      revenue: {
        alias: 'Daromad',
      },
    },
  };

  return (
    <Card>
      <Title level={4}>Top mijozlar bo'yicha daromad</Title>
      {sortedData.length === 0 ? (
        <Empty
          description="Ma'lumot topilmadi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Column {...config} />
      )}
    </Card>
  );
}; 