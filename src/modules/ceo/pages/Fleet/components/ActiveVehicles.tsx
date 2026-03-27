import React, { memo } from 'react';
import { Row, Col, Card, Table, Button, Empty, Tag, Typography } from 'antd';
import { EnvironmentOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface ActiveVehiclesProps {
  activeVehicles: number;
  cars: any[];
  furgons: any[];
  carColumns: any[];
  handleViewCarHistory: (id: number) => void;
  handleViewFurgonHistory: (id: number) => void;
  setActiveTab: (tab: string) => void;
}

const ActiveVehicles = memo(({ 
  activeVehicles, 
  cars, 
  furgons, 
  carColumns, 
  handleViewCarHistory, 
  handleViewFurgonHistory,
  setActiveTab
}: ActiveVehiclesProps) => {

  // Filter active vehicles for better performance
  const activeCarsList = cars.filter(car => car.is_busy).map(car => ({...car, key: `car-${car.id}`}));
  const activeFurgonsList = furgons.filter(furgon => furgon.is_busy).map(furgon => ({...furgon, key: `furgon-${furgon.id}`}));

  // Combine data sources
  const activeVehiclesList = [...activeCarsList, ...activeFurgonsList];

  return (
    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
      <Col span={24}>
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EnvironmentOutlined style={{ fontSize: '18px', marginRight: '8px', color: '#1890ff' }} />
              <Title level={5} style={{ margin: 0 }}>Yo&apos;ldagi transport vositalari</Title>
            </div>
          }
          bordered={false}
          style={{ borderRadius: '12px' }}
          extra={
            <Button type="primary" ghost onClick={() => setActiveTab('active')}>
              Barchasini Ko`rish
            </Button>
          }
        >
          {activeVehicles > 0 ? (
            <Table
              columns={[
                carColumns[0], // Avtomobil/Furgon
                {
                  title: 'Turi',
                  key: 'type',
                  render: (_, record) => (
                    <Tag color={record.hasOwnProperty('car_number') ? 'blue' : 'green'}>
                      {record.hasOwnProperty('car_number') ? 'Avtomobil' : 'Furgon'}
                    </Tag>
                  )
                },
                carColumns[2], // Holati
                {
                  title: 'Ko`rish',
                  key: 'view',
                  render: (_, record) => (
                    <Button
                      type="primary"
                      size="small"
                      icon={<HistoryOutlined />}
                      onClick={() => record.hasOwnProperty('car_number') 
                        ? handleViewCarHistory(record.id)
                        : handleViewFurgonHistory(record.id)}
                    >
                      Ko`rish
                    </Button>
                  )
                }
              ]}
              dataSource={activeVehiclesList}
              rowKey={record => record.key || record.id.toString()}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          ) : (
            <Empty description="Yo'lda transport vositalari mavjud emas" />
          )}
        </Card>
      </Col>
    </Row>
  );
});

export default ActiveVehicles; 