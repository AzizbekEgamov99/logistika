"use client";

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, DollarOutlined, CarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h1>Boshqaruv paneli</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Haydovchilar" 
              value={15} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Joriy oyda to'lovlar" 
              value={2450000} 
              prefix={<DollarOutlined />} 
              valueStyle={{ color: '#cf1322' }}
              suffix="UZS"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Mashina soni" 
              value={8} 
              prefix={<CarOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Faol buyurtmalar" 
              value={6} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 32 }}>
        <Card title="So'nggi faoliyat">
          <p>Haydovchi to'lovlari yangilandi - 2 soat oldin</p>
          <p>Yangi haydovchi qo'shildi - 5 soat oldin</p>
          <p>Yangi buyurtma qabul qilindi - 1 kun oldin</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 