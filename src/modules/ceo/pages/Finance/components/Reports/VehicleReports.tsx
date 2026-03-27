import React from 'react';
import { Typography, Row, Col, Card, Empty, Button } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface VehicleReportsProps {
  data: any;
}

const VehicleReports: React.FC<VehicleReportsProps> = ({ data }) => {
  return (
    <div className="vehicle-reports">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Text strong>Transport hisoboti</Text>
                    <br />
                    <Text type="secondary">Bu bo'lim hali ishlab chiqilmoqda</Text>
                  </span>
                }
              >
                <Button type="primary" icon={<CarOutlined />}>
                  Transport hisobotini yaratish
                </Button>
              </Empty>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VehicleReports; 