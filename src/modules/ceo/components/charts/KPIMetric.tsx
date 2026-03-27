import React from 'react';
import { Card, Tag, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface KPIMetricProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: React.ReactNode;
  change?: number;
  loading?: boolean;
  color?: string;
  icon?: React.ReactNode;
  precision?: number;
  compareText?: string;
}

export const KPIMetric: React.FC<KPIMetricProps> = ({
  title,
  value,
  suffix,
  prefix,
  change,
  color = '#3f8600',
  icon,
  precision = 0,
  compareText = "O'tgan davr bilan"
}) => {
  const getChangeTag = () => {
    if (change === undefined || change === null) return null;
    
    const isPositive = change > 0;
    const icon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    
    return (
      <Tooltip title={`${isPositive ? 'Ortdi' : 'Kamaydi'}: ${Math.abs(change).toFixed(1)}%`}>
        <Tag 
          color={isPositive ? 'success' : 'error'}
          style={{ 
            borderRadius: '20px', 
            padding: '2px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500
          }}
        >
          {icon} {Math.abs(change).toFixed(1)}%
        </Tag>
      </Tooltip>
    );
  };
  
  const getIconElement = () => {
    if (!icon) return null;
    
    return (
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 12, 
          background: `${color}15`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 22,
          color,
          boxShadow: `0 4px 10px ${color}25`,
        }}
      >
        {icon}
      </motion.div>
    );
  };

  // Format value for better readability
  const formatValue = (val: number | string): string => {
    if (typeof val !== 'number') return val.toString();
    
    if (!val && val !== 0) return '0';
    
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(precision) + ' B';
    } else if (val >= 1000000) {
      return (val / 1000000).toFixed(precision) + ' M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(precision) + ' K';
    }
    
    return val.toFixed(precision);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="kpi-metric-card" bordered={false}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          {getIconElement()}
          <div style={{ flex: 1, marginLeft: icon ? '16px' : 0 }}>
            <h3 className="metric-title">{title}</h3>
            <div className="metric-value" style={{ color }}>
              {prefix && <span className="metric-prefix">{prefix}</span>}
              <span>{typeof value === 'number' ? formatValue(value) : value}</span>
              {suffix && <span className="metric-suffix">{suffix}</span>}
            </div>
          </div>
        </div>
        
        {change !== undefined && (
          <div className="metric-footer">
            {getChangeTag()}
            <span className="metric-compare">{compareText}</span>
          </div>
        )}
      </Card>
      
      <style jsx global>{`
        .kpi-metric-card {
          height: 100%;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background: white;
          overflow: hidden;
          position: relative;
        }
        
        .kpi-metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: ${color};
          opacity: 0.7;
        }
        
        .kpi-metric-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        .kpi-metric-card .ant-card-body {
          padding: 20px;
        }
        
        .metric-title {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .metric-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        
        .metric-prefix, .metric-suffix {
          font-size: 16px;
          font-weight: 500;
        }
        
        .metric-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
        
        .metric-compare {
          color: rgba(0, 0, 0, 0.45);
          font-size: 13px;
        }
        
        @media (max-width: 768px) {
          .metric-value {
            font-size: 24px;
          }
        }
      `}</style>
    </motion.div>
  );
}; 