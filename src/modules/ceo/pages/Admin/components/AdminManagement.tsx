import React, { useState, useRef } from 'react';
import { Table, Button, Space, Card, Typography, Modal, Tag, Tooltip, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Admin, AdminFormValues } from '../types/admin';
import { useAdmin } from '../hooks/useAdmin';
import AdminForm from './AdminForm';

const { Title } = Typography;

const AdminManagement: React.FC = () => {
  const { modal } = App.useApp(); // Use modal from App context
  const { admins, loading, errors, addAdmin, editAdmin, removeAdmin } = useAdmin();
  
  const [formVisible, setFormVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | undefined>(undefined);
  const [formTitle, setFormTitle] = useState('Administrator qo\'shish');
  const [isEdit, setIsEdit] = useState(false);
  const deleteInProgress = useRef<Set<number>>(new Set()); // Track delete operations

  const handleAdd = () => {
    console.log('Add button clicked');
    setSelectedAdmin(undefined);
    setFormTitle('Yangi administrator qo\'shish');
    setIsEdit(false);
    setFormVisible(true);
  };

  const handleEdit = (record: Admin) => {
    console.log('Edit clicked for admin:', record);
    setSelectedAdmin(record);
    setFormTitle(`Administratorni tahrirlash: ${record.username}`);
    setIsEdit(true);
    setFormVisible(true);
  };

  const handleDelete = (record: Admin) => {
    console.log('Delete clicked for admin:', record);
    
    // Prevent multiple delete operations for the same admin
    if (deleteInProgress.current.has(record.id)) {
      console.log('Delete already in progress for admin:', record.id);
      return;
    }
    
    // Check if globally loading to prevent multiple operations
    if (loading) {
      console.log('System is busy, ignoring delete request');
      return;
    }
    
    // Use App modal context for better control
    modal.confirm({
      title: 'Administratorni o\'chirmoqchimisiz?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p><strong>{record.username}</strong> nomli administratorni o'chirish istaysizmi?</p>
          <p style={{ color: '#666', fontSize: '12px' }}>
            Bu amal bekor qilib bo'lmaydi.
          </p>
        </div>
      ),
      okText: 'Ha, o\'chirish',
      okType: 'danger',
      cancelText: 'Bekor qilish',
      width: 450,
      centered: true,
      maskClosable: false,
      keyboard: false,
      onOk: async () => {
        console.log('User confirmed delete for admin ID:', record.id);
        
        // Add to in-progress set
        deleteInProgress.current.add(record.id);
        
        try {
          const result = await removeAdmin(record.id);
          console.log('Delete operation result:', result);
          
          if (result) {
            console.log('Admin deleted successfully');
            // Close any open forms if they're editing the deleted admin
            if (selectedAdmin?.id === record.id) {
              setFormVisible(false);
              setSelectedAdmin(undefined);
            }
          } else {
            console.log('Delete operation returned false');
          }
        } catch (error) {
          console.error('Delete operation threw error:', error);
        } finally {
          // Remove from in-progress set
          deleteInProgress.current.delete(record.id);
        }
      },
      onCancel: () => {
        console.log('User cancelled delete operation');
      }
    });
  };

  const handleFormSubmit = async (values: AdminFormValues) => {
    console.log('Form submit with values:', values);
    console.log('Selected admin for edit:', selectedAdmin);
    
    try {
      let result: boolean;
      
      if (selectedAdmin) {
        // If editing, only send modified fields
        const editedValues: Partial<AdminFormValues> = {};
        
        if (values.fullname !== selectedAdmin.fullname) {
          editedValues.fullname = values.fullname;
        }
        if (values.phone_number !== selectedAdmin.phone_number) {
          editedValues.phone_number = values.phone_number;
        }
        if (values.status !== selectedAdmin.status.toLowerCase()) {
          editedValues.status = values.status;
        }
        // Only send password if it's provided (for edit)
        if (values.password && values.password.trim() !== '') {
          editedValues.password = values.password;
        }
        
        console.log('Edited values to send:', editedValues);
        result = await editAdmin(selectedAdmin.id, editedValues);
      } else {
        console.log('Creating new admin');
        result = await addAdmin(values);
      }
      
      if (result) {
        console.log('Operation successful, closing form');
        setFormVisible(false);
        setSelectedAdmin(undefined);
        setIsEdit(false);
      } else {
        console.log('Operation failed');
      }
      
      return result;
    } catch (error) {
      console.error('Form submit error:', error);
      return false;
    }
  };

  const handleFormCancel = () => {
    console.log('Form cancelled');
    setFormVisible(false);
    setSelectedAdmin(undefined);
    setIsEdit(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ceo':
        return 'red';
      case 'bugalter':
        return 'green';
      case 'driver':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ceo':
        return 'CEO';
      case 'bugalter':
        return 'Bugalter';
      case 'driver':
        return 'Haydovchi';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (id: number) => <span style={{ color: '#666' }}>#{id}</span>
    },
    {
      title: 'Foydalanuvchi nomi',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <span style={{ fontWeight: 'bold' }}>
          <UserOutlined style={{ marginRight: 8 }} /> {text}
        </span>
      ),
    },
    {
      title: 'To\'liq ism',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Telefon raqami',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={getStatusColor(text)} style={{ padding: '0 10px' }}>
          {getStatusLabel(text)}
        </Tag>
      ),
    },
    {
      title: 'Yaratilgan vaqt',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => (
        <span>{formatDate(text)}</span>
      ),
    },
    {
      title: 'Amallar',
      key: 'action',
      width: 120,
      render: (_: any, record: Admin) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Edit button clicked for:', record.username);
                handleEdit(record);
              }}
              size="small"
              disabled={loading}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                
                console.log('Delete button clicked for:', record.username);
                
                // Use setTimeout to break out of the current event cycle
                setTimeout(() => {
                  handleDelete(record);
                }, 0);
              }}
              size="small"
              disabled={loading || deleteInProgress.current.has(record.id)}
              loading={deleteInProgress.current.has(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Debug information
  console.log('Current state:', {
    adminsCount: admins?.length,
    loading,
    formVisible,
    selectedAdmin,
    isEdit
  });

  return (
    <App>
      <Card 
        title={<Title level={4}>Administratorlarni boshqarish</Title>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={loading}
          >
            Yangi administrator
          </Button>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table
          columns={columns}
          dataSource={admins || []}
          rowKey={(record) => record.id?.toString() || Math.random().toString()}
          loading={loading}
          bordered
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} administrators`
          }}
          locale={{ emptyText: 'Administratorlar mavjud emas' }}
          scroll={{ x: 800 }}
          onRow={(record) => ({
            // Prevent row click when action buttons are clicked
            onClick: (e) => {
              const target = e.target as HTMLElement;
              if (target.closest('.ant-btn') || target.closest('.ant-tooltip')) {
                e.stopPropagation();
              }
            }
          })}
        />

        <AdminForm
          visible={formVisible}
          onCancel={handleFormCancel}
          onSubmit={handleFormSubmit}
          initialValues={selectedAdmin}
          title={formTitle}
          loading={loading}
          isEdit={isEdit}
          errors={errors}
        />
      </Card>
    </App>
  );
};

export default AdminManagement;