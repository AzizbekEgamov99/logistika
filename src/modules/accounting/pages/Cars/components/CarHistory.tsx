import React, { useMemo } from 'react';
import { Card, Progress, Timeline, Tag } from 'antd';
import { 
  CarOutlined, 
  ToolOutlined, 
  SettingOutlined, 
  DollarOutlined, 
  DashboardOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import styles from './CarHistory.module.css';


export interface MaintenanceData {
  car: {
    id: number;
    name: string;
    number: string;
    year: number;
    engine: string;
    transmission: string;
    power: string;
    capacity: number;
    fuel: string;
    mileage: number;
    holat: string;
    car_number: string;
    kilometer: number;
    photo?: string;
    is_busy: boolean;
  };
  optollar: Array<{
    id: number;
    price: number;
    kilometr: number;
    created_at: string;
    car: number;
  }>;
  balonlar: Array<{
    id: number;
    car: string;
    type: string;
    price: number;
    kilometr: number;
    count: number;
    created_at: string;
  }>;
  texniklar: Array<{
    id: number;
    price: number;
    kilometer: number;
    created_at: string;
    car: number;
    service: {
      id: number;
      name: string;
    };
  }>;
  total_expense: number;
  details_expense: {
    chiqimlik: number;
    optol: number;
    balon: number;
    service: number;
  };
}

interface CarHistoryProps {
  data: MaintenanceData;
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format number with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(num);
};

const CarHistory: React.FC<CarHistoryProps> = ({ data }) => {
  // Combine all maintenance events and sort by date
  const maintenanceEvents = useMemo(() => {
    const allEvents = [
      ...data.optollar.map(oil => ({
        type: 'oil',
        date: new Date(oil.created_at),
        kilometer: oil.kilometr,
        price: oil.price,
        title: 'Moy almashtirish',
        details: `${formatNumber(oil.kilometr)} km da`
      })),
      ...data.balonlar.map(tire => ({
        type: 'tire',
        date: new Date(tire.created_at),
        kilometer: tire.kilometr,
        price: tire.price,
        count: tire.count,
        title: `Balon almashtirish (${tire.count} dona)`,
        details: `${tire.type}, ${formatNumber(tire.kilometr)} km da`
      })),
      ...data.texniklar.map(service => ({
        type: 'service',
        date: new Date(service.created_at),
        kilometer: service.kilometer,
        price: service.price,
        title: service.service.name,
        details: `${formatNumber(service.kilometer)} km da`
      }))
    ];

    return allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [data]);

  // Calculate expense percentages
  const expensePercentages = useMemo(() => {
    const { details_expense, total_expense } = data;
    return {
      oil: (details_expense.optol / total_expense) * 100,
      tire: (details_expense.balon / total_expense) * 100,
      service: (details_expense.service / total_expense) * 100,
      other: (details_expense.chiqimlik / total_expense) * 100
    };
  }, [data]);

  return (
    <div className={styles.carHistory}>
      <div className={styles.mainInfo}>
        <Card 
          className={styles.dashboardCard}
          title={
            <span>
              <CarOutlined /> Avtomobil ma`lumotlari
            </span>
          }
        >
          <div className={styles.carInfo}>
            <div>
              <div className={styles.carDetail}>
                <span>Nomi:</span>
                <span>{data.car.name}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Davlat raqami:</span>
                <span>{data.car.car_number}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Ishlab chiqarilgan yil:</span>
                <span>{data.car.year}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Dvigatel:</span>
                <span>{data.car.engine}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Transmissiya:</span>
                <span>{data.car.transmission}</span>
              </div>
            </div>
            <div>
              <div className={styles.carDetail}>
                <span>Quvvat:</span>
                <span>{data.car.power}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Sig`im:</span>
                <span>{data.car.capacity}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Yoqilg`i turi:</span>
                <span>{data.car.fuel}</span>
              </div>
              <div className={styles.carDetail}>
                <span>Holati:</span>
                <span>
                  <Tag color={data.car.is_busy ? "red" : "green"}>
                    {data.car.is_busy ? "Band" : "Bo'sh"}
                  </Tag>
                </span>
              </div>
              <div className={styles.carDetail}>
                <span>Kilometraj:</span>
                <span>{formatNumber(data.car.kilometer)} km</span>
              </div>
            </div>
          </div>
        </Card>

        <Card 
          className={styles.dashboardCard}
          title={
            <span>
              <DollarOutlined /> Xarajatlar
            </span>
          }
        >
          <div className={styles.totalExpense}>
            <h3>Jami xarajatlar</h3>
            <h2>{formatCurrency(data.total_expense)}</h2>
          </div>
          
          <div className={styles.progressGroup}>
            <div className={styles.progressLabel}>
              <span>Moy almashtirish</span>
              <span className={styles.progressValue}>{formatCurrency(data.details_expense.optol)}</span>
            </div>
            <Progress 
              percent={expensePercentages.oil} 
              status="active" 
              strokeColor="#1890ff" 
              showInfo={false}
            />
          </div>
          
          <div className={styles.progressGroup}>
            <div className={styles.progressLabel}>
              <span>Balon xarajatlari</span>
              <span className={styles.progressValue}>{formatCurrency(data.details_expense.balon)}</span>
            </div>
            <Progress 
              percent={expensePercentages.tire} 
              status="active" 
              strokeColor="#52c41a" 
              showInfo={false}
            />
          </div>
          
          <div className={styles.progressGroup}>
            <div className={styles.progressLabel}>
              <span>Servis xarajatlari</span>
              <span className={styles.progressValue}>{formatCurrency(data.details_expense.service)}</span>
            </div>
            <Progress 
              percent={expensePercentages.service} 
              status="active" 
              strokeColor="#722ed1" 
              showInfo={false}
            />
          </div>
          
          <div className={styles.progressGroup}>
            <div className={styles.progressLabel}>
              <span>Boshqa xarajatlar</span>
              <span className={styles.progressValue}>{formatCurrency(data.details_expense.chiqimlik)}</span>
            </div>
            <Progress 
              percent={expensePercentages.other} 
              status="active" 
              strokeColor="#fa8c16" 
              showInfo={false}
            />
          </div>
        </Card>
      </div>
      
      <Card 
        className={styles.timelineCard}
        title={
          <span>
            <HistoryOutlined /> Servis tarixi
          </span>
        }
      >
        <Timeline mode="left">
          {maintenanceEvents.map((event, index) => (
            <Timeline.Item 
              key={index}
              className={styles.timelineItem}
              dot={
                event.type === 'oil' ? 
                  <DashboardOutlined style={{ fontSize: '16px', color: '#1890ff' }} /> : 
                event.type === 'tire' ? 
                  <ToolOutlined style={{ fontSize: '16px', color: '#52c41a' }} /> :
                  <SettingOutlined style={{ fontSize: '16px', color: '#722ed1' }} />
              }
              color={
                event.type === 'oil' ? 
                  'blue' : 
                event.type === 'tire' ? 
                  'green' :
                  'purple'
              }
              label={formatDate(event.date.toISOString())}
            >
              <h4>{event.title}</h4>
              <p>{event.details}</p>
              <p><strong>Narx:</strong> {formatCurrency(event.price)}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default CarHistory; 