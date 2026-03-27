import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { Client } from '../../../types/client'

interface ClientModalProps {
  visible: boolean
  client: Client | null
  onCancel: () => void
  onSubmit: (values: Partial<Client>) => void
}

export const ClientModal: React.FC<ClientModalProps> = ({ visible, client, onCancel, onSubmit }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      if (client) {
        form.setFieldsValue(client)
      } else {
        form.setFieldsValue({
          first_name: '',
          last_name: '',
          city: '',
          number: '',
          status: 'active',
          company: ''
        })
      }
    }
  }, [visible, client, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      let formattedNumber = values.number
      
      if (formattedNumber && !formattedNumber.startsWith('+') && !formattedNumber.startsWith('998')) {
        formattedNumber = `+998${formattedNumber}`
      }
      
      onSubmit({
        ...values,
        number: formattedNumber
      })
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }
  
  const formatPhoneNumber = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    
    if (value) {
      form.setFieldValue('number', value)
    } else {
      form.setFieldValue('number', '')
    }
  }

  return (
    <Modal
      title={client ? 'Mijozni tahrirlash' : "Yangi mijoz qo'shish"}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={client ? 'Saqlash' : "Qo'shish"}
      cancelText="Bekor qilish"
      forceRender={true}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="first_name"
          label="Ismi"
          rules={[{ required: true, message: 'Ismni kiriting!' }]}
        >
          <Input placeholder="Ismni kiriting" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Familiyasi"
          rules={[{ required: true, message: 'Familiyani kiriting!' }]}
        >
          <Input placeholder="Familiyani kiriting" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Kompaniya"
        >
          <Input placeholder="Kompaniya nomini kiriting" />
        </Form.Item>

        <Form.Item
          name="city"
          label="Shahar"
          rules={[{ required: true, message: 'Shaharni kiriting!' }]}
        >
          <Input placeholder="Shaharni kiriting" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Telefon raqami"
          rules={[
            { required: true, message: 'Telefon raqamini kiriting!' },
            {
              pattern: /^(\+998|998)?\d{9}$/,
              message: 'Noto`g`ri telefon raqami formati'
            }
          ]}
        >
          <Input placeholder="+998 XX XXX XX XX" onChange={formatPhoneNumber} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
