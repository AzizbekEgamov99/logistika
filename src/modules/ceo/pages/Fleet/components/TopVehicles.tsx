import React from 'react';
import { Card, Table, Typography } from 'antd';
import { Car, Furgon } from '../../../../accounting/types/furgon';

const { Title } = Typography;

interface TopVehiclesProps {
  cars: Car[];
  furgons: Furgon[];
}

export const TopVehicles: React.FC<TopVehiclesProps> = ({ cars, furgons }) => {
  const allVehicles = [
    ...cars.map(car => ({
      key: `car-${car.id}`,
      id: car.id,
      name: car.name,
      type: 'Avtomobil',
      tripCount: car.rays_count || 0,
      distance: car.distance || 0,
    })),
    ...furgons.map(furgon => ({
      key: `furgon-${furgon.id}`,
      id: furgon.id,
      name: furgon.name,
      type: 'Furgon',
      tripCount: furgon.rays_count || 0,
      distance: furgon.distance || 0,
    }))
  ].sort((a, b) => b.tripCount - a.tripCount);

  // Take top 5
  const topVehicles = allVehicles.slice(0, 5);

  const columns = [
    {
      title: 'Transport',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => `${text} (${record.type})`
    },
    {
      title: 'Reyslar soni',
      dataIndex: 'tripCount',
      key: 'tripCount',
      align: 'right' as const,
    },
    {
      title: 'Masofa (km)',
      dataIndex: 'distance',
      key: 'distance',
      align: 'right' as const,
    }
  ];

  return (
    <Card className="top-vehicles">
      <Title level={5}>Eng ko'p Reysda transportlar</Title>
      <Table
        dataSource={topVehicles}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}; 