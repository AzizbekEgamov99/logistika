import React from 'react';
import { Row, Col, Spin } from 'antd';
import { KPICard } from './KPICard';
import { KPI } from '../types';
import { motion } from 'framer-motion';

interface KPICardGridProps {
  kpis: KPI[];
  loading: boolean;
}

export const KPICardGrid: React.FC<KPICardGridProps> = ({ kpis, loading }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {kpis.map((kpi, index) => (
        <Col xs={24} sm={12} md={8} key={`kpi-${index}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <KPICard
              title={kpi.title}
              value={kpi.value}
              changeValue={kpi.change > 0 ? `+${kpi.change.toFixed(2)}%` : `${kpi.change.toFixed(2)}%`}
              changeType={kpi.changeType}
              changeText={kpi.changeText}
              icon={kpi.icon}
              iconBgColor={kpi.iconBgColor}
              iconColor={kpi.iconColor}
              delay={index * 0.1}
            />
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}; 