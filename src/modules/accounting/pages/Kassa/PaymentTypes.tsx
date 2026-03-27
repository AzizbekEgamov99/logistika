import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { cashApi } from '../../api/cash/cashApi';
import { Cash } from '../../types/cash.types';
import { formatMoney } from '@/utils/format';
import dayjs from 'dayjs';

const PaymentTypes: React.FC = () => {
  const [transactions, setTransactions] = useState<Cash[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    cash: 0,
    card: 0,
    transfer: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await cashApi.getCashList();
      setTransactions(data);

      // Calculate summary
      const sum = data.reduce((acc, curr) => {
        const amount = curr.amount || 0;
        switch (curr.payment_way) {
          case 'cash':
            acc.cash += amount;
            break;
          case 'card':
            acc.card += amount;
            break;
          case 'transfer':
            acc.transfer += amount;
            break;
        }
        return acc;
      }, { cash: 0, card: 0, transfer: 0 });

      setSummary(sum);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: 'To\'lov turi',
      dataIndex: 'payment_way',
      key: 'payment_way',
      render: (type: string) => {
        const colors = {
          cash: 'green',
          card: 'blue',
          transfer: 'purple'
        };
        const labels = {
          cash: 'Naqd',
          card: 'Plastik',
          transfer: 'O\'tkazma'
        };
        return (
          <Tag color={colors[type as keyof typeof colors]}>
            {labels[type as keyof typeof labels]}
          </Tag>
        );
      }
    },
    {
      title: 'Mijoz',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Cash) => (
        <span>
          {formatMoney(amount)} {record.currency}
        </span>
      )
    }
  ];

  return (
    <div>
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card>
            <Statistic
              title="Naqd to'lovlar"
              value={summary.cash}
              precision={2}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Plastik to'lovlar"
              value={summary.card}
              precision={2}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pul o'tkazmalar"
              value={summary.transfer}
              precision={2}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={transactions}
          loading={loading}
          rowKey="id"
          pagination={{
            total: transactions.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total}`
          }}
        />
      </Card>
    </div>
  );
};

export default PaymentTypes; 