import React from 'react'
import { Form, Input, Button, InputNumber } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

interface CustomServiceFormProps {
  onSubmit: (values) => void
}

const CustomServiceForm: React.FC<CustomServiceFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Xizmat nomi"
        rules={[{ required: true, message: 'Xizmat nomini kiriting' }]}
      >
        <Input placeholder="Xizmat nomini kiriting" />
      </Form.Item>

      <Form.Item className="form-actions">
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
        >
          Saqlash
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CustomServiceForm
