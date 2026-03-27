import React, { useState } from 'react';
import { Card, Tabs, Typography, Button, Space } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import { mockData } from '../../mockData';
import FinancialReports from './FinancialReports';
import TaxReports from './TaxReports';
import ClientReports from './ClientReports';
import VehicleReports from './VehicleReports';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('financial');
  
  return (
    <div className="reports">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <Title level={4}>Hisobotlar</Title>
          <Text type="secondary">
            Moliyaviy hisobotlar va tahlillar
          </Text>
        </div>
      </div>
      
      <Card>
        <Tabs 
          defaultActiveKey="financial"
          items={[
            {
              key: "financial",
              label: "Moliyaviy hisobotlar",
              children: <FinancialReports data={mockData} />
            },
            {
              key: "tax",
              label: "Soliq hisobotlari",
              children: <TaxReports data={mockData} />
            },
            {
              key: "clients",
              label: "Mijozlar hisoboti",
              children: <ClientReports data={mockData} />
            },
            {
              key: "vehicles",
              label: "Transport hisoboti",
              children: <VehicleReports data={mockData} />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default Reports; 