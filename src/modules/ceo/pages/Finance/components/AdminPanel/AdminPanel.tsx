import React, { useState } from 'react';
import { Card, Tabs, Typography, Button, Space, Table, Form, Input, Select, Switch, Tag, Popconfirm, Row } from 'antd';
import { UserOutlined, SettingOutlined, LockOutlined, DatabaseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [form] = Form.useForm();

  // Set default form values
  React.useEffect(() => {
    form.setFieldsValue({
      systemName: "RBL LOGISTCS Moliya Boshqaruvi",
      currency: "usd",
      taxRate: "15",
      reportingPeriod: "monthly"
    });
  }, [form]);

  // Mock data for users
  const users = [
    {
      key: '1',
      name: 'Abdurahmon Toshmatov',
      role: 'admin',
      email: 'abdurahmon@example.com',
      status: 'active',
    },
    {
      key: '2',
      name: 'Farkhod Umarov',
      role: 'accountant',
      email: 'farkhod@example.com',
      status: 'active',
    },
    {
      key: '3',
      name: 'Nargiza Karimova',
      role: 'viewer',
      email: 'nargiza@example.com',
      status: 'inactive',
    },
  ];

  // User table columns
  const userColumns = [
    {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roli',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        if (role === 'admin') {
          color = 'red';
        } else if (role === 'viewer') {
          color = 'green';
        }
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Faol' : 'Faol emas'}
        </Tag>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (text: string, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => console.log('Edit user', record)}
          />
          <Popconfirm
            title="Ushbu foydalanuvchini o'chirishni istaysizmi?"
            onConfirm={() => console.log('Delete user', record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Mock data for permissions
  const permissions = [
    {
      key: '1',
      module: 'Kassa',
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      key: '2',
      module: 'Mijozlar va To\'lovlar',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: '3',
      module: 'Transport Moliyasi',
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      key: '4',
      module: 'Hisobotlar',
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  ];

  // Permission table columns
  const permissionColumns = [
    {
      title: 'Modul',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: 'Ko\'rish',
      dataIndex: 'view',
      key: 'view',
      render: (view: boolean) => <Switch checked={view} />,
    },
    {
      title: 'Yaratish',
      dataIndex: 'create',
      key: 'create',
      render: (create: boolean) => <Switch checked={create} />,
    },
    {
      title: 'Tahrirlash',
      dataIndex: 'edit',
      key: 'edit',
      render: (edit: boolean) => <Switch checked={edit} />,
    },
    {
      title: 'O\'chirish',
      dataIndex: 'delete',
      key: 'delete',
      render: (del: boolean) => <Switch checked={del} />,
    },
  ];

  return (
    <div className="admin-panel">
      <Row style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Administrator paneli</Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => console.log('Add new user')}
          >
            Foydalanuvchi qo'shish
          </Button>
        </Space>
      </Row>
      
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={<span><UserOutlined /> Foydalanuvchilar</span>}
            key="users"
          >
            <Table
              columns={userColumns}
              dataSource={users}
              pagination={false}
            />
          </TabPane>
          
          <TabPane
            tab={<span><LockOutlined /> Ruxsatlar</span>}
            key="permissions"
          >
            <Table
              columns={permissionColumns}
              dataSource={permissions}
              pagination={false}
            />
          </TabPane>
          
          <TabPane
            tab={<span><SettingOutlined /> Sozlamalar</span>}
            key="settings"
          >
            <Form layout="vertical" form={form}>
              <Title level={5}>Umumiy sozlamalar</Title>
              
              <Form.Item
                label="Tizim nomi"
                name="systemName"
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                label="Valyuta"
                name="currency"
              >
                <Select>
                  <Option value="usd">USD ($)</Option>
                  <Option value="uzs">UZS (сўм)</Option>
                  <Option value="eur">EUR (€)</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="Soliq stavkasi (%)"
                name="taxRate"
              >
                <Input type="number" min={0} max={100} />
              </Form.Item>
              
              <Form.Item
                label="Hisobot davri"
                name="reportingPeriod"
              >
                <Select>
                  <Option value="weekly">Haftalik</Option>
                  <Option value="monthly">Oylik</Option>
                  <Option value="quarterly">Choraklik</Option>
                  <Option value="yearly">Yillik</Option>
                </Select>
              </Form.Item>
              
              <Button type="primary">
                Saqlash
              </Button>
            </Form>
          </TabPane>
          
          <TabPane
            tab={<span><DatabaseOutlined /> Ma'lumotlar bazasi</span>}
            key="database"
          >
            <div style={{ padding: '20px 0' }}>
              <Space direction="vertical" size="large">
                <div>
                  <Title level={5}>Ma'lumotlarni export/import qilish</Title>
                  <Text type="secondary">
                    Ma'lumotlarni CSV yoki Excel formatida yuklab olish yoki yuklash
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Space>
                      <Button type="primary">
                        Ma'lumotlarni export qilish
                      </Button>
                      <Button>
                        Ma'lumotlarni import qilish
                      </Button>
                    </Space>
                  </div>
                </div>
                
                <div>
                  <Title level={5}>Zaxira nusxa</Title>
                  <Text type="secondary">
                    Tizim ma'lumotlarini zaxiralash va qayta tiklash
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Space>
                      <Button type="primary">
                        Zaxira nusxa yaratish
                      </Button>
                      <Button danger>
                        Zaxiradan qayta tiklash
                      </Button>
                    </Space>
                  </div>
                </div>
              </Space>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminPanel; 