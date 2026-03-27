import React from 'react'
import { Table, Space, Tag, Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useServiceManagement } from '../hooks/useServiceManagement'

const getTagColor = (serviceType: string) => {
  const colorMap: Record<string, string> = {
    'Moy almashtirish': 'green',
    'Filtr almashtirish': 'blue',
    Diagnostika: 'purple',
    "Ta'mirlash": 'red',
    Shinalar: 'orange',
    Boshqa: 'default',
  }
  return colorMap[serviceType] || 'default'
}

interface ServiceTableProps {
  pagination?: boolean
  limit?: number
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  pagination = true,
  limit,
}) => {
  const { services, completeService, isLoading, isError } =
    useServiceManagement()
  if (isLoading) return <p>Yuklanmoqda...</p>
  if (isError) return <p>Xatolik yuz berdi!</p>
  const displayedServices = limit ? services.slice(0, limit) : services
  const serviceColumns = [
    {
      title: 'Mashina',
      dataIndex: 'carModel',
      key: 'carModel',
      render: (text: string) => text || "Ma'lumot yo'q",
    },
    {
      title: 'Raqami',
      dataIndex: 'carNumber',
      key: 'carNumber',
      render: (text: string) => text || "Ma'lumot yo'q",
    },
    {
      title: 'Xizmat turi',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (text: string) =>
        text ? <Tag color={getTagColor(text)}>{text}</Tag> : "Ma'lumot yo'q",
    },
    {
      title: 'Tafsilotlar',
      dataIndex: 'details',
      key: 'details',
      render: (text: string) => text || "Ma'lumot yo'q",
    },
    {
      title: 'Narxi',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) =>
        price ? `${price.toLocaleString()} $` : "0 $",
    },
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => text || "Ma'lumot yo'q",
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => record.id && completeService(record.id)}
            disabled={record.completed}
          >
            {record.completed ? 'Bajarilgan' : 'Bajarildi'}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Table
      dataSource={displayedServices}
      columns={serviceColumns}
      rowKey="id"
      pagination={pagination ? { pageSize: 10 } : false}
    />
  )
}

export default ServiceTable
