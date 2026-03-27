import React from 'react';
import { Table, Card, Typography, Avatar, Progress, Tag, Spin } from 'antd';
import { UserOutlined, CarOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DriverPerformance } from '../types';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/dataProcessors';

const { Title } = Typography;
const { Column } = Table;

interface DriverPerformanceTableProps {
  data: DriverPerformance[];
  loading: boolean;
}

export const DriverPerformanceTable: React.FC<DriverPerformanceTableProps> = ({ data, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ margin: 0 }}>Top Performing Drivers</Title>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            dataSource={data} 
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
          >
            <Column
              title="Driver"
              key="driver"
              render={(text, record: DriverPerformance) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    size={40} 
                    style={{ marginRight: '12px', backgroundColor: '#1890ff' }}
                  />
                  <span>{record.driverName}</span>
                </div>
              )}
            />
            
            <Column
              title="Deliveries"
              dataIndex="deliveriesCompleted"
              key="deliveriesCompleted"
              width={120}
              render={(value) => (
                <span>
                  <CarOutlined style={{ marginRight: '5px', color: '#1890ff' }} />
                  {value}
                </span>
              )}
              sorter={(a: DriverPerformance, b: DriverPerformance) => 
                a.deliveriesCompleted - b.deliveriesCompleted
              }
            />
            
            <Column
              title="On-Time Rate"
              dataIndex="onTimeDeliveryRate"
              key="onTimeDeliveryRate"
              width={180}
              render={(value) => (
                <Progress 
                  percent={Math.round(value)} 
                  size="small" 
                  status={value >= 90 ? 'success' : value >= 75 ? 'normal' : 'exception'}
                  style={{ marginBottom: 0 }}
                />
              )}
              sorter={(a: DriverPerformance, b: DriverPerformance) => 
                a.onTimeDeliveryRate - b.onTimeDeliveryRate
              }
            />
            
            <Column
              title="Customer Rating"
              dataIndex="customerRating"
              key="customerRating"
              width={150}
              render={(value) => {
                let color = '';
                if (value >= 4.5) color = 'green';
                else if (value >= 4.0) color = 'blue';
                else if (value >= 3.5) color = 'orange';
                else color = 'red';
                
                return <Tag color={color}>{value.toFixed(1)} / 5.0</Tag>;
              }}
              sorter={(a: DriverPerformance, b: DriverPerformance) => 
                a.customerRating - b.customerRating
              }
            />
            
            <Column
              title="Revenue Generated"
              dataIndex="revenue"
              key="revenue"
              width={150}
              render={(value) => (
                <span>
                  <DollarOutlined style={{ marginRight: '5px', color: '#52c41a' }} />
                  {formatCurrency(value)}
                </span>
              )}
              sorter={(a: DriverPerformance, b: DriverPerformance) => a.revenue - b.revenue}
            />
            
            <Column
              title="Performance"
              key="performance"
              width={100}
              render={(text, record: DriverPerformance) => {
                // Calculate a performance score based on multiple metrics
                const performanceScore = 
                  (record.onTimeDeliveryRate * 0.4) + 
                  (record.customerRating * 20 * 0.3) + 
                  (Math.min(record.deliveriesCompleted / 20, 1) * 100 * 0.3);
                
                let color = '';
                if (performanceScore >= 90) color = 'success';
                else if (performanceScore >= 75) color = 'processing';
                else if (performanceScore >= 60) color = 'warning';
                else color = 'error';
                
                return (
                  <Tag icon={<CheckCircleOutlined />} color={color}>
                    {Math.round(performanceScore)}%
                  </Tag>
                );
              }}
            />
          </Table>
        )}
      </Card>
    </motion.div>
  );
}; 