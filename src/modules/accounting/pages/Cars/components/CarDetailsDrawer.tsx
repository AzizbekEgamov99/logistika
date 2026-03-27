import React from 'react'
import {
  Drawer,
  Descriptions,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Statistic,
  Divider,
  Card,
  Tabs,
} from 'antd'
import {
  DashboardOutlined,
  CalendarOutlined,
  ToolOutlined,
  EditOutlined,
  DeleteOutlined,
  CarOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  KeyOutlined,
  NumberOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { Car } from '../../../types/car'
import Image from 'next/image'
import CarHistory from './CarHistory'
import { formatImageUrl } from '@/api/axiosInstance'

interface CarDetailsDrawerProps {
  visible: boolean
  car: Car | null
  onClose: () => void
  onEdit: (car: Car) => void
  onDelete: (id: number) => void
}

const CarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  visible,
  car,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!car) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'foal':
        return 'success'
      case 'tamirda':
        return 'warning'
      case 'kutmoqda':
        return 'processing'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'foal':
        return 'Faol'
      case 'tamirda':
        return 'Ta`mirda'
      case 'kutmoqda':
        return 'Kutmoqda'
      default:
        return status
    }
  }

  const getTransmissionText = (transmission: string) => {
    switch (transmission) {
      case 'manual':
        return 'Mexanika'
      case 'automatic':
        return 'Avtomat'
      default:
        return transmission
    }
  }

  const getFuelText = (fuel: string) => {
    switch (fuel) {
      case 'benzin':
        return 'Benzin'
      case 'diesel':
        return 'Dizel'
      case 'gas':
        return 'Gaz'
      default:
        return fuel
    }
  }

  return (
    <Drawer
      title={
        <Space>
          <CarOutlined />
          <span>Transport ma`lumotlari</span>
        </Space>
      }
      placement="right"
      width={720}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button icon={<EditOutlined />} type="primary" onClick={() => onEdit(car)}>
            Tahrirlash
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(car.id!)}
          >
            O`chirish
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 24 }}>
        <Card
          cover={
            car.photo ? (
              <div style={{ height: 300, position: 'relative', background: '#f5f5f5' }}>
                <Image
                  src={formatImageUrl(car.photo) || ''}
                  alt={car.name}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                />
              </div>
            ) : (
              <div
                style={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f5f5f5',
                }}
              >
                <CarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
              </div>
            )
          }
        >
          <Card.Meta
            title={
              <Space size="large">
                <span style={{ fontSize: 24 }}>{car.name}</span>
                <Tag color={getStatusColor(car.holat)} style={{ marginLeft: 8 }}>
                  {getStatusText(car.holat)}
                </Tag>
              </Space>
            }
            description={
              <Space split={<Divider type="vertical" />} style={{ marginTop: 8 }}>
                <span>
                  <NumberOutlined /> {car.car_number}
                </span>
                <span>
                  <CalendarOutlined /> {car.year}
                </span>
              </Space>
            }
          />
        </Card>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic
            title="Yurgan masofasi"
            value={car.mileage}
            suffix="km"
            prefix={<DashboardOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Ishlab chiqarilgan yili"
            value={car.year}
            prefix={<CalendarOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Holati"
            value={getStatusText(car.holat)}
            prefix={<ToolOutlined />}
          />
        </Col>
      </Row>

      <Card title="Texnik ma'lumotlar" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Dvigatel">
                <Space>
                  <SettingOutlined />
                  {car.engine}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Transmissiya">
                <Space>
                  <KeyOutlined />
                  {getTransmissionText(car.transmission)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Yoqilg'i turi">
                <Space>
                  <EnvironmentOutlined />
                  {getFuelText(car.fuel)}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Quvvat">{car.power}</Descriptions.Item>
              <Descriptions.Item label="Sig'imi">{car.capacity}</Descriptions.Item>
              <Descriptions.Item label="Model">{car.number}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      <Card title="Qo'shimcha ma'lumotlar" style={{ marginBottom: 24 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Davlat raqami">
            {car.car_number}
          </Descriptions.Item>
          {/* Boshqa ma'lumotlar... */}
        </Descriptions>
      </Card>

      <Tabs
        defaultActiveKey="history"
        items={[
          {
            key: 'history',
            label: (
              <span>
                <HistoryOutlined /> Transport tarixi
              </span>
            ),
            children: <CarHistory carId={car.id!} />,
          }
        ]}
      />
    </Drawer>
  )
}

export default CarDetailsDrawer
