import React, { useState } from 'react';
import { Table, Tag, Space, Button, Badge, Tooltip, Input, Empty } from 'antd';
import { SearchOutlined, CarOutlined, DollarOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons';
import type { Vehicle } from './VehicleFinance';

interface VehiclesListProps {
  vehicles: Vehicle[];
}

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  const [searchText, setSearchText] = useState('');

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="vehicles-list">
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Transport qidirish..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {filteredVehicles.length === 0 ? (
        <Empty description="Transport vositalari mavjud emas" />
      ) : (
        <Table
          dataSource={filteredVehicles}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: 'Transport',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Space>
                  <CarOutlined />
                  <span>{text}</span>
                  <Badge
                    status={getStatusColor(record.status) as any}
                    text={record.status}
                  />
                </Space>
              ),
              sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
              title: 'Model',
              dataIndex: 'model',
              key: 'model',
            },
            {
              title: 'D/R',
              dataIndex: 'licensePlate',
              key: 'licensePlate',
              render: text => <Tag>{text}</Tag>,
            },
            {
              title: 'Jami Daromad',
              dataIndex: 'totalRevenue',
              key: 'totalRevenue',
              render: value => `$${value?.toLocaleString() || 0}`,
              sorter: (a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0),
            },
            {
              title: 'Jami Xarajat',
              dataIndex: 'totalExpenses',
              key: 'totalExpenses',
              render: value => `$${value?.toLocaleString() || 0}`,
              sorter: (a, b) => (a.totalExpenses || 0) - (b.totalExpenses || 0),
            },
            {
              title: 'foyda',
              key: 'profitability',
              render: (_, record) => {
                const profitability = record.totalRevenue > 0 
                  ? ((record.totalRevenue - record.totalExpenses) / record.totalRevenue) * 100 
                  : 0;
                
                let color = 'green';
                if (profitability < 10) color = 'red';
                else if (profitability < 30) color = 'orange';
                
                return (
                  <Tag color={color}>
                    {profitability.toFixed(1)}%
                  </Tag>
                );
              },
              sorter: (a, b) => {
                const profitabilityA = a.totalRevenue > 0 
                  ? ((a.totalRevenue - a.totalExpenses) / a.totalRevenue) * 100 
                  : 0;
                const profitabilityB = b.totalRevenue > 0 
                  ? ((b.totalRevenue - b.totalExpenses) / b.totalRevenue) * 100 
                  : 0;
                return profitabilityA - profitabilityB;
              },
            },
            {
              title: 'Jami Reys',
              dataIndex: 'totalTrips',
              key: 'totalTrips',
              sorter: (a, b) => (a.totalTrips || 0) - (b.totalTrips || 0),
            },
            {
              title: 'Amallar',
              key: 'actions',
              render: (_, record) => (
                <Space size="small">
                  <Tooltip title="Batafsil ko'rish">
                    <Button 
                      icon={<EyeOutlined />} 
                      size="small"
                      onClick={() => console.log('View details', record.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Daromad tahlili">
                    <Button 
                      icon={<DollarOutlined />} 
                      size="small"
                      onClick={() => console.log('View finance', record.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Texnik xizmat">
                    <Button 
                      icon={<ToolOutlined />} 
                      size="small"
                      onClick={() => console.log('View maintenance', record.id)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          summary={pageData => {
            const totalRevenue = pageData.reduce((sum, vehicle) => sum + (vehicle.totalRevenue || 0), 0);
            const totalExpenses = pageData.reduce((sum, vehicle) => sum + (vehicle.totalExpenses || 0), 0);
            const totalTrips = pageData.reduce((sum, vehicle) => sum + (vehicle.totalTrips || 0), 0);
            const totalProfit = totalRevenue - totalExpenses;
            
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>Jami:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong>${totalRevenue.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>${totalExpenses.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <strong>${totalProfit.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    <strong>{totalTrips}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7}></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      )}
    </div>
  );
};

export default VehiclesList; 