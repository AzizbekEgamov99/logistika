import React, { memo, FC } from 'react';
import { Card, Table, Space, Button, Empty, Input, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Vehicle } from '../types';

const { Search } = Input;
const { Title } = Typography;

interface VehicleTableProps {
  title: string;
  vehicles: Vehicle[];
  columns: any[];
  handleSearch: (value: string) => void;
  handleAdd: () => void;
  addButtonText: string;
  loading?: boolean;
}

const VehicleTable: FC<VehicleTableProps> = memo(({ 
  title, 
  vehicles, 
  columns, 
  handleSearch, 
  handleAdd, 
  addButtonText,
  loading = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'maintenance':
        return 'orange';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card
      title={<Title level={5}>{title}</Title>}
      extra={
        <Space>
          <Search
            placeholder="Qidirish..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            {addButtonText}
          </Button>
        </Space>
      }
      style={{ marginBottom: '16px', borderRadius: '12px' }}
      bordered={false}
    >
      {vehicles.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={vehicles} 
          rowKey={record => record.key || record.id.toString()}
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      ) : (
        <Empty description={`${title} topilmadi`} />
      )}
    </Card>
  );
});

export default VehicleTable; 