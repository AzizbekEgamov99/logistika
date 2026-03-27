import React, { useState } from 'react'
import { ServiceType } from '@/modules/accounting/types/maintenance'
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Card, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons'

interface ServiceListProps {
  services: ServiceType[]
  deleteService: (id: number) => void
  updateService: (params: { id: number; service: ServiceType }) => void
}

// Inline styles
const styles = {
  tableContainer: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginTop: '20px'
  },
  tableTitle: {
    margin: 0,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  titleIcon: {
    color: '#1677ff'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  }
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  deleteService,
  updateService,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceType | null>({ id: 0, name: '' })
  const [form] = Form.useForm()

  const handleEdit = (service: ServiceType) => {
    setSelectedService(service)
    form.setFieldsValue(service)
    setIsModalOpen(true)
  }

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      if (selectedService && selectedService.id !== undefined) {
        updateService({
          id: selectedService.id,
          service: { ...selectedService, ...values },
        })
      }
      setIsModalOpen(false)
    })
  }

  const columns = [
    {
      title: 'Xizmat nomi',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Amallar',
      key: 'action',
      width: 150,
      render: (_: any, record: ServiceType) => (
        <Space style={styles.actionButtons}>
          <Tooltip title="Tahrirlash">
            <Button 
              type="primary" 
              ghost 
              shape="circle" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Bu xizmatni o'chirishni xohlaysizmi?"
            onConfirm={() => record.id && deleteService(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Tooltip title="O'chirish">
              <Button 
                danger 
                shape="circle" 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card 
      style={styles.tableContainer}
      title={
        <div style={styles.tableTitle}>
          <UnorderedListOutlined style={styles.titleIcon} /> Mavjud xizmatlar
        </div>
      }
    >
      <Table 
        dataSource={services} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        style={{ 
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />

      {/* Edit modal */}
      <Modal
        title="Xizmatni o'zgartirish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        okText="Saqlash"
        cancelText="Bekor qilish"
        forceRender={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Xizmat nomi"
            rules={[{ required: true, message: 'Xizmat nomini kiriting' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default ServiceList
