import React, { memo } from 'react';
import { Row, Col, Card, Button } from 'antd';
import { PlusOutlined, CarOutlined } from '@ant-design/icons';

interface QuickActionsProps {
  handleAddCar: () => void;
  handleAddFurgon: () => void;
  setActiveTab: (tab: string) => void;
}

const QuickActions = memo(({ handleAddCar, handleAddFurgon, setActiveTab }: QuickActionsProps) => {
  return (
    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
      <Col span={24}>
        <Card
          bordered={false}
          style={{ borderRadius: '12px' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAddCar}
                block
                style={{ height: '60px', fontSize: '16px' }}
              >
                Yangi avtomobil qo&apos;shish
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAddFurgon}
                block
                style={{ height: '60px', fontSize: '16px', background: '#52c41a', borderColor: '#52c41a' }}
              >
                Yangi furgon qo&apos;shish
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="default" 
                size="large"
                icon={<CarOutlined />}
                onClick={() => setActiveTab('cars')}
                block
                style={{ height: '60px', fontSize: '16px' }}
              >
                Avtomobillar ro&apos;yxati
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="default" 
                size="large"
                icon={<CarOutlined />}
                onClick={() => setActiveTab('furgons')}
                block
                style={{ height: '60px', fontSize: '16px' }}
              >
                Furgonlar ro&apos;yxati
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
});

export default QuickActions; 