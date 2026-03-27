import React from 'react';
import { Row, Col, Card, Button, Typography, Statistic, Divider } from 'antd';
import { ThunderboltOutlined, LineChartOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PopularRoutesTable } from '../../../../components/tables/PopularRoutesTable';

const { Title } = Typography;

const TripStatisticsSection = ({ 
  activeTripsCount, 
  completedTripsCount, 
  totalTripsCount,
  popularRoutesData,
  isLoadingPopularRoutes,
  viewAll 
}) => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <Title level={4}><ThunderboltOutlined /> Transport qatnovlari</Title>
        <Button type="primary" ghost onClick={() => viewAll('trips')}>
          Batafsil ko`rish
        </Button>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={<><LineChartOutlined /> Eng mashhur marshrutlar</>}
            className="dashboard-card"
            variant="borderless"
          >
            <PopularRoutesTable
              data={popularRoutesData}
              loading={isLoadingPopularRoutes}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<><LineChartOutlined /> Qatnovlar statistikasi</>}
            className="dashboard-card"
            variant="borderless"
          >
            <div className="trips-stats-container">
              <Row gutter={[24, 24]}>
                <Col xs={12} md={8}>
                  <Card className="stat-card" variant="borderless">
                    <Statistic
                      title="Jami qatnovlar"
                      value={totalTripsCount}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} md={8}>
                  <Card className="stat-card" variant="borderless">
                    <Statistic
                      title="Faol qatnovlar"
                      value={activeTripsCount}
                      valueStyle={{ color: '#fa8c16' }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={12} md={8}>
                  <Card className="stat-card" variant="borderless">
                    <Statistic
                      title="Bajarilgan"
                      value={completedTripsCount}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TripStatisticsSection; 