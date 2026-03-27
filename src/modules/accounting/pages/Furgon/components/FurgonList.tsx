import React, { useState } from 'react'
import { 
  Table, Button, Space, Spin, Popconfirm, Empty, Card, 
  Typography, Input, Segmented, Tag, Row, Col, Avatar,
  Tooltip
} from 'antd'
import { motion } from 'framer-motion'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
  BarsOutlined,
  EyeOutlined,
  CarOutlined,
  FileImageOutlined
} from '@ant-design/icons'
import { Furgon } from '@/modules/accounting/types/furgon'
import { useFurgons } from '@/modules/accounting/hooks/useFurgon'
import FurgonForm from './FurgonForm'
import styles from '../style/furgon.module.css'
import Image from 'next/image'
import { formatImageUrl } from '@/api/axiosInstance'

const { Search } = Input
const { Text, Title } = Typography

const FurgonList: React.FC = () => {
  const { furgons, isLoading, deleteFurgon } = useFurgons()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedFurgon, setSelectedFurgon] = useState<Furgon | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter furgons based on search query
  const filteredFurgons = furgons?.filter(furgon => 
    !searchQuery || 
    furgon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    furgon.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    furgon.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleEdit = (furgon: Furgon) => {
    setSelectedFurgon(furgon)
    setIsModalVisible(true)
  }

  const handleAdd = () => {
    setSelectedFurgon(null)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFurgon(id)
    } catch (error) {
      console.error("O'chirishda xatolik:", error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  // Get styling for status
  const getStatusTag = (status: string) => {
    let color = ''
    let text = ''

    switch (status) {
      case 'active':
        color = 'success'
        text = 'Faol'
        break
      case 'maintenance':
        color = 'warning'
        text = 'Reysda'
        break
      case 'waiting':
        color = 'default'
        text = 'Kutmoqda'
        break
      default:
        color = 'default'
        text = status
    }

    return <Tag color={color}>{text}</Tag>
  }

  const columns = [
    {
      title: 'Model',
      dataIndex: 'name',
      key: 'model',
      render: (name: string, record: Furgon) => (
        <Space>
          <Avatar 
            shape="square" 
            icon={<CarOutlined />} 
            src={record.photo || undefined}
            className={styles.furgonAvatar}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Davlat raqami',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Kilometr',
      dataIndex: 'kilometer',
      key: 'kilometer',
      render: (kilometer: number) => `${kilometer} km`,
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: Furgon) => (
        <Space size="small">
          <Tooltip title="Batafsil ko'rish">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Furgonni o'chirish"
            description="Haqiqatan ham bu furgonni o'chirmoqchimisiz?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // Cards view rendering
  const renderFurgonCards = () => (
    <Row gutter={[16, 16]} className={styles.cardsGrid}>
      {filteredFurgons.map(furgon => (
        <Col xs={24} sm={12} md={8} lg={6} key={furgon.id}>
          <Card
            hoverable
            className={styles.furgonCard}
            cover={
              <div className={styles.furgonImageContainer}>
                {furgon.photo ? (
                  <Image
                    src={formatImageUrl(furgon.photo) || ''}
                    alt={furgon.name}
                    className={styles.furgonImage}
                  />
                ) : (
                  <div className={styles.placeholderIcon}>
                    <FileImageOutlined />
                  </div>
                )}
                {getStatusTag(furgon.status)}
              </div>
            }
            actions={[
              <Tooltip title="Batafsil ko'rish" key="view">
                <EyeOutlined />
              </Tooltip>,
              <Tooltip title="Tahrirlash" key="edit">
                <EditOutlined onClick={() => handleEdit(furgon)} />
              </Tooltip>,
              <Popconfirm
                key="delete"
                title="Furgonni o'chirish"
                description="Haqiqatan ham bu furgonni o'chirmoqchimisiz?"
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleDelete(furgon.id)}
                okText="Ha"
                cancelText="Yo'q"
              >
                <DeleteOutlined />
              </Popconfirm>,
            ]}
          >
            <div className={styles.furgonCardContent}>
              <Title level={5} className={styles.furgonTitle}>{furgon.name}</Title>
              <div className={styles.furgonDetails}>
                <div className={styles.detailItem}>
                  <Text type="secondary">Davlat raqami:</Text>
                  <Text strong>{furgon.number}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text type="secondary">Kilometr:</Text>
                  <Text>{furgon.kilometer} km</Text>
                </div>
                {furgon.description && (
                  <div className={styles.furgonDescription}>
                    <Text type="secondary">{furgon.description}</Text>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <div className={styles.loadingText}>Ma`lumotlar yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.listHeader}>
        <div className={styles.searchSection}>
          <Search
            placeholder="Furgon qidirish"
            onSearch={handleSearch}
            onChange={e => setSearchQuery(e.target.value)}
            allowClear
            className={styles.searchInput}
          />
          <Segmented
            options={[
              {
                value: 'table',
                icon: <BarsOutlined />,
              },
              {
                value: 'cards',
                icon: <AppstoreOutlined />,
              },
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value as 'table' | 'cards')}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Yangi furgon qo`shish
        </Button>
      </div>

      {filteredFurgons.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Furgonlar mavjud emas"
        />
      ) : (
        viewMode === 'table' ? (
          <Table
            className={styles.furgonTable}
            columns={columns}
            dataSource={filteredFurgons}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta furgon`,
            }}
          />
        ) : (
          renderFurgonCards()
        )
      )}

      <FurgonForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        furgon={selectedFurgon}
      />
    </motion.div>
  )
}

export default FurgonList
