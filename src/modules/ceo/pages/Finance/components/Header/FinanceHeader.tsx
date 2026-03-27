import React from 'react';
import { Typography, Button, Space, Tooltip } from 'antd';
import { BankOutlined, ReloadOutlined, PrinterOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface FinanceHeaderProps {
  onRefresh: () => void;
  onPrint: () => void;
  isLoading: boolean;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({ 
  onRefresh, 
  onPrint, 
  isLoading 
}) => {
  return (
    <div className="dashboard-header">
      <div className="dashboard-title">
        <Title level={2}>
          <BankOutlined /> Moliya va Buxgalteriya
        </Title>
      </div>
      <div className="dashboard-actions">
        <Space>
          <Tooltip title="Yangilash">
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={isLoading}
            >
              Yangilash
            </Button>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default FinanceHeader; 