import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography } from 'antd';
import { TeamOutlined, CheckCircleOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;

interface StatCardsProps {
  total: number;
  activeDriversCount: number;
  activeDriversPercentage: number;
  driversOnRoadCount: number;
  driversOnRoadPercentage: number;
  availableDriversCount: number;
  availableDriversPercentage: number;
  onViewAllClick: () => void;
}

const StatCards: React.FC<StatCardsProps> = ({
  total,
  activeDriversCount,
  activeDriversPercentage,
  driversOnRoadCount,
  driversOnRoadPercentage,
  availableDriversCount,
  availableDriversPercentage,
  onViewAllClick,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card
            className="stat-card"
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            <Statistic
              title={<Text style={{ color: 'white' }}>Jami haydovchilar</Text>}
              value={total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: 'white', fontWeight: 'bold' }}
            />
            <div className="stat-footer">
              <a 
                onClick={onViewAllClick}
                style={{ color: 'white', cursor: 'pointer' }}
              >
                Barchasini ko'rish
              </a>
            </div>
          </Card>
        </motion.div>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            className="stat-card"
            style={{
              background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            <Statistic
              title={<Text style={{ color: 'white' }}>Faol haydovchilar</Text>}
              value={activeDriversCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'white', fontWeight: 'bold' }}
              suffix={
                <Text style={{ fontSize: '14px', color: 'white' }}>
                  ({activeDriversPercentage.toFixed(0)}%)
                </Text>
              }
            />
            <Progress
              percent={activeDriversPercentage}
              showInfo={false}
              strokeColor="white"
              trailColor="rgba(255,255,255,0.3)"
              size="small"
            />
          </Card>
        </motion.div>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card
            className="stat-card"
            style={{
              background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            <Statistic
              title={<Text style={{ color: 'white' }}>Yo'ldagi haydovchilar</Text>}
              value={driversOnRoadCount}
              prefix={<CarOutlined />}
              valueStyle={{ color: 'white', fontWeight: 'bold' }}
              suffix={
                <Text style={{ fontSize: '14px', color: 'white' }}>
                  ({driversOnRoadPercentage.toFixed(0)}%)
                </Text>
              }
            />
            <Progress
              percent={driversOnRoadPercentage}
              showInfo={false}
              strokeColor="white"
              trailColor="rgba(255,255,255,0.3)"
              size="small"
            />
          </Card>
        </motion.div>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card
            className="stat-card"
            style={{
              background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            <Statistic
              title={<Text style={{ color: 'white' }}>Mavjud haydovchilar</Text>}
              value={availableDriversCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: 'white', fontWeight: 'bold' }}
              suffix={
                <Text style={{ fontSize: '14px', color: 'white' }}>
                  ({availableDriversPercentage.toFixed(0)}%)
                </Text>
              }
            />
            <Progress
              percent={availableDriversPercentage}
              showInfo={false}
              strokeColor="white"
              trailColor="rgba(255,255,255,0.3)"
              size="small"
            />
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default StatCards; 