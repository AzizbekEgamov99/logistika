import React from 'react'
import { Tabs, Card } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CustomServiceForm from './CustomServiceForm'
import type { TabsProps } from 'antd'

// Inline styles
const styles = {
  serviceForm: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  formTitle: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px'
  },
  titleIcon: {
    color: '#1677ff'
  }
}

interface ServiceAddProps {
  addService: (values: any) => void
}

const ServiceAdd: React.FC<ServiceAddProps> = ({ addService }) => {
  const items: TabsProps['items'] = [
    {
      key: 'custom',
      label: 'Yangi xizmat yaratish',
      children: <CustomServiceForm onSubmit={addService} />,
    },
  ]

  return (
    <Card 
      style={styles.serviceForm}
      title={
        <h3 style={styles.formTitle}>
          <PlusOutlined style={styles.titleIcon} /> Xizmat qo`shish
        </h3>
      }
    >
      <Tabs defaultActiveKey="custom" items={items} />
    </Card>
  )
}

export default ServiceAdd
