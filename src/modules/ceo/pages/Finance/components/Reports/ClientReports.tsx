import React from 'react';
import { Typography, Row, Col, Card, Empty, Button } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ClientReportsProps {
  data: any;
}

const ClientReports: React.FC<ClientReportsProps> = ({ data }) => {
  return (
    <div className="client-reports">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Text strong>Mijozlar hisoboti</Text>
                    <br />
                    <Text type="secondary">Bu bo'lim hali ishlab chiqilmoqda</Text>
                  </span>
                }
              >
                <Button type="primary" icon={<TeamOutlined />}>
                  Mijoz hisobotini yaratish
                </Button>
              </Empty>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientReports; 