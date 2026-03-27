import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Empty, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';

interface FinancialSummaryProps {
  clientDebts: any[];
  loading: boolean;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ clientDebts, loading }) => {
  // Calculate total debt
  const totalDebt = React.useMemo(() => {
    if (!clientDebts?.length) return 0;
    return clientDebts.reduce((sum, debt) => sum + debt.amount_usd, 0);
  }, [clientDebts]);

  // Get high value debtors (>1000 USD)
  const highValueDebtors = React.useMemo(() => {
    if (!clientDebts?.length) return [];
    return clientDebts.filter(debt => debt.amount_usd > 1000);
  }, [clientDebts]);

  // Get long-term debtors (debts older than 30 days)
  const longTermDebtors = React.useMemo(() => {
    if (!clientDebts?.length) return [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return clientDebts.filter(debt => {
      const debtDate = new Date(debt.created_at);
      return debtDate < thirtyDaysAgo;
    });
  }, [clientDebts]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="financial-summary">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Umumiy qarzlar"
              value={totalDebt}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Qarzdorlar soni"
              value={clientDebts.length}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="O'rtacha qarz miqdori"
              value={clientDebts.length ? (totalDebt / clientDebts.length) : 0}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Qarzdorlar ro'yxati" style={{ marginTop: 16 }}>
        {clientDebts.length > 0 ? (
          <Table
            dataSource={clientDebts}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 10 }}
            columns={[
              {
                title: 'Mijoz',
                dataIndex: ['client_details', 'name'],
                key: 'client',
                render: (text, record) => (
                  <span>
                    {record.client_details?.name || record.client_name || 'Noma\'lum mijoz'}
                  </span>
                ),
              },
              {
                title: 'Qarz miqdori (USD)',
                dataIndex: 'amount_usd',
                key: 'amount',
                render: (amount) => `$${amount.toLocaleString()}`,
                sorter: (a, b) => a.amount_usd - b.amount_usd,
              },
              {
                title: 'Sana',
                dataIndex: 'created_at',
                key: 'date',
                render: (date) => new Date(date).toLocaleDateString(),
                sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
              },
              {
                title: 'Holat',
                key: 'status',
                render: (_, record) => {
                  const debtDate = new Date(record.created_at);
                  const now = new Date();
                  const diffTime = Math.abs(now.getTime() - debtDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  if (diffDays > 60) {
                    return <Tag color="red">Kritik qarz</Tag>;
                  } else if (diffDays > 30) {
                    return <Tag color="orange">Muddati o'tgan</Tag>;
                  } else {
                    return <Tag color="green">Aktiv</Tag>;
                  }
                },
              },
              {
                title: 'Qarz sababchi',
                dataIndex: 'description',
                key: 'description',
                render: (text) => text || 'Kiritilmagan',
              },
            ]}
          />
        ) : (
          <Empty description="Qarzdorlar mavjud emas" />
        )}
      </Card>

      {highValueDebtors.length > 0 && (
        <Card title="Yuqori qiymatli qarzdorlar" style={{ marginTop: 16 }}>
          <Table
            dataSource={highValueDebtors}
            rowKey={(record) => record.id}
            pagination={false}
            columns={[
              {
                title: 'Mijoz',
                dataIndex: ['client_details', 'name'],
                key: 'client',
                render: (text, record) => (
                  <span>
                    {record.client_details?.name || record.client_name || 'Noma\'lum mijoz'}
                  </span>
                ),
              },
              {
                title: 'Qarz miqdori (USD)',
                dataIndex: 'amount_usd',
                key: 'amount',
                render: (amount) => <span style={{ color: '#cf1322', fontWeight: 'bold' }}>${amount.toLocaleString()}</span>,
                sorter: (a, b) => b.amount_usd - a.amount_usd,
              },
              {
                title: 'Sana',
                dataIndex: 'created_at',
                key: 'date',
                render: (date) => new Date(date).toLocaleDateString(),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default FinancialSummary; 