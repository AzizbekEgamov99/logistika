import React from 'react';
import { Row, Col, Card, Button, Typography } from 'antd';
import { ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const TopDriversSection = ({ topDriversData, isLoading, viewAll }) => {
  const router = useRouter();

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <Title level={4}><ThunderboltOutlined /> Haydovchi va mijoz munosabatlari</Title>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={24}>
          <Card
            title={<><TrophyOutlined /> Eng yaxshi haydovchilar</>}
            className="dashboard-card"
            extra={
              <Button type="link" onClick={() => viewAll('drivers')}>
                Barchasi
              </Button>
            }
            variant="borderless"
          >
            <div className="top-drivers-container">
              <Row gutter={[16, 16]}>
                {isLoading ? (
                  <div className="loading-container">Yuklanmoqda...</div>
                ) : (
                  topDriversData.slice(0, 5).map((driver, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={driver.id}>
                      <div 
                        className="driver-card" 
                        onClick={() => router.push(`/modules/ceo/drivers/${driver.id}/history`)}
                      >
                        <div className="driver-rank">#{index + 1}</div>
                        <div className="driver-avatar">
                          {driver.photo ? (
                            <img src={driver.photo} alt={driver.fullname} />
                          ) : (
                            <div className="driver-avatar-placeholder">
                              {driver.fullname.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="driver-info">
                          <div className="driver-name">{driver.fullname}</div>
                          <div className="driver-phone">{driver.phone_number}</div>
                          <div className="driver-stats">
                            <div className="stat-item">
                              <div className="stat-label">Jami safar</div>
                              <div className="stat-value">{driver.rays_count}</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-label">Jami daromad</div>
                              <div className="stat-value">${formatCurrency(driver.total_rays_usd || 0)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="view-details">Batafsil ko'rish</div>
                      </div>
                    </Col>
                  ))
                )}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TopDriversSection; 