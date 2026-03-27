'use client';

import React from 'react';
import { Tabs, Card } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import AdminManagement from './components/AdminManagement';
import ProtectedRoute from '@/components/ProtectedRoute';

const { TabPane } = Tabs;

const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['ceo']}>
      <DashboardLayout title="Administratorlarni boshqarish">
        <Card style={{ marginBottom: 24 }}>
          <Tabs defaultActiveKey="admins" type="card">
            <TabPane 
              tab={<span><UserOutlined /> Administratorlar</span>} 
              key="admins"
            >
              <AdminManagement />
            </TabPane>
          </Tabs>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminPage; 