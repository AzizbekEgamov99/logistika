import React from 'react';
import { Drawer, Timeline, Tag, Card, Typography, Empty, Statistic, Row, Col, Divider } from 'antd';
import { 
  HistoryOutlined, 
  CarOutlined, 
  ToolOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface VehicleHistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  vehicle: any;
  history: any[];
}

export const VehicleHistoryDrawer: React.FC<VehicleHistoryDrawerProps> = ({
  visible,
  onClose,
  vehicle,
  history
}) => {
  if (!vehicle) return null;

  // Calculate total stats from history
  const totalTrips = history.filter(item => item.type === 'trip').length;
  const totalMaintenance = history.filter(item => item.type === 'maintenance').length;
  const totalRevenue = history
    .filter(item => item.type === 'trip')
    .reduce((sum, item) => sum + (item.details?.revenue || 0), 0);
  const totalDistance = history
    .filter(item => item.type === 'trip')
    .reduce((sum, item) => sum + (item.details?.distance || 0), 0);
  const totalMaintenanceCost = history
    .filter(item => item.type === 'maintenance')
    .reduce((sum, item) => sum + (item.details?.cost || 0), 0);

  return (
    <Drawer
      title={<><HistoryOutlined /> {vehicle.nomi || 'Transport vositasi'} tarixchasi</>}
      width={700}
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Jami qatnovlar"
              value={totalTrips}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Jami masofa"
              value={totalDistance}
              suffix="km"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Jami daromad"
              value={totalRevenue.toLocaleString()}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Ta'mirlashlar"
              value={totalMaintenance}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Tarixiy ma'lumotlar</Divider>
      
      {history.length > 0 ? (
        <Timeline
          mode="left"
          items={history.map((item, index) => {
            const dot = item.type === 'trip' 
              ? (item.isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />)
              : <ToolOutlined />;
            
            const color = item.type === 'trip' 
              ? (item.isCompleted ? 'green' : 'blue')
              : 'orange';
              
            return {
              dot,
              color,
              children: (
                <Card 
                  size="small" 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        {item.type === 'trip' ? 'Qatnov' : 'Texnik xizmat'}
                      </span>
                      <Text type="secondary">
                        {item.date.toLocaleDateString('uz-UZ')}
                      </Text>
                    </div>
                  }
                >
                  <p>{item.description}</p>
                  
                  {item.type === 'trip' && (
                    <div className="history-details">
                      <p><EnvironmentOutlined /> Masofa: <strong>{item.details.distance} km</strong></p>
                      <p><DollarOutlined /> Daromad: <strong>{item.details.revenue.toLocaleString()}</strong></p>
                      <p><UserOutlined /> Mijoz: <strong>{item.details.client}</strong></p>
                    </div>
                  )}
                  
                  {item.type === 'maintenance' && (
                    <div className="history-details">
                      <p><DollarOutlined /> Narxi: <strong>{item.details.cost.toLocaleString()}</strong></p>
                      <p>Almashtirgan qismlar: <strong>{item.details.parts}</strong></p>
                    </div>
                  )}
                </Card>
              )
            };
          })}
        />
      ) : (
        <Empty description="Tarixiy ma'lumotlar mavjud emas" />
      )}

      <style jsx global>{`
        .history-details {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          margin-top: 10px;
        }
        .history-details p {
          margin-bottom: 5px;
        }
        .history-details p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </Drawer>
  );
}; 