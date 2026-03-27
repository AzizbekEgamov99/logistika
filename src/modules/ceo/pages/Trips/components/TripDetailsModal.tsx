import React from 'react';
import { Modal, Descriptions, Tag, Space, Divider, Row, Col, Typography, List, Card, Tabs } from 'antd';
import { 
  CarOutlined, 
  UserOutlined, 
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { TripData } from '../../../hooks/useTrips';
import dayjs from 'dayjs';

const { Text } = Typography;

interface TripDetailsModalProps {
  visible: boolean;
  trip: TripData | null;
  onClose: () => void;
}

interface Driver {
  id: number;
  fullname: string;
  phone_number: string;
}

interface Car {
  id: number;
  name: string;
  number: string;
}

interface Client {
  id: number;
  first_name: string;
  last_name?: string;
  number?: string;
  products?: Array<{
    id: number;
    name: string;
    price: number;
    count: number;
    currency_name: string;
    from_location_name: string;
    to_location_name: string;
    price_in_usd: string;
  }>;
}

interface TripData {
  id: number;
  driver?: Driver;
  car?: Car;
  fourgon?: Car;
  country?: {
    id: number;
    name: string;
  };
  client?: Client[];
  kilometer?: number;
  price?: number;
  dr_price?: number;
  dp_price?: number;
  dp_currency_name?: string;
  created_at: string;
  dp_information?: string;
  expenses?: {
    texnics: Array<{
      id: number;
      car_name: string;
      price: number;
      kilometer: number;
      created_at: string;
    }>;
    balons: Array<{
      id: number;
      car_name: string;
      type: string;
      price: number;
      kilometr: number;
      count: number;
    }>;
    balon_furgons: Array<{
      id: number;
      furgon_name: string;
      type: string;
      price: number;
      kilometr: number;
      count: number;
    }>;
    optols: Array<{
      id: number;
      car_name: string;
      price: number;
      kilometr: number;
    }>;
    chiqimliks: Array<{
      id: number;
      driver_name: string;
      price: number;
      description: string;
    }>;
    arizalar: Array<{
      id: number;
      driver_name: string;
      description: string;
    }>;
    referenslar: Array<{
      id: number;
      driver_name: string;
      description: string;
    }>;
    total_usd: number;
  };
  status?: string;
}

const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ 
  visible, 
  trip, 
  onClose 
}) => {
  if (!trip) return null;

  const renderStatus = (isCompleted: boolean) => {
    return isCompleted ? (
      <Tag color="success" icon={<CheckCircleOutlined />}>
        Yakunlangan
      </Tag>
    ) : (
      <Tag color="processing" icon={<ClockCircleOutlined />}>
        Jarayonda
      </Tag>
    );
  };

  return (
    <Modal
      title={<Space><CarOutlined /> Reys #{trip.id} malumotlari</Space>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Card style={{ marginBottom: 16 }}>
        <Space size="large" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Text type="secondary">Yo`nalish</Text>
            <div><Text strong>{trip.kilometer || 0} km</Text></div>
          </div>
          <div>
            <Text type="secondary">Sana</Text>
            <div><Text>{dayjs(trip.created_at).format('DD.MM.YYYY')}</Text></div>
          </div>
          <div>
            <Text type="secondary">Narxi</Text>
            <div><Text strong style={{ fontSize: '16px', color: '#1890ff' }}>{trip.price?.toLocaleString() || 0} $</Text></div>
          </div>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={<Space><UserOutlined /> Transport & Haydovchi</Space>} style={{ height: '100%' }}>
            {trip.fourgon ? (
              <Descriptions column={1} size="small" bordered={false}>
                <Descriptions.Item label="Furgon">
                  <Text strong>{trip.fourgon.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Davlat raqami">
                  {trip.fourgon.number}
                </Descriptions.Item>
              </Descriptions>
            ) : trip.car ? (
              <Descriptions column={1} size="small" bordered={false}>
                <Descriptions.Item label="Avtomobil">
                  <Text strong>{trip.car.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Davlat raqami">
                  {trip.car.number}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">Transport kiritilmagan</Text>
            )}
            
            <Divider style={{ margin: '12px 0' }} />
            
            {trip.driver ? (
              <Descriptions column={1} size="small" bordered={false}>
                <Descriptions.Item label="Haydovchi">
                  <Text strong>{trip.driver.fullname}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Telefon">
                  {trip.driver.phone_number}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">Haydovchi kiritilmagan</Text>
            )}
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title={<Space><DollarOutlined /> Moliyaviy ma`lumotlar</Space>} style={{ height: '100%' }}>
            <Descriptions column={1} size="small" bordered={false}>
              <Descriptions.Item label="Umumiy narx">
                <Text strong>{trip.price?.toLocaleString() || 0} $</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Haydovchi to'lovi">
                <Text>{trip.dp_price?.toLocaleString() || 0} {trip.dp_currency_name || '$'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Qo'shimcha xarajat">
                <Text>{trip.dr_price?.toLocaleString() || 0} $</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Davlat">
                <Text>{trip.country?.name}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {trip.client && trip.client.length > 0 && (
        <Card title={<Space><UserOutlined /> Mijoz ma'lumotlari</Space>} style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Descriptions column={1} size="small" bordered={false}>
                <Descriptions.Item label="Mijoz">
                  <Text strong>{trip.client[0].first_name} {trip.client[0].last_name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Telefon">
                  {trip.client[0].number}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={16}>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>Mahsulotlar</Text>
              <List
                dataSource={trip.client[0].products || []}
                renderItem={(product) => (
                  <List.Item>
                    <Row style={{ width: '100%' }}>
                      <Col span={8}>
                        <Text>{product.name}</Text>
                      </Col>
                      <Col span={5}>
                        <Text>{product.count} ta</Text>
                      </Col>
                      <Col span={6}>
                        <Text>{product.price?.toLocaleString()} {product.currency_name}</Text>
                      </Col>
                      <Col span={5}>
                        <Text type="secondary">{product.from_location_name} → {product.to_location_name}</Text>
                      </Col>
                    </Row>
                  </List.Item>
                )}
                size="small"
                bordered
                style={{ maxHeight: '150px', overflowY: 'auto' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {trip.expenses && (
        <Card title={<Space><ToolOutlined /> Xarajatlar</Space>} style={{ marginTop: 16 }}>
          <Tabs
            items={[
              {
                key: 'texnics',
                label: 'Texnik xizmat',
                children: trip.expenses.texnics.length > 0 ? (
                  <List
                    dataSource={trip.expenses.texnics}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${item.car_name} - ${item.price} $`}
                          description={`Kilometr: ${item.kilometer}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Texnik xizmat xarajatlari mavjud emas</Text>
                )
              },
              {
                key: 'balons',
                label: 'Balonlar',
                children: trip.expenses.balons.length > 0 ? (
                  <List
                    dataSource={trip.expenses.balons}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${item.car_name} - ${item.price} $`}
                          description={`${item.type} - ${item.count} ta - ${item.kilometr} km`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Balon xarajatlari mavjud emas</Text>
                )
              },
              {
                key: 'balon_furgons',
                label: 'Furgon balonlari',
                children: trip.expenses.balon_furgons.length > 0 ? (
                  <List
                    dataSource={trip.expenses.balon_furgons}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${item.furgon_name} - ${item.price} $`}
                          description={`${item.type} - ${item.count} ta - ${item.kilometr} km`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Furgon balon xarajatlari mavjud emas</Text>
                )
              },
              {
                key: 'optols',
                label: 'Optollar',
                children: trip.expenses.optols.length > 0 ? (
                  <List
                    dataSource={trip.expenses.optols}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${item.car_name} - ${item.price} $`}
                          description={`Kilometr: ${item.kilometr}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Optol xarajatlari mavjud emas</Text>
                )
              },
              {
                key: 'chiqimliks',
                label: 'Chiqimlar',
                children: trip.expenses.chiqimliks.length > 0 ? (
                  <List
                    dataSource={trip.expenses.chiqimliks}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${item.driver_name} - ${item.price} $`}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Chiqim xarajatlari mavjud emas</Text>
                )
              },
              {
                key: 'arizalar',
                label: 'Arizalar',
                children: trip.expenses.arizalar.length > 0 ? (
                  <List
                    dataSource={trip.expenses.arizalar}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.driver_name}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Arizalar mavjud emas</Text>
                )
              },
              {
                key: 'referenslar',
                label: 'Referenslar',
                children: trip.expenses.referenslar.length > 0 ? (
                  <List
                    dataSource={trip.expenses.referenslar}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.driver_name}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Referenslar mavjud emas</Text>
                )
              }
            ]}
          />
          <Divider style={{ margin: '12px 0' }} />
          <Text strong>Jami xarajatlar: {trip.expenses.total_usd.toLocaleString()} $</Text>
        </Card>
      )}
    </Modal>
  );
};

export default TripDetailsModal; 