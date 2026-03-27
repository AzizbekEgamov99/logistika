import React, { useState } from 'react';
import { Card, Table, Tag, Tooltip, Spin, Input, Space, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';

interface RevenueData {
  key: string;
  date: string;
  category: string;
  amount: number;
  change: number;
  status: 'increase' | 'decrease' | 'stable';
}

interface RevenueTableProps {
  data: RevenueData[];
  isLoading?: boolean;
}

export const RevenueTable: React.FC<RevenueTableProps> = ({ data, isLoading = false }) => {
  const [searchText, setSearchText] = useState('');
  
  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof RevenueData) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: RevenueData) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const columns: TableProps<RevenueData>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      sorter: (a, b) => a.change - b.change,
      render: (change, record) => {
        let color = 'blue';
        let prefix = '';
        
        if (record.status === 'increase') {
          color = 'green';
          prefix = '+';
        } else if (record.status === 'decrease') {
          color = 'red';
          prefix = '';
        }
        
        return (
          <Tooltip title={`${prefix}${change.toFixed(2)}%`}>
            <Tag color={color}>{`${prefix}${change.toFixed(2)}%`}</Tag>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Card 
      title="Revenue Transactions" 
      bordered={false}
      style={{ borderRadius: '8px' }}
      extra={
        <Button icon={<DownloadOutlined />} size="small">
          Export
        </Button>
      }
    >
      <Spin spinning={isLoading}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`
          }}
          scroll={{ x: 'max-content' }}
        />
      </Spin>
    </Card>
  );
}; 