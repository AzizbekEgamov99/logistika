import React, { useState } from 'react';
import { Table, Tag, Space, Button, DatePicker, Select, Input, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EyeOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { Transaction } from '../../mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TransactionsListProps {
  transactions: Transaction[];
  showPagination: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  filters?: {
    dateRange: [null | Date, null | Date];
    type: string;
    category: string;
    paymentMethod: string;
  };
  onFilterChange?: (filters: any) => void;
}

// Helper function to format currency with fixed options to prevent hydration errors
const formatCurrency = (amount: number): string => {
  // Use fixed options without relying on user's locale
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  showPagination = true,
  currentPage = 1,
  onPageChange,
  filters,
  onFilterChange,
}) => {
  // Filter states for local filtering when global filters not provided
  const [searchText, setSearchText] = useState('');
  const [localFilters, setLocalFilters] = useState({
    dateRange: [null, null],
    type: 'all',
    category: 'all',
    paymentMethod: 'all',
  });

  // Use either provided filters or local filters
  const activeFilters = filters || localFilters;

  // Update local filters and notify parent if callback provided
  const updateFilters = (newFilters: any) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setLocalFilters(newFilters);
    }
  };

  // Filter transactions based on active filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search text
    if (
      searchText &&
      !transaction.description.toLowerCase().includes(searchText.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }

    // Filter by date range
    if (
      activeFilters.dateRange[0] &&
      activeFilters.dateRange[1] &&
      (transaction.date < activeFilters.dateRange[0] ||
        transaction.date > activeFilters.dateRange[1])
    ) {
      return false;
    }

    // Filter by transaction type
    if (activeFilters.type !== 'all' && transaction.type !== activeFilters.type) {
      return false;
    }

    // Filter by category
    if (
      activeFilters.category !== 'all' &&
      transaction.category !== activeFilters.category
    ) {
      return false;
    }

    // Filter by payment method
    if (
      activeFilters.paymentMethod !== 'all' &&
      transaction.paymentMethod !== activeFilters.paymentMethod
    ) {
      return false;
    }

    return true;
  });

  // Extract unique categories for filter dropdown
  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category))
  );

  // Extract unique payment methods for filter dropdown
  const paymentMethods = Array.from(
    new Set(transactions.map((transaction) => transaction.paymentMethod))
  );

  const columns = [
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => date.toLocaleDateString('en-US'),
      sorter: (a: Transaction, b: Transaction) => a.date.getTime() - b.date.getTime(),
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span style={{ maxWidth: 250, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Kategoriya',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'income' ? 'green' : 'volcano'}>
          {type === 'income' ? (
            <><ArrowUpOutlined /> Kirim</>
          ) : (
            <><ArrowDownOutlined /> Chiqim</>
          )}
        </Tag>
      ),
    },
    {
      title: 'To\'lov Usuli',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Miqdori',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Transaction) => (
        <span style={{ 
          fontWeight: 'bold',
          color: record.type === 'income' ? '#3f8600' : '#cf1322' 
        }}>
          {record.type === 'income' ? '+' : '-'} {formatCurrency(amount)}
        </span>
      ),
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Transaction) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => console.log('View transaction details', record)}
          />
        </Space>
      ),
    },
  ];

  // Helper function to get color for category tag
  function getCategoryColor(category: string): string {
    const categoryColors: { [key: string]: string } = {
      'Trip payment': 'blue',
      'Vehicle maintenance': 'orange',
      'Fuel': 'red',
      'Driver salary': 'purple',
      'Office expenses': 'cyan',
      'Taxes': 'magenta',
    };

    return categoryColors[category] || 'default';
  }

  return (
    <div className="transactions-list">
      {/* Filters */}
      {showPagination && (
        <div className="transaction-filters" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              <Input
                placeholder="Qidirish..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            
            <Col xs={24} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => {
                  updateFilters({
                    ...activeFilters,
                    dateRange: dates ? [dates[0]?.toDate(), dates[1]?.toDate()] : [null, null],
                  });
                }}
              />
            </Col>
            
            <Col xs={12} md={5}>
              <Select
                style={{ width: '100%' }}
                placeholder="Tranzaksiya turi"
                value={activeFilters.type}
                onChange={(value) => {
                  updateFilters({
                    ...activeFilters,
                    type: value,
                  });
                }}
              >
                <Option value="all">Barchasi</Option>
                <Option value="income">Kirim</Option>
                <Option value="expense">Chiqim</Option>
              </Select>
            </Col>
            
            <Col xs={12} md={5}>
              <Select
                style={{ width: '100%' }}
                placeholder="Kategoriya"
                value={activeFilters.category}
                onChange={(value) => {
                  updateFilters({
                    ...activeFilters,
                    category: value,
                  });
                }}
              >
                <Option value="all">Barchasi</Option>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
      )}

      {/* Transactions Table */}
      <Table
        columns={columns}
        dataSource={filteredTransactions.map(transaction => ({ ...transaction, key: transaction.id }))}
        pagination={
          showPagination
            ? {
                current: currentPage,
                onChange: onPageChange,
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total) => `Jami: ${total} ta tranzaksiya`,
              }
            : false
        }
        size={showPagination ? 'middle' : 'small'}
        scroll={{ x: 'max-content' }}
        summary={(pageData) => {
          if (!showPagination) return null;
          
          // Calculate totals
          const totalIncome = pageData
            .filter(item => item.type === 'income')
            .reduce((sum, item) => sum + item.amount, 0);
            
          const totalExpense = pageData
            .filter(item => item.type === 'expense')
            .reduce((sum, item) => sum + item.amount, 0);
            
          const balance = totalIncome - totalExpense;
          
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5} align="right">
                  <strong>Jami:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ color: '#3f8600' }}>
                      + {formatCurrency(totalIncome)}
                    </span>
                    <span style={{ color: '#cf1322' }}>
                      - {formatCurrency(totalExpense)}
                    </span>
                    <span style={{ fontWeight: 'bold', color: balance >= 0 ? '#3f8600' : '#cf1322' }}>
                      = {formatCurrency(balance)}
                    </span>
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default TransactionsList; 