import React from "react";
import { Spin, Empty, Row, Col, Card, Space, Typography, Statistic, Progress, Table, Badge, Divider } from "antd";
import { motion } from "framer-motion";
import { 
  CarOutlined, 
  CheckCircleOutlined, 
  CompassOutlined,
  AreaChartOutlined,
  FileTextOutlined,
  DashboardOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useFurgonStatus } from "@/modules/accounting/hooks/useFurgon";
import styles from '../style/furgon.module.css';

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const FurgonDashboard: React.FC = () => {
  const { inRaysFurgons, inRaysCount, availableCount, isLoading } = useFurgonStatus();
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <div className={styles.loadingText}>Ma`lumotlar yuklanmoqda...</div>
      </div>
    );
  }

  const totalFurgons = (inRaysCount || 0) + (availableCount || 0);
  const inRaysPercentage = totalFurgons > 0 ? Math.round((inRaysCount / totalFurgons) * 100) : 0;
  const availablePercentage = totalFurgons > 0 ? Math.round((availableCount / totalFurgons) * 100) : 0;

  // Current date for dashboard
  const currentDate = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // So'nggi faoliyatlar uchun ma'lumotlar
  const recentActivities = inRaysFurgons.slice(0, 5).map(furgon => ({
    key: furgon.id,
    name: furgon.name,
    status: furgon.is_busy ? "Yo'lda" : "Mavjud",
    number: furgon.number,
    date: new Date().toLocaleDateString('uz-UZ')
  }));

  const activityColumns = [
    {
      title: 'Furgon',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Raqami',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === "Yo'lda" ? "success" : "processing"} 
          text={<Text style={{ color: status === "Yo'lda" ? '#52c41a' : '#1890ff' }}>{status}</Text>}
        />
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text type="secondary">{date}</Text>
        </Space>
      )
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dashboard header with current date */}
        <Card className={styles.dashboardHeader} style={{ marginBottom: '24px' }}>
          <Space align="center" style={{ marginBottom: '8px' }}>
            <ClockCircleOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            <Text type="secondary">{currentDate}</Text>
          </Space>
          <Title level={4} style={{ margin: 0 }}>Furgonlar boshqaruvi</Title>
        </Card>
        
        {/* Asosiy statistika kartalari */}
        <Row gutter={[24, 24]} className={styles.statsCards}>
          <Col xs={24} sm={8}>
            <motion.div variants={itemVariants}>
              <Card 
                className={styles.statCard} 
                style={{ 
                  borderTop: '4px solid #1890ff',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Statistic
                  title={
                    <Space align="center">
                      <CarOutlined style={{ color: '#1890ff' }} />
                      <Text>Jami furgonlar</Text>
                    </Space>
                  }
                  value={totalFurgons}
                  valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 'bold' }}
                />
                <Divider style={{ margin: '16px 0' }} />
                <Text type="secondary">
                  Barcha furgonlar soni
                </Text>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={8}>
            <motion.div variants={itemVariants}>
              <Card 
                className={styles.statCard} 
                style={{ 
                  borderTop: '4px solid #52c41a',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Statistic
                  title={
                    <Space align="center">
                      <CompassOutlined style={{ color: '#52c41a' }} />
                      <Text>Yo`ldagi furgonlar</Text>
                    </Space>
                  }
                  value={inRaysCount || 0}
                  valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 'bold' }}
                  suffix={<Text type="secondary" style={{ fontSize: '16px' }}>{`${inRaysPercentage}%`}</Text>}
                />
                <Progress 
                  percent={inRaysPercentage} 
                  status="active" 
                  strokeColor="#52c41a" 
                  style={{ marginTop: '12px' }}
                />
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={8}>
            <motion.div variants={itemVariants}>
              <Card 
                className={styles.statCard} 
                style={{ 
                  borderTop: '4px solid #1890ff',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Statistic
                  title={
                    <Space align="center">
                      <CheckCircleOutlined style={{ color: '#1890ff' }} />
                      <Text>Mavjud furgonlar</Text>
                    </Space>
                  }
                  value={availableCount || 0}
                  valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 'bold' }}
                  suffix={<Text type="secondary" style={{ fontSize: '16px' }}>{`${availablePercentage}%`}</Text>}
                />
                <Progress 
                  percent={availablePercentage} 
                  status="active" 
                  strokeColor="#1890ff" 
                  style={{ marginTop: '12px' }}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Qo'shimcha ma'lumotlar kartasi */}
        <Row gutter={[24, 24]} className={styles.detailsCards}>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    <Text strong>So`nggi faoliyatlar</Text>
                  </Space>
                }
                className={styles.dashboardCard}
                style={{ 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px'
                }}
              >
                {recentActivities.length > 0 ? (
                  <Table
                    dataSource={recentActivities}
                    columns={activityColumns}
                    pagination={false}
                    size="middle"
                    className={styles.activityTable}
                    style={{ borderRadius: '8px', overflow: 'hidden' }}
                  />
                ) : (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="So'nggi faoliyatlar mavjud emas"
                  />
                )}
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <AreaChartOutlined style={{ color: '#1890ff' }} />
                    <Text strong>Furgonlar statistikasi</Text>
                  </Space>
                }
                className={styles.dashboardCard}
                style={{ 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px'
                }}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12}>
                    <Card 
                      bordered={false} 
                      className={styles.innerCard}
                      style={{ background: '#f6ffed', borderRadius: '8px' }}
                    >
                      <Statistic
                        title={
                          <Space>
                            <CompassOutlined style={{ color: '#52c41a' }} />
                            <Text>Yo`lda</Text>
                          </Space>
                        }
                        value={inRaysPercentage}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                      />
                      <Progress
                        percent={inRaysPercentage}
                        status="active"
                        strokeColor={{ from: '#52c41a', to: '#87d068' }}
                        style={{ marginTop: '12px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card 
                      bordered={false} 
                      className={styles.innerCard}
                      style={{ background: '#e6f7ff', borderRadius: '8px' }}
                    >
                      <Statistic
                        title={
                          <Space>
                            <CheckCircleOutlined style={{ color: '#1890ff' }} />
                            <Text>Mavjud</Text>
                          </Space>
                        }
                        value={availablePercentage}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                      />
                      <Progress
                        percent={availablePercentage}
                        status="active"
                        strokeColor={{ from: '#1890ff', to: '#69c0ff' }}
                        style={{ marginTop: '12px' }}
                      />
                    </Card>
                  </Col>
                </Row>
                <div className={styles.statisticInfo} style={{ marginTop: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <DashboardOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <Text>
                    {inRaysPercentage > availablePercentage 
                      ? "Ko'proq furgonlar yo'lda" 
                      : "Ko'proq furgonlar mavjud"}
                  </Text>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default FurgonDashboard;