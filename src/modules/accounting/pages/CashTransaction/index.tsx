'use client';

import React from 'react';
import { Layout, Typography, Breadcrumb } from 'antd';
import CashTransactionList from '../../components/CashTransaction/CashTransactionList';

const { Content } = Layout;
const { Title } = Typography;

const CashTransactionPage: React.FC = () => {
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Kassa</Breadcrumb.Item>
        <Breadcrumb.Item>To`lovlar</Breadcrumb.Item>
      </Breadcrumb>
      
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: '#fff',
        }}
      >
        <Title level={2}>Kassa operatsiyalari</Title>
        <CashTransactionList />
      </Content>
    </Layout>
  );
};

export default CashTransactionPage; 