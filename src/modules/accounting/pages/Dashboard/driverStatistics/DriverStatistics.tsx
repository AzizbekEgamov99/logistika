import React, { useState } from 'react';
import {
  UserOutlined,
  CarOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Row,
  Col,
  Card,
  Tabs,
} from 'antd';
import { StatCard } from '../../../components/StatCard';
import { ProgressCard } from '../../../components/ProgressCard';
import { BarChart } from '../../../components/charts/BarChart';
import { AreaChart } from '../../../components/charts/AreaChart';
import { TopDriversList } from '../../../components/TopDriversList';
import { RecentDeliveriesList } from '../../../components/deliveries/RecentDeliveriesList';
import { MaintenanceSchedule } from '../../../components/maintenance/MaintenanceSchedule';
import {
  MONTHLY_REVENUE,  
  MONTHLY_DELIVERIES,
  TOP_DRIVERS,
  RECENT_DELIVERIES,
  MAINTENANCE_SCHEDULE
} from '../../../constants/theme';
import { useDrivers } from '@/modules/accounting/hooks/useDrivers';
import { useCars } from '@/modules/accounting/hooks/useCars';
const { Content } = Layout;
const DriverStatistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const {drivers}=useDrivers()
  const {cars}=useCars()
  return (
    <Layout>
      <Content style={{ margin: '24px', overflowY: 'auto' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              icon={<UserOutlined />}
              iconBgColor="#eff6ff"
              iconColor="#4f7cff"
              title="Haydovchilar"
              value={drivers.length}
              changeValue="↑ 8.2%"
              changeType="success"
              changeText="O'tgan oyga nisbatan"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              icon={<CarOutlined />}
              iconBgColor="#fff1f0"
              iconColor="#ff4d4f"
              title="Faol mashinalar"
              value={cars.length}
              changeValue="↓ 3.5%"
              changeType="danger"
              changeText="O'tgan oyga nisbatan"
              delay={0.1}
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <ProgressCard
              title="Oylik maqsad"
              percent={84.5}
              description="Maqsadning 84.5% bajarildi"
              subdescription="Joriy oy: $18.2K / $50K"
              delay={0.2}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={16}>
            <Card
              title="Daromad statistikasi"
              extra={
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={[
                    { key: 'monthly', label: 'Oylik' },
                    { key: 'weekly', label: 'Haftalik' }
                  ]}
                  size="small"
                />
              }
            >
              <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <StatCard
                    icon={<DollarCircleOutlined />}
                    iconBgColor="#f6ffed"
                    iconColor="#52c41a"
                    title="Maqsad"
                    value="$50K"
                    delay={0.3}
                  />
                </Col>
                <Col span={8}>
                  <StatCard
                    icon={<DollarCircleOutlined />}
                    iconBgColor="#f6ffed"
                    iconColor="#52c41a"
                    title="Daromad"
                    value="$48.7K"
                    delay={0.3}
                  />
                </Col>
                <Col span={8}>
                  <StatCard
                    icon={<DollarCircleOutlined />}
                    iconBgColor="#f6ffed"
                    iconColor="#52c41a"
                    title="Joriy oy"
                    value="$18.2K"
                    delay={0.3}
                  />
                </Col>
              </Row>
              {activeTab === 'monthly' ? (
                <AreaChart data={MONTHLY_DELIVERIES} />
              ) : (
                <BarChart
                  title=""
                  data={MONTHLY_REVENUE.slice(-7)}
                  delay={0.4}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <TopDriversList
              title="Eng yaxshi haydovchilar"
              subtitle="Joriy oy"
              drivers={TOP_DRIVERS}
              delay={0.4}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={12}>
            <RecentDeliveriesList
              deliveries={RECENT_DELIVERIES}
              delay={0.5}
            />
          </Col>

          <Col xs={24} lg={12}>
            <MaintenanceSchedule
              maintenanceItems={MAINTENANCE_SCHEDULE}
              delay={0.6}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <BarChart
              title="Oylik daromad"
              data={MONTHLY_REVENUE}
              delay={0.7}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default DriverStatistics;  