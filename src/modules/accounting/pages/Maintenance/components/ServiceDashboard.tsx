import React from 'react';
import { Row, Col, Card, Table, Typography, Avatar, Empty, Space, Statistic, Spin, Divider } from 'antd';
import { 
  ToolOutlined, DollarOutlined, CalendarOutlined, CheckCircleOutlined,
  ExperimentOutlined, SettingOutlined, DashboardOutlined, BarChartOutlined
} from '@ant-design/icons';
import { useServiceManagement } from '../hooks/useServiceManagement';
import { useOptolManagement } from '../hooks/useOptolManagement';
import { useBalonManagement } from '../hooks/useBalonManagement';
import { useServiceTotals } from '../hooks/useServiceTotals';
import ServiceDetailsTable from './ServiceDetailsTable';

const { Title, Text } = Typography;

const styles = {
  dashboardContainer: {
    background: '#f7f7f7',
    minHeight: '100%',
    padding: '24px 0'
  },
  dashboardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    background: 'linear-gradient(135deg, #1677ff 0%, #0d47a1 100%)',
    padding: '20px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '10px',
    borderRadius: '50%',
    fontSize: '24px'
  },
  dashboardCard: {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s',
    height: '100%',
    border: 'none'
  },
  cardAvatar: {
    marginRight: '16px'
  },
  tableTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  iconBlue: {
    color: '#1677ff'
  },
  statsRow: {
    marginBottom: '32px'
  },
  totalCard: {
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: '32px',
    display: 'flex', 
    alignItems: 'center',
    gap: '10px'
  },
  contentWrapper: {
    padding: '0 24px',
    width: '100%'
  },
  statisticCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    height: '100%'
  },
  statisticHeader: {
    padding: '16px 20px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    color: 'white'
  },
  statisticContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statisticNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '8px'
  },
  statisticLabel: {
    textAlign: 'center',
    marginTop: '8px',
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.65)'
  },
  tableWrapper: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    padding: '20px',
    marginTop: '24px'
  },
  countCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    height: '100%',
    border: 'none'
  },
  countCardHeader: {
    padding: '16px 20px',
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  },
  countCardContent: {
    padding: '20px',
    textAlign: 'center'
  },
  countNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '16px 0'
  },
  countDescription: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.65)'
  }
};

const ServiceDashboard: React.FC = () => {
  const { services, isLoading: servicesLoading } = useServiceManagement();
  const { optolServices, isLoading: optolLoading } = useOptolManagement();
  const { balonServices, isLoading: balonLoading } = useBalonManagement();
  const { 
    totals, 
    isLoading: totalsLoading
  } = useServiceTotals();
  
  const isLoading = servicesLoading || optolLoading || balonLoading || totalsLoading;
  
  // Calculate statistics
  const totalServices = services?.length || 0;
  const totalOptolServices = optolServices?.length || 0;
  const totalBalonServices = balonServices?.length || 0;

  const columns = [
    {
      title: 'Xizmat nomi',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Narx',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (price ? `${price.toLocaleString()} $` : 'Belgilanmagan'),
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} $`;
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.contentWrapper}>
        {/* Dashboard Header */}
        <div style={styles.dashboardHeader}>
          <Title level={3} style={styles.headerTitle}>
            <DashboardOutlined style={styles.headerIcon} /> Texnik xizmat ko`rsatish
          </Title>
        </div>

        {/* Stats Cards Section */}
        <Row gutter={[24, 24]} style={styles.statsRow}>
          <Col xs={24} sm={12} md={6}>
            <div style={styles.statisticCard}>
              <div style={{ ...styles.statisticHeader, background: 'linear-gradient(135deg, #1677ff 0%, #0d47a1 100%)' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Umumiy summa</Text>
              </div>
              <div style={styles.statisticContent}>
                <DollarOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
                <div style={styles.statisticNumber}>{formatCurrency(totals?.total || 0)}</div>
                <div style={styles.statisticLabel}>Jami to'lovlar</div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div style={styles.statisticCard}>
              <div style={{ ...styles.statisticHeader, background: 'linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%)' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Texnik xizmat</Text>
              </div>
              <div style={styles.statisticContent}>
                <SettingOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />
                <div style={styles.statisticNumber}>{formatCurrency(totals?.texnic || 0)}</div>
                <div style={styles.statisticLabel}>Texnik xizmat uchun</div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={styles.statisticCard}>
              <div style={{ ...styles.statisticHeader, background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Moy xizmati</Text>
              </div>
              <div style={styles.statisticContent}>
                <ExperimentOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />
                <div style={styles.statisticNumber}>{formatCurrency(totals?.optol || 0)}</div>
                <div style={styles.statisticLabel}>Moy xizmati uchun</div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={styles.statisticCard}>
              <div style={{ ...styles.statisticHeader, background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Balon xizmati</Text>
              </div>
              <div style={styles.statisticContent}>
                <CheckCircleOutlined style={{ fontSize: '32px', color: '#722ed1' }} />
                <div style={styles.statisticNumber}>{formatCurrency(totals?.balon || 0)}</div>
                <div style={styles.statisticLabel}>Balon xizmati uchun</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Service Details Table */}
        <ServiceDetailsTable totals={totals} />

        {/* Count Statistics */}
        <Title level={4} style={styles.sectionTitle}><ToolOutlined style={{ color: '#1677ff' }} /> Xizmatlar miqdori</Title>
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={8}>
            <div style={styles.countCard}>
              <div style={{ ...styles.countCardHeader, background: 'linear-gradient(135deg, #1677ff 0%, #0d47a1 100%)' }}>
                <Avatar size={48} icon={<ToolOutlined />} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Text style={{ color: 'white', marginLeft: '12px', fontWeight: 'bold', fontSize: '16px' }}>Jami xizmatlar</Text>
              </div>
              <div style={styles.countCardContent}>
                <div style={styles.countNumber}>
                  {totalServices}
                </div>
                <div style={styles.countDescription}>
                  Ro'yxatga olingan xizmatlar soni
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={8}>
            <div style={styles.countCard}>
              <div style={{ ...styles.countCardHeader, background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)' }}>
                <Avatar size={48} icon={<ExperimentOutlined />} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Text style={{ color: 'white', marginLeft: '12px', fontWeight: 'bold', fontSize: '16px' }}>Moy xizmatlari</Text>
              </div>
              <div style={styles.countCardContent}>
                <div style={styles.countNumber}>
                  {totalOptolServices}
                </div>
                <div style={styles.countDescription}>
                  Moy xizmatlari soni
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={8}>
            <div style={styles.countCard}>
              <div style={{ ...styles.countCardHeader, background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)' }}>
                <Avatar size={48} icon={<CheckCircleOutlined />} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Text style={{ color: 'white', marginLeft: '12px', fontWeight: 'bold', fontSize: '16px' }}>Balon xizmatlari</Text>
              </div>
              <div style={styles.countCardContent}>
                <div style={styles.countNumber}>
                  {totalBalonServices}
                </div>
                <div style={styles.countDescription}>
                  Balon xizmatlari soni
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default ServiceDashboard;