import React, { useState } from 'react';
import { Table, Space, Avatar, Tag, Button, Tooltip, Typography, Row, Col, Badge, Dropdown, Menu, Modal } from 'antd';
import {
  UserOutlined,
  CarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  MoreOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  DollarOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { DriverType } from '../../../../../accounting/types/driver';
import { useRouter } from 'next/navigation';

const { Text } = Typography;
const { confirm } = Modal;

import { formatImageUrl } from '../../../../../../api/axiosInstance';

// Helper component for date formatting to prevent hydration mismatch
const FormattedDate = ({ date }: { date: string | null }) => {
  if (!date) return <span>Mavjud emas</span>;
  return <span>{new Date(date).toLocaleDateString('uz-UZ')}</span>;
};

interface DriverTableProps {
  drivers: DriverType[];
  loading: boolean;
  onEdit: (driver: DriverType) => void;
  onDelete: (driver: DriverType) => void;
  onView: (driver: DriverType) => void;
  pagination?: any;
  rowSelection?: any;
}

const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  loading,
  onEdit,
  onDelete,
  onView,
  pagination,
  rowSelection
}) => {
  const router = useRouter();
  
  // Handle delete confirmation
  const showDeleteConfirm = (driver: DriverType) => {
    confirm({
      title: "Haydovchini o'chirishni istaysizmi?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amal qaytarilmaydi va barcha ma'lumotlar yo'qoladi.",
      okText: 'Ha',
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: () => {
        onDelete(driver);
      }
    });
  };
  
  // Handle call driver
  const handleCallDriver = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  
  // Handle print driver info
  const handlePrintDriverInfo = (driver: DriverType) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Haydovchi ma'lumotlari - ${driver.fullname}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .driver-details { margin-bottom: 30px; }
              .section { margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Haydovchi ma'lumotlari</h1>
            </div>
            <div class="driver-details">
              <h2>${driver.fullname}</h2>
              <p>ID: ${driver.id}</p>
              <p>Telefon: ${driver.phone_number}</p>
              <p>Status: ${driver.status}</p>
              <p>Guvohnoma: ${driver.license_number || 'Mavjud emas'}</p>
              <p>Guvohnoma muddati: ${driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : 'Mavjud emas'}</p>
              <p>Manzil: ${driver.address || 'Mavjud emas'}</p>
            </div>
            <div class="section">
              <h3>Statistika</h3>
              <p>Reyslar soni: ${driver.rays_count || 0}</p>
              <p>To'langan oyliklar: ${driver.total_rays_usd || 0}$</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  // More actions menu
  const renderMoreActions = (driver: DriverType) => (
    <Menu
      items={[
        {
          key: '1',
          icon: <PhoneOutlined />,
          label: 'Qo\'ng\'iroq qilish',
          onClick: () => handleCallDriver(driver.phone_number)
        },
        {
          key: '2',
          icon: <PrinterOutlined />,
          label: 'Chop etish',
          onClick: () => handlePrintDriverInfo(driver)
        },
        {
          key: '3',
          icon: <DownloadOutlined />,
          label: 'Ma\'lumotlarni yuklab olish',
          onClick: () => {/* Implementation for download */}
        }
      ]}
    />
  );
  
  // Table columns
  const columns = [
    {
      title: 'Haydovchi',
      key: 'driver',
      width: 240,
      render: (_: any, record: DriverType) => (
        <Space>
          <div style={{ position: 'relative' }}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#1890ff',
              }}
            >
              {(record.fullname ? record.fullname.charAt(0).toUpperCase() : '')}
            </Avatar>

            {record.is_busy && (
              <Badge
                status="success"
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullname}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.phone_number}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: DriverType) => {
        let statusIcon, statusText, statusColor;
        
        if (record.is_busy) {
          statusIcon = <CarOutlined />;
          statusText = 'Yo\'lda';
          statusColor = 'success';
        } else if (record.status === 'driver' || record.status === 'active') {
          statusIcon = <ClockCircleOutlined />;
          statusText = 'Kutishda';
          statusColor = 'default';
        } else {
          statusIcon = <UserOutlined />;
          statusText = record.status;
          statusColor = 'processing';
        }
        
        return <Tag color={statusColor} icon={statusIcon}>{statusText}</Tag>;
      },
      filters: [
        { text: 'Yo\'lda', value: 'on_road' },
        { text: 'Kutishda', value: 'waiting' },
        { text: 'Haydovchi', value: 'driver' },
        { text: 'Egasi', value: 'Owner' },
        { text: 'CEO', value: 'CEO' },
        { text: 'Bugalter', value: 'Bugalter' },
        { text: 'Zaphos', value: 'Zaphos' }
      ],
      onFilter: (value: string, record: DriverType) => {
        if (value === 'on_road') return record.is_busy === true;
        if (value === 'waiting') return record.is_busy === false;
        return record.status === value;
      },
    },
    {
      title: 'Guvohnoma',
      key: 'license',
      width: 140,
      render: (_: any, record: DriverType) => (
        <Space direction="vertical" size={0}>
          <Text>{record.license_number || 'Mavjud emas'}</Text>
          {record.license_expiry && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <FormattedDate date={record.license_expiry} />
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Reyslar',
      key: 'trips',
      width: 100,
      render: (_: any, record: DriverType) => (
        <Text>{record.rays_count || 0}</Text>
      ),
      sorter: (a: DriverType, b: DriverType) => (a.rays_count || 0) - (b.rays_count || 0),
    },
    {
      title: "To`langan oyliklar",
      key: "total_rays_usd",
      width: 100,
      render: (_: any, record: DriverType) => (
        <Text>{record.total_rays_usd || 0}$</Text>
      ),
      sorter: (a: DriverType, b: DriverType) => (a.total_rays_usd || 0) - (b.total_rays_usd || 0),
    },
    {
      title: 'Amallar',
      key: 'action',
      width: 180,
      render: (_: any, record: DriverType) => (
        <Space size="middle">
          <Tooltip title="Haydovchi tarixi">
            <Button
              type="primary"
              size="small"
              shape="circle"
              onClick={() => onView(record)}
              icon={<HistoryOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ backgroundColor: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="primary"
              danger
              size="small"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
          <Dropdown overlay={renderMoreActions(record)} trigger={['click']}>
            <Button
              size="small"
              shape="circle"
              icon={<MoreOutlined />}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];
  
  return (
    <Table
      columns={columns}
      dataSource={drivers}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      size="middle"
      rowSelection={rowSelection}
      expandable={{
        expandedRowRender: (record) => (
          <Row gutter={16}>
            <Col span={8}>
              <Space direction="vertical">
                <Space>
                  <PhoneOutlined />
                  <Text>{record.phone_number}</Text>
                </Space>
                <Space>
                  <IdcardOutlined />
                  <Text>{record.passport || 'Mavjud emas'}</Text>
                </Space>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical">
                <Space>
                  <CalendarOutlined />
                  <Text>Qo'shilgan sana: <FormattedDate date={record.date} /></Text>
                </Space>
                <Space>
                  <HistoryOutlined />
                  <Text>Reyslar soni: {record.rays_count || 0}</Text>
                </Space>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical">
                <Space>
                  <DollarOutlined />
                  <Text>To'langan pul: {record.total_rays_usd || 0}$</Text>
                </Space>
                <Space>
                  <UserOutlined />
                  <Text>Status: {record.status}</Text>
                </Space>
              </Space>
            </Col>
            
            {/* Extended Passport Info */}
            <Col span={24} style={{ marginTop: '16px' }}>
              <div style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#595959' }}>Pasport va Qo'shimcha Ma'lumotlar</h5>
                <Row gutter={[16, 8]}>
                  <Col span={8}>
                    <Text type="secondary">Seriya va raqam:</Text><br/>
                    <Text>{record.passport_series || ''} {record.passport_number || 'Mavjud emas'}</Text>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Kim bergan:</Text><br/>
                    <Text>{record.passport_issued_by || 'Mavjud emas'}</Text>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Sanalar:</Text><br/>
                    <Text>Berilgan: <FormattedDate date={record.passport_issued_date} /></Text><br/>
                    <Text>Tug'ilgan: <FormattedDate date={record.passport_birth_date} /></Text>
                  </Col>
                </Row>
                {record.passport_photo && (
                  <div style={{ marginTop: '12px' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Pasport nusxasi:</Text>
                    <Avatar 
                      src={formatImageUrl(record.passport_photo)} 
                      shape="square" 
                      size={64} 
                      icon={<IdcardOutlined />} 
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        ),
      }}
    />
  );
};

export default DriverTable; 