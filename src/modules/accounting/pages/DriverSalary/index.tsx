"use client";

import React from 'react';
import { Layout } from 'antd';
import DriverSalaryList from '../../components/DriverSalary/DriverSalaryList';

const { Content } = Layout;

const DriverSalaryPage: React.FC = () => {
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: '#fff',
        }}
      >
        <DriverSalaryList />
      </Content>
    </Layout>
  );
};

export default DriverSalaryPage; 