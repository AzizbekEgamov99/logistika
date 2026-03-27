import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Upload, message } from 'antd'
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import { Furgon } from '@/modules/accounting/types/furgon'
import { useFurgons } from '@/modules/accounting/hooks/useFurgon'
import type { RcFile, UploadProps } from 'antd/es/upload'
import { formatImageUrl } from '@/api/axiosInstance'

interface FurgonFormProps {
  visible: boolean
  onCancel: () => void
  furgon: Furgon | null
}

const FurgonForm: React.FC<FurgonFormProps> = ({
  visible,
  onCancel,
  furgon,
}) => {
  const [form] = Form.useForm()
  const { createFurgon, updateFurgon } = useFurgons()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (visible) {
      if (furgon) {
        form.setFieldsValue({
          name: furgon.name,
          number: furgon.number,
          description: furgon.description,
          kilometer: furgon.kilometer || 0,
        })
        
        // Set existing photo URL if available
        if (furgon.photo) {
          const photoUrl = formatImageUrl(furgon.photo) || null
          setExistingPhotoUrl(photoUrl)
        } else {
          setExistingPhotoUrl(null)
        }
      } else {
        form.resetFields()
        setPhotoFile(null)
        setExistingPhotoUrl(null)
      }
    }
  }, [visible, furgon, form])

  const handleSubmit = async (values: any) => {
    try {
      // Only require photo for new furgons, not for edits
      if (!photoFile && !furgon) {
        message.error('Rasm yuklash majburiy!')
        return
      }

      setSubmitLoading(true)
      const formData = new FormData()
      
      // Add basic fields
      formData.append('name', values.name.trim())
      formData.append('number', values.number.trim())
      
      // Only include status for new furgons
      if (!furgon) {
        formData.append('status', 'foal')
      }
      
      // Add optional fields if they exist
      if (values.description) {
        formData.append('description', values.description.trim())
      }
      if (typeof values.kilometer === 'number') {
        formData.append('kilometer', values.kilometer.toString())
      }
      
      // Add photo file only if a new one was selected
      if (photoFile) {
        formData.append('photo', photoFile)
      }
      
      // Log FormData contents for debugging
      console.log('FormData contents:')
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`)
        } else {
          console.log(`${pair[0]}: ${pair[1]}`)
        }
      }
      
      let response
      if (furgon?.id) {
        console.log('Updating existing furgon with ID:', furgon.id)
        // Explicitly add a flag to keep the existing photo when editing without a new photo
        if (!photoFile) {
          console.log('No new photo selected, keeping existing photo')
          formData.append('keep_existing_photo', 'true')
        }
        
        response = await updateFurgon({ id: furgon.id, furgon: formData })
        if (response) {
          message.success('Furgon muvaffaqiyatli yangilandi')
        }
      } else {
        response = await createFurgon(formData)
        if (response) {
          message.success('Yangi furgon muvaffaqiyatli qo\'shildi')
        }
      }
      
      form.resetFields()
      setPhotoFile(null)
      onCancel()
    } catch (error: any) {
      console.error('Submit error:', error)
      
      // More specific error handling
      let errorMessage = 'Furgon ma\'lumotlarini saqlashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring'
      
      if (error.response?.data) {
        const respData = error.response.data
        
        if (respData.photo && Array.isArray(respData.photo)) {
          errorMessage = `Rasm xatosi: ${respData.photo.join(', ')}`
        } else if (respData.message) {
          errorMessage = respData.message
        } else if (typeof respData === 'object') {
          // Try to extract error messages from all fields
          const errors = []
          for (const [field, messages] of Object.entries(respData)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`)
            } else {
              errors.push(`${field}: ${messages}`)
            }
          }
          
          if (errors.length > 0) {
            errorMessage = errors.join('; ')
          }
        }
      }
      
      message.error(errorMessage)
    } finally {
      setSubmitLoading(false)
    }
  }

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Faqat rasm fayllarini yuklash mumkin!')
      return Upload.LIST_IGNORE
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Rasm hajmi 2MB dan kichik bo`lishi kerak!')
      return Upload.LIST_IGNORE
    }

    // Store the file for later use in submit
    setPhotoFile(file)
    return false // Prevent auto upload
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done' || info.file.status === 'removed') {
      setLoading(false)
    }
    if (info.file.status === 'error') {
      setLoading(false)
      message.error('Rasm yuklashda xatolik yuz berdi')
    }
    
    // If file is removed, clear the photoFile state
    if (info.fileList.length === 0) {
      setPhotoFile(null)
    }
  }

  return (
    <Modal
      open={visible}
      title={furgon ? 'Furgonni tahrirlash' : 'Yangi furgon qo\'shish'}
      okText={furgon ? 'Saqlash' : 'Qo\'shish'}
      cancelText="Bekor qilish"
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={submitLoading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          number: '',
          description: '',
          kilometer: 0
        }}
      >
        <Form.Item
          name="name"
          label="Furgon nomi"
          rules={[{ required: true, message: 'Furgon nomini kiritish shart' }]}
        >
          <Input placeholder="Furgon nomini kiriting" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Davlat raqami"
          rules={[{ required: true, message: 'Davlat raqamini kiritish shart' }]}
        >
          <Input placeholder="Davlat raqamini kiriting" />
        </Form.Item>

        <Form.Item
          name="kilometer"
          label="Kilometr"
          rules={[{ type: 'number', min: 0, message: 'Musbat son kiriting' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Kilometr" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Tavsif"
        >
          <Input.TextArea rows={4} placeholder="Furgon haqida qo'shimcha ma'lumot" />
        </Form.Item>

        <Form.Item
          label="Furgon rasmi"
          required={!furgon}
          tooltip={furgon 
            ? "Yangi rasm yuklamasangiz, mavjud rasm saqlanib qoladi" 
            : "Furgon rasmini yuklash majburiy"}
        >
          <Upload.Dragger
            name="photo"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            listType="picture"
            maxCount={1}
            accept="image/*"
            showUploadList={true}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess?.("ok")
              }, 0)
            }}
          >
            <p className="ant-upload-drag-icon">
              {loading ? <LoadingOutlined /> : <InboxOutlined />}
            </p>
            <p className="ant-upload-text">Rasmni yuklash uchun bosing yoki shu yerga tashlang</p>
            <p className="ant-upload-hint">
              Faqat rasmlar qo`llab-quvvatlanadi (max: 2MB)
            </p>
          </Upload.Dragger>
          
          {/* Show existing photo when editing */}
          {existingPhotoUrl && !photoFile && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <p>Mavjud rasm:</p>
              <img 
                src={existingPhotoUrl} 
                alt="Mavjud rasm" 
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '5px' }} 
              />
              <p style={{ color: '#52c41a', marginTop: '5px' }}>
                Yangi rasm yuklamasangiz, mavjud rasm saqlanib qoladi
              </p>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FurgonForm
