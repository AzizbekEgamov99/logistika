import React, { useMemo } from 'react'
import { Table, Tag, Button, Popconfirm, Space, Avatar, Tooltip } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { Client } from '../../../types/client'

interface ClientsListProps {
  clients: Client[]
  loading: boolean
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onEdit: (client: Client) => void
  onView: (client: Client) => void
  onDelete: (id: number) => void
}

export const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onView,
  onDelete,
}) => {
  const columns = useMemo(
    () => [
      {
        title: '№',
        key: 'index',
        width: 60,
        render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: 'Mijoz',
        key: 'name',
        render: (record: Client) => (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <span>{`${record.first_name || ''} ${record.last_name || ''}`}</span>
          </Space>
        ),
      },
      {
        title: 'Kompaniya',
        dataIndex: 'company',
        key: 'company',
        render: (company: string) => company || '-',
      },
      {
        title: 'Telefon',
        dataIndex: 'number',
        key: 'number',
        render: (number: string) => number || '-',
      },
      {
        title: 'Shahar',
        dataIndex: 'city',
        key: 'city',
        render: (city: string) => city || '-',
      },
      {
        title: 'Haydovchi',
        key: 'driver',
        render: (record: Client) => (
          <Tag color={record.driver ? 'blue' : 'default'}>
            {record.driver ? 'Ha' : "Yo'q"}
          </Tag>
        ),
      },
      {
        title: 'Status',
        key: 'status',
        render: () => {
          const colorMap: Record<string, string> = {
            active: 'green',
            inactive: 'orange',
            blocked: 'red',
          }
          const textMap: Record<string, string> = {
            active: 'Faol',
            inactive: 'Faol emas',
            blocked: 'Bloklangan',
          }
          
          const status = 'active';

          return (
            <Tag color={colorMap[status] || 'default'}>
              {textMap[status] || status}
            </Tag>
          )
        },
      },
      {
        title: 'Amallar',
        key: 'actions',
        render: (record: Client) => (
          <Space>
            <Tooltip title="Batafsil ko'rish">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
                ghost
              />
            </Tooltip>
            <Tooltip title="O'zgartirish">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Mijozni o'chirishni xohlaysizmi?"
              onConfirm={() => record.id && onDelete(record.id)}
              okText="Ha"
              cancelText="Yo'q"
            >
              <Tooltip title="O'chirish">
                <Button danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete, onView],
  )

  return (
    <Table
      columns={columns}
      dataSource={clients}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `Jami ${total} ta`,
      }}
    />
  )
}
