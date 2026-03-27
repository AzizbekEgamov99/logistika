import React from 'react'
import { Row, Col, Card, Tag, Space, Button, Tooltip } from 'antd'
import {
  EditOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { Car, CarStatus } from '../../../types/car'
import Link from 'next/link'
import styles from './CarsList.module.css'
import Image from 'next/image'

interface CarsListProps {
  cars: Car[]
  loading: boolean
  onEdit: (car: Car) => void
  onView: (car: Car) => void
}

export const CarsList: React.FC<CarsListProps> = ({
  cars,
  onEdit,
  onView,
}) => {

  const getStatusColor = (status: CarStatus) => {
    const colors = {
      [CarStatus.ACTIVE]: '#52c41a',
      [CarStatus.MAINTENANCE]: '#faad14',
      [CarStatus.REPAIR]: '#ff4d4f',
      [CarStatus.WAITING]: '#1890ff',
      [CarStatus.ON_ROUTE]: '#722ed1',
    }
    return colors[status]
  }

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Faol',
      maintenance: 'Texnik xizmatda',
      repair: 'Ta`mirda',
      waiting: 'Kutmoqda',
      onRoute: 'Yo`lda',
    }
    return texts[status as keyof typeof texts] || status
  }

  return (
    <Row gutter={[16, 16]}>
      {cars.map((car) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={car.id}>
          <Card
            hoverable
            className={styles.carCard}
            cover={
              <div className={styles.carImage}>
                <Image
                  className={styles.carImage}
                  width={200}
                  height={200}
                  src={
                    typeof car.photo === 'string'
                      ? car.photo
                      : 'https://via.placeholder.com/150'
                  }
                  alt={car.name}
                />
                <Tag
                  color={getStatusColor(car.holat as CarStatus)}
                  className={styles.statusBadge}
                >
                  {getStatusText(car.holat)}
                </Tag>
              </div>
            }
            actions={[
              <Tooltip title="Ko'rish" key="view">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onView(car)}
                />
              </Tooltip>,
              <Tooltip title="Tahrirlash" key="edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(car)}
                />
              </Tooltip>,
              <Link
                href={`/modules/accounting/cars/${car.id}/history`}
                passHref
                key="history"
              >
                <Tooltip title="Tarix" key="history">
                  <Button type="text" icon={<HistoryOutlined />} />
                </Tooltip>
              </Link>,
            ]}
          >
            <div className={styles.carInfo}>
              <h3>{car.name}</h3>
              <p className={styles.carNumber}>{car.car_number}</p>

              <Space className={styles.specs}>
                <span>
                  <DashboardOutlined /> {car.mileage} km
                </span>
                <span>
                  <CalendarOutlined /> {car.year}
                </span>
              </Space>

              {car.holat === CarStatus.ON_ROUTE && (
                <div className={styles.routeInfo}>
                  <EnvironmentOutlined /> Yo`lda
                </div>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}