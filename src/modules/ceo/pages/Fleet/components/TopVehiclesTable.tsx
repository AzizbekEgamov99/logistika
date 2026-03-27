import React from 'react';
import { Table, Card } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Car, Furgon } from '../../../accounting/types';

interface TopVehiclesTableProps {
  vehicles: (Car | Furgon)[];
  isLoading: boolean;
}

export const TopVehiclesTable: React.FC<TopVehiclesTableProps> = ({
  vehicles,
  isLoading
}) => {
  const columns: ColumnsType<Car | Furgon> = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Davlat raqami',
      dataIndex: 'state_number',
      key: 'state_number',
    },
    {
      title: 'Reyslar soni',
      dataIndex: 'trips_count',
      key: 'trips_count',
      sorter: (a, b) => (a.trips_count || 0) - (b.trips_count || 0),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Yo\'l bosdi (km)',
      dataIndex: 'distance',
      key: 'distance',
      render: (text) => `${text} km`,
    },
  ];

  return (
    <Card 
      title="Eng yaxshi transport vositalari" 
      className="dashboard-card"
    >
      <Table
        columns={columns}
        dataSource={vehicles}
        loading={isLoading}
        rowKey={(record) => record.id.toString()}
        pagination={false}
        size="small"
      />
    </Card>
  );
}; 