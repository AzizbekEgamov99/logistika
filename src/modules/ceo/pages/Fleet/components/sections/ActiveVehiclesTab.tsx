import React from 'react';
import { Row, Col, Card, Table, Empty, Typography } from 'antd';
import { Vehicle } from '../../types';

const { Title } = Typography;

interface ActiveVehiclesTabProps {
  statusSummary: {
    activeCars: number;
    activeFurgons: number;
    cars: Vehicle[];
    furgons: Vehicle[];
  };
  carColumns: any[];
  furgonColumns: any[];
}

const ActiveVehiclesTab: React.FC<ActiveVehiclesTabProps> = ({
  statusSummary,
  carColumns,
  furgonColumns,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card 
          title={<Title level={5}>Yo'ldagi avtomobillar</Title>}
          style={{ borderRadius: '12px' }}
          variant="borderless"
        >
          {statusSummary.activeCars > 0 ? (
            <Table
              columns={carColumns}
              dataSource={statusSummary.cars
                .filter(car => car.is_busy)
                .map(car => ({...car, key: `car-${car.id}`}))}
              rowKey={record => record.key || record.id.toString()}
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <Empty description="Yo'lda avtomobillar mavjud emas" />
          )}
        </Card>
      </Col>
      <Col span={24}>
        <Card 
          title={<Title level={5}>Yo'ldagi furgonlar</Title>}
          style={{ borderRadius: '12px' }}
          variant="borderless"
        >
          {statusSummary.activeFurgons > 0 ? (
            <Table
              columns={furgonColumns}
              dataSource={statusSummary.furgons
                .filter(furgon => furgon.is_busy)
                .map(furgon => ({...furgon, key: `furgon-${furgon.id}`}))}
              rowKey={record => record.key || record.id.toString()}
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <Empty description="Yo'lda furgonlar mavjud emas" />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ActiveVehiclesTab; 