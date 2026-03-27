import React, { useMemo } from 'react';
import { Empty, Spin, Card } from 'antd';
import { Column } from '@ant-design/plots';
import { Client, PaymentStatus } from '../../mockData';

interface ClientDebtChartProps {
  clients: Client[];
  paymentStatuses: PaymentStatus[];
}

interface ChartData {
  name: string;
  debt: number;
}

const ClientDebtChart: React.FC<ClientDebtChartProps> = ({ clients, paymentStatuses }) => {
  // Generate chart data
  const chartData = useMemo(() => {
    // Get list of clients with debt
    const clientsWithDebt = clients.map(client => {
      const clientStatuses = paymentStatuses.filter(status => status.clientId === client.id);
      const totalDebt = clientStatuses.reduce((sum, status) => sum + status.remainingAmount, 0);
      
      return {
        id: client.id,
        name: client.name,
        company: client.company,
        debt: totalDebt,
      };
    }).filter(client => client.debt > 0);
    
    // Sort by debt amount (descending)
    clientsWithDebt.sort((a, b) => b.debt - a.debt);
    
    // Take top 10 clients with most debt
    return clientsWithDebt.slice(0, 10).map(client => ({
      name: client.name,
      debt: client.debt,
    }));
  }, [clients, paymentStatuses]);

  // Format currency to prevent hydration errors
  const formatCurrency = (value: number) => {
    return "$" + value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
  };

  if (!chartData.length) {
    return <Empty description="Qarz ma'lumotlari mavjud emas" />;
  }

  const config = {
    data: chartData,
    xField: 'name',
    yField: 'debt',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
      },
    },
    meta: {
      name: {
        alias: 'Mijoz',
      },
      debt: {
        alias: 'Qarz miqdori',
        formatter: (value: number) => formatCurrency(value),
      }
    },
    color: '#ff4d4f',
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.name, value: formatCurrency(datum.debt) };
      },
    },
  };

  return (
    <Card>
      <div style={{ height: 300 }}>
        <Column {...config} />
      </div>
    </Card>
  );
};

export default ClientDebtChart; 