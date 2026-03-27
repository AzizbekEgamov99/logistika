import React from 'react';
import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import { 
  LineChartOutlined, 
  DollarOutlined, 
  CarOutlined, 
  UserOutlined, 
  PercentageOutlined, 
  ClockCircleOutlined, 
  CheckOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface KPICardProps {
  title: string;
  value: number | string;
  changeValue?: string;
  changeType?: 'success' | 'danger' | 'secondary';
  changeText?: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  delay?: number;
}

const iconMap: Record<string, any> = {
  'LineChartOutlined': LineChartOutlined,
  'DollarOutlined': DollarOutlined,
  'CarOutlined': CarOutlined,
  'UserOutlined': UserOutlined,
  'PercentageOutlined': PercentageOutlined,
  'ClockCircleOutlined': ClockCircleOutlined,
  'CheckOutlined': CheckOutlined
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  changeValue,
  changeType = 'secondary',
  changeText,
  icon,
  iconBgColor,
  iconColor,
  delay = 0,
}) => {
  // Determine which icon component to use
  const IconComponent = iconMap[icon] || LineChartOutlined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="kpi-card" bodyStyle={{ padding: '24px' }}>
        <div className="kpi-card-content">
          <div
            className="kpi-icon"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: `0 4px 12px ${iconBgColor}80`,
            }}
          >
            <IconComponent style={{ color: iconColor, fontSize: '28px' }} />
          </div>
          
          <div className="kpi-meta">
            <Text className="kpi-title" style={{ fontSize: '16px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>{title}</Text>
            <div className="kpi-value" style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a365d', marginBottom: '8px' }}>
              {value}
            </div>
            
            {changeValue && (
              <div className="kpi-change">
                <Text 
                  className={`kpi-change-value ${changeType}`}
                  type={changeType === 'success' ? 'success' : changeType === 'danger' ? 'danger' : 'secondary'}
                  style={{ 
                    fontWeight: '600', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: changeType === 'success' ? 'rgba(82, 196, 26, 0.1)' : 
                               changeType === 'danger' ? 'rgba(245, 34, 45, 0.1)' : 
                               'rgba(0, 0, 0, 0.05)',
                    fontSize: '14px'
                  }}
                >
                  {changeValue}
                </Text>
                {changeText && 
                  <Text type="secondary" style={{ marginLeft: '8px', fontSize: '13px' }}>
                    {changeText}
                  </Text>
                }
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}; 