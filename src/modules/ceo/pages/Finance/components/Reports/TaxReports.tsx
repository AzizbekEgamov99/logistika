import React from 'react';
import { Typography, Row, Col, Card, Empty, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TaxReportsProps {
  data: any;
}

const TaxReports: React.FC<TaxReportsProps> = ({ data }) => {
  return (
    <div className="tax-reports">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Text strong>Soliq hisobotlari</Text>
                    <br />
                    <Text type="secondary">Bu bo'lim hali ishlab chiqilmoqda</Text>
                  </span>
                }
              >
                <Button type="primary" icon={<FileTextOutlined />}>
                  Soliq hisobotini yaratish
                </Button>
              </Empty>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaxReports; 