// import React from 'react';
// import { Table, Space, Button, Tag, Popconfirm } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { DriverType } from '../../../types/driver';

// interface DriverTableProps {
//     drivers: DriverType[];
//     loading: boolean;
//     total: number;
//     onEdit: (driver: DriverType) => void;
//     onDelete: (id: number) => void;
//     onTableChange: (pagination: any, filters: any, sorter: any) => void;
//     currentPage: number;
//     pageSize: number;
// }

// const DriverTable: React.FC<DriverTableProps> = ({
//     drivers,
//     loading,
//     total,
//     onEdit,
//     onDelete,
//     onTableChange,
//     currentPage,
//     pageSize
// }) => {
//     const columns = [
//         {
//             title: 'F.I.O',
//             dataIndex: 'fullname',
//             key: 'fullname',
//             sorter: true,
//             render: (text: string, record: DriverType) => (
//                 <div>
//                     <div>{record.fullname}</div>
//                     <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.username}</div>
//                 </div>
//             )
//         },
//         {
//             title: 'Telefon',
//             dataIndex: 'phone_number',
//             key: 'phone_number',
//             render: (phone: string) => phone || 'Telefon raqam kiritilmagan'
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status: string) => {
//                 let color = 'default';
//                 let text = status;

//                 switch (status) {
//                     case 'active':
//                         color = 'green';
//                         text = 'Faol';
//                         break;
//                     case 'inactive':
//                         color = 'red';
//                         text = 'Nofaol';
//                         break;
//                     case 'onRoute':
//                         color = 'blue';
//                         text = 'Yo\'lda';
//                         break;
//                     case 'onVacation':
//                         color = 'orange';
//                         text = 'Ta\'tilda';
//                         break;
//                     case 'owner':
//                         color = 'purple';
//                         text = 'Egasi';
//                         break;
//                     case 'driver':
//                         color = 'cyan';
//                         text = 'Haydovchi';
//                         break;
//                     case 'manager':
//                         color = 'geekblue';
//                         text = 'Menejer';
//                         break;
//                 }

//                 return <Tag color={color}>{text}</Tag>;
//             },
//             filters: [
//                 { text: 'Faol', value: 'active' },
//                 { text: 'Nofaol', value: 'inactive' },
//                 { text: 'Yo\'lda', value: 'onRoute' },
//                 { text: 'Ta\'tilda', value: 'onVacation' },
//                 { text: 'Egasi', value: 'owner' },
//                 { text: 'Haydovchi', value: 'driver' },
//                 { text: 'Menejer', value: 'manager' }
//             ],
//         },
//         {
//             title: 'Amallar',
//             key: 'actions',
//             render: (_: any, record: DriverType) => (
//                 <Space size="middle">
//                     <Button
//                         type="primary"
//                         icon={<EditOutlined />}
//                         onClick={() => onEdit(record)}
//                     >
//                         O'zgartirish
//                     </Button>
//                     <Popconfirm
//                         title="Haydovchini o'chirishni xohlaysizmi?"
//                         onConfirm={() => onDelete(record.id)}
//                         okText="Ha"
//                         cancelText="Yo'q"
//                     >
//                         <Button type="primary" danger icon={<DeleteOutlined />}>
//                             O'chirish
//                         </Button>
//                     </Popconfirm>
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <Table
//             columns={columns}
//             dataSource={drivers}
//             rowKey="id"
//             loading={loading}
//             pagination={{
//                 total,
//                 current: currentPage,
//                 pageSize: pageSize,
//                 showSizeChanger: true,
//                 showTotal: (total) => `Jami ${total} ta`,
//             }}
//             onChange={onTableChange}
//         />
//     );
// };

// export default DriverTable; 