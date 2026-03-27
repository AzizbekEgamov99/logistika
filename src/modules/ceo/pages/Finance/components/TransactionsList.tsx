import React, { useState, memo } from 'react';
import { Table, Tag, Button, Space, Input, DatePicker, Select, Card, Typography, Tooltip, Empty, Spin, List } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  WalletOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Transaction } from '../../types/finance';
import { formatCurrency, formatDate } from '../../utils/formatters';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TransactionsListProps {
  transactions: Transaction[];
  showPagination: boolean;
  loading?: boolean;
  onTransactionClick: (transaction: Transaction) => void;
  selectedTransactionId: string | null;
}

const TransactionItem = memo(({ 
  transaction, 
  onTransactionClick, 
  isSelected 
}: { 
  transaction: Transaction; 
  onTransactionClick: (t: Transaction) => void;
  isSelected: boolean;
}) => (
  <List.Item
    onClick={() => onTransactionClick(transaction)}
    style={{
      cursor: 'pointer',
      backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
      padding: '8px 16px',
      borderBottom: '1px solid #f0f0f0'
    }}
  >
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Text strong>{transaction.description}</Typography.Text>
        <Typography.Text type={transaction.type === 'income' ? 'success' : 'danger'}>
          {formatCurrency(transaction.amount, transaction.currency)}
        </Typography.Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Tag color={transaction.type === 'income' ? 'green' : 'red'}>
            {transaction.type === 'income' ? 'Kirim' : 'Chiqim'}
          </Tag>
          <Typography.Text type="secondary">{formatDate(transaction.date)}</Typography.Text>
        </Space>
        <Typography.Text type="secondary">{transaction.category}</Typography.Text>
      </div>
    </Space>
  </List.Item>
));

TransactionItem.displayName = 'TransactionItem';

const TransactionsList: React.FC<TransactionsListProps> = memo(({
  transactions = [],
  showPagination = true,
  loading = false,
  onTransactionClick,
  selectedTransactionId
}) => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions];
    
    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        t => t.description?.toLowerCase().includes(searchLower) || 
             t.client_details?.name?.toLowerCase().includes(searchLower) ||
             t.driver_details?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(t => {
        const transactionDate = moment(t.created_at);
        return dateRange[0]!.isSameOrBefore(transactionDate, 'day') && 
               dateRange[1]!.isSameOrAfter(transactionDate, 'day');
      });
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered;
  }, [transactions, searchText, dateRange, typeFilter, categoryFilter]);

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(transactions.map(t => t.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [transactions]);

  const resetFilters = () => {
    setSearchText('');
    setDateRange(null);
    setTypeFilter('all');
    setCategoryFilter('all');
  };

  // Get transaction type color and icon
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'income':
        return {
          color: 'green',
          text: 'Kirim',
          icon: <ArrowUpOutlined />,
        };
      case 'expense':
        return {
          color: 'red',
          text: 'Chiqim',
          icon: <ArrowDownOutlined />,
        };
      case 'debt':
        return {
          color: 'orange',
          text: 'Qarz',
          icon: <WalletOutlined />,
        };
      default:
        return {
          color: 'default',
          text: type,
          icon: null,
        };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>Tranzaksiyalar yuklanmoqda...</div>
      </div>
    );
  }

  if (!transactions.length) {
    return <Empty description="Tranzaksiyalar mavjud emas" />;
  }

  return (
    <div className="transactions-list">
      <Card className="filter-card" size="small" style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input 
              placeholder="Qidirish" 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            
            <RangePicker 
              value={dateRange}
              onChange={dates => setDateRange(dates)}
              placeholder={['Boshlanish', 'Tugash']}
            />
            
            <Select 
              style={{ width: 150 }} 
              placeholder="Turi" 
              value={typeFilter}
              onChange={value => setTypeFilter(value)}
            >
              <Option value="all">Barcha turlar</Option>
              <Option value="income">Kirim</Option>
              <Option value="expense">Chiqim</Option>
              <Option value="debt">Qarz</Option>
            </Select>
            
            <Select 
              style={{ width: 150 }} 
              placeholder="Kategoriya" 
              value={categoryFilter}
              onChange={value => setCategoryFilter(value)}
            >
              <Option value="all">Barcha kategoriyalar</Option>
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Space>
          
          <Button 
            onClick={resetFilters} 
            type="default" 
            icon={<FilterOutlined />}
          >
            Tozalash
          </Button>
        </Space>
      </Card>
      
      <List
        dataSource={filteredTransactions}
        renderItem={(transaction) => (
          <TransactionItem
            transaction={transaction}
            onTransactionClick={onTransactionClick}
            isSelected={transaction.id === selectedTransactionId}
          />
        )}
        locale={{ emptyText: 'Tranzaksiyalar mavjud emas' }}
      />
    </div>
  );
});

TransactionsList.displayName = 'TransactionsList';

export default TransactionsList; 