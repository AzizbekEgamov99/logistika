import React, { useState } from 'react';
import { Table, Tag, Space, Input, Button, Tooltip, Empty } from 'antd';
import { SearchOutlined, PhoneOutlined, MailOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import type { Client } from './ClientPayments';

interface ClientsListProps {
  clients: Client[];
}

const ClientsList: React.FC<ClientsListProps> = ({ clients }) => {
  const [searchText, setSearchText] = useState('');

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchText.toLowerCase()) || 
    client.company?.toLowerCase().includes(searchText.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getBalanceStatus = (balance: number) => {
    if (balance <= 0) return { color: 'success', text: 'Qarz yo\'q' };
    if (balance > 10000) return { color: 'error', text: 'Yuqori qarz' };
    if (balance > 5000) return { color: 'warning', text: 'O\'rtacha qarz' };
    return { color: 'processing', text: 'Kam qarz' };
  };

  return (
    <div className="clients-list">
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Mijoz qidirish..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {filteredClients.length === 0 ? (
        <Empty description="Mijozlar mavjud emas" />
      ) : (
        <Table
          dataSource={filteredClients}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: '№',
              key: 'index',
              width: 60,
              render: (_, __, index) => index + 1,
            },
            {
              title: 'Mijoz',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Space direction="vertical" size={0}>
                  <Space>
                    <UserOutlined />
                    <span style={{ fontWeight: 'bold' }}>{text}</span>
                  </Space>
                  {record.company && <span style={{ color: '#888' }}>{record.company}</span>}
                </Space>
              ),
              sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            },
            {
              title: 'Kontakt',
              key: 'contact',
              render: (_, record) => (
                <Space direction="vertical" size={0}>
                  {record.phone && (
                    <Space>
                      <PhoneOutlined />
                      <span>{record.phone}</span>
                    </Space>
                  )}
                  {record.email && (
                    <Space>
                      <MailOutlined />
                      <span>{record.email}</span>
                    </Space>
                  )}
                </Space>
              ),
            },
            {
              title: 'Balans',
              dataIndex: 'balance',
              key: 'balance',
              render: (balance) => {
                const { color, text } = getBalanceStatus(balance);
                return (
                  <Space direction="vertical" size={0}>
                    <span style={{ 
                      color: balance > 0 ? '#cf1322' : '#3f8600',
                      fontWeight: 'bold'
                    }}>
                      ${Math.abs(balance).toLocaleString()}
                    </span>
                    <Tag color={color}>{text}</Tag>
                  </Space>
                );
              },
              sorter: (a, b) => (a.balance || 0) - (b.balance || 0),
            },
            {
              title: 'Amallar',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Tooltip title="To'lov qo'shish">
                    <Button 
                      type="primary" 
                      icon={<DollarOutlined />} 
                      size="small"
                      onClick={() => console.log('Add payment for', record.id)}
                      disabled={record.balance <= 0}
                    >
                      To'lov
                    </Button>
                  </Tooltip>
                  <Tooltip title="Batafsil ma'lumot">
                    <Button
                      icon={<UserOutlined />}
                      size="small"
                      onClick={() => console.log('View client details', record.id)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          summary={pageData => {
            const totalBalance = pageData.reduce((sum, client) => sum + (client.balance || 0), 0);
            const clientsWithDebt = pageData.filter(client => client.balance > 0).length;
            
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <strong>Jami mijozlar:</strong> {pageData.length}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>Qarzdor mijozlar:</strong> {clientsWithDebt}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>Jami qarz:</strong> ${totalBalance.toLocaleString()}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      )}
    </div>
  );
};

export default ClientsList; 