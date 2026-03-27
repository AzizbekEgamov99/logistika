import React from 'react';
import { Card, Table, Typography, Badge, Tag } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { ServiceTotals } from '../api/serviceTotals';

const { Text, Title } = Typography;

interface ServiceDetailsTableProps {
  totals: ServiceTotals | null;
}

const styles = {
  tableCard: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '32px',
    border: 'none',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #36cfc9 0%, #13c2c2 100%)',
    color: 'white'
  },
  tableContent: {
    padding: '0'
  },
  iconBlue: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '8px',
    borderRadius: '50%',
    marginRight: '8px'
  },
  summaryRow: {
    backgroundColor: '#f6ffed',
    fontWeight: 'bold'
  },
  percentTag: {
    minWidth: '60px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  tableTitle: {
    color: 'white', 
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  }
};

const ServiceDetailsTable: React.FC<ServiceDetailsTableProps> = ({ totals }) => {
  if (!totals) return null;

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return '0 so\'m';
    return `${value.toLocaleString()} $`;
  };

  const calculatePercentage = (value: number) => {
    return `${Math.round((value / totals.total) * 100)}%`;
  };

  const getTagColor = (percentage: number) => {
    if (percentage >= 75) return 'red';
    if (percentage >= 50) return 'orange';
    if (percentage >= 25) return 'blue';
    return 'green';
  };

  const data = [
    {
      key: '1',
      category: 'Texnik xizmat',
      amount: totals.texnic,
      percentage: calculatePercentage(totals.texnic),
      percentValue: Math.round((totals.texnic / totals.total) * 100),
      status: 'success',
      color: '#eb2f96'
    },
    {
      key: '2',
      category: 'Moy xizmati',
      amount: totals.optol,
      percentage: calculatePercentage(totals.optol),
      percentValue: Math.round((totals.optol / totals.total) * 100),
      status: 'processing',
      color: '#fa8c16'
    },
    {
      key: '3',
      category: 'Balon xizmati',
      amount: totals.balon,
      percentage: calculatePercentage(totals.balon),
      percentValue: Math.round((totals.balon / totals.total) * 100),
      status: 'warning',
      color: '#722ed1'
    },
    {
      key: '4',
      category: 'Chiqimlar',
      amount: totals.chiqimlik,
      percentage: calculatePercentage(totals.chiqimlik),
      percentValue: Math.round((totals.chiqimlik / totals.total) * 100),
      status: 'default',
      color: '#52c41a'
    }
  ];

  const columns = [
    {
      title: 'Xizmat turi',
      dataIndex: 'category',
      key: 'category',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge color={record.color} style={{ marginRight: '8px' }} />
          <Text strong>{text}</Text>
        </div>
      )
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as 'right',
      render: (amount: number) => (
        <Text strong style={{ fontSize: '14px' }}>
          {formatCurrency(amount)}
        </Text>
      )
    },
    {
      title: 'Foiz',
      dataIndex: 'percentage',
      key: 'percentage',
      align: 'center' as 'center',
      render: (percentage: string, record: any) => (
        <Tag 
          color={getTagColor(record.percentValue)} 
          style={styles.percentTag}
        >
          {percentage}
        </Tag>
      )
    }
  ];

  return (
    <Card 
      style={styles.tableCard}
      styles={{ body: { padding: 0 } }}
    >
      <div style={styles.tableHeader}>
        <Title level={4} style={styles.tableTitle}>
          <BarChartOutlined style={styles.iconBlue} />
          Xizmatlar bo'yicha batafsil ma'lumot
        </Title>
      </div>

      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false}
        bordered={false}
        style={styles.tableContent}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row style={styles.summaryRow}>
              <Table.Summary.Cell index={0}>
                <Text strong>Jami</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong style={{ fontSize: '16px', color: '#1677ff' }}>{formatCurrency(totals.total)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center">
                <Tag color="green" style={{ ...styles.percentTag, fontSize: '14px' }}>100%</Tag>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default ServiceDetailsTable; 