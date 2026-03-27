import React, { memo } from 'react';
import { Row, Col, Card, Statistic, Progress, Badge } from 'antd';
import { CarOutlined, CheckCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

interface FleetStatsProps {
  totalVehicles: number;
  cars: any[];
  furgons: any[];
  activeCars: number;
  activeFurgons: number;
  availableCars: number;
  availableFurgons: number;
  activePercent: number;
  availablePercent: number;
}

const FleetStats = memo(({ 
  totalVehicles, 
  cars, 
  furgons, 
  activeCars, 
  activeFurgons, 
  availableCars, 
  availableFurgons, 
  activePercent, 
  availablePercent 
}: FleetStatsProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            color: 'white',
            height: '100%'
          }}
        >
          <Statistic 
            title={<Text style={{color: 'white'}}>Jami transportlar</Text>}
            value={totalVehicles} 
            valueStyle={{ color: 'white', fontSize: '36px' }}
            prefix={<CarOutlined />} 
          />
          <div style={{marginTop: '10px'}}>
            <Text style={{color: 'white'}}>{cars.length} avtomobil, {furgons.length} furgon</Text>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            color: 'white',
            height: '100%'
          }}
        >
          <Statistic 
            title={<Text style={{color: 'white'}}>Mavjud transportlar</Text>}
            value={availableCars + availableFurgons} 
            valueStyle={{ color: 'white', fontSize: '36px' }}
            prefix={<CheckCircleOutlined />} 
          />
          <Progress 
            percent={availablePercent} 
            strokeColor="white" 
            trailColor="rgba(255,255,255,0.3)" 
            status="active" 
            style={{marginTop: '10px'}} 
            format={percent => <span style={{color: 'white'}}>{percent}%</span>}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
            color: 'white',
            height: '100%'
          }}
        >
          <Statistic 
            title={<Text style={{color: 'white'}}>Yo&apos;ldagi transportlar</Text>}
            value={activeCars + activeFurgons} 
            valueStyle={{ color: 'white', fontSize: '36px' }}
            prefix={<RocketOutlined />} 
          />
          <Progress 
            percent={activePercent} 
            strokeColor="white" 
            trailColor="rgba(255,255,255,0.3)" 
            status="active" 
            style={{marginTop: '10px'}} 
            format={percent => <span style={{color: 'white'}}>{percent}%</span>}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
            color: 'white',
            height: '100%'
          }}
        >
          <Row align="middle">
            <Col span={12}>
              <Statistic 
                title={<Text style={{color: 'white'}}>Avtomobillar</Text>}
                value={cars.length} 
                valueStyle={{ color: 'white', fontSize: '24px' }}
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title={<Text style={{color: 'white'}}>Furgonlar</Text>}
                value={furgons.length} 
                valueStyle={{ color: 'white', fontSize: '24px' }}
              />
            </Col>
          </Row>
          <div style={{marginTop: '10px'}}>
            <Badge status="processing" text={<Text style={{color: 'white'}}>{activeCars} avtomobil yo&apos;lda</Text>} />
            <br />
            <Badge status="processing" text={<Text style={{color: 'white'}}>{activeFurgons} furgon yo&apos;lda</Text>} />
          </div>
        </Card>
      </Col>
    </Row>
  );
});

export default FleetStats; 