// import React, { useEffect, useState } from 'react';
// import { Card, Descriptions, Button, Spin, Space, Divider, Tag, Modal, message } from 'antd';
// import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
// import { useFurgons } from '../../hooks/useFurgons';
// import FurgonForm from './FurgonForm';
// import { Furgon } from '../../types/furgon';

// const FurgonDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { useFurgon, deleteFurgon } = useFurgons();
//   const [isModalVisible, setIsModalVisible] = useState(false);
  
//   const numericId = id ? parseInt(id, 10) : 0;
//   const { data: furgon, isLoading, isError } = useFurgon(numericId);

//   useEffect(() => {
//     if (isError) {
//       message.error('Furgon ma\'lumotlarini yuklashda xatolik yuz berdi');
//       navigate('/furgons');
//     }
//   }, [isError, navigate]);

//   const handleEdit = () => {
//     setIsModalVisible(true);
//   };

//   const handleDelete = () => {
//     Modal.confirm({
//       title: 'Furgonni o\'chirish',
//       content: 'Haqiqatan ham bu furgonni o\'chirmoqchimisiz?',
//       okText: 'Ha',
//       cancelText: 'Yo\'q',
//       onOk: () => {
//         deleteFurgon(numericId, {
//           onSuccess: () => {
//             message.success('Furgon muvaffaqiyatli o\'chirildi');
//             navigate('/furgons');
//           },
//           onError: () => {
//             message.error('Furgonni o\'chirishda xatolik yuz berdi');
//           }
//         });
//       }
//     });
//   };

//   const getStatusTag = (status: string) => {
//     let color = '';
//     switch (status) {
//       case 'active':
//         color = 'green';
//         return <Tag color={color}>Faol</Tag>;
//       case 'maintenance':
//         color = 'gold';
//         return <Tag color={color}>Reysda</Tag>;
//       case 'waiting':
//         color = 'red';
//         return <Tag color={color}>Kutmoqda</Tag>;
//       default:
//         color = 'default';
//         return <Tag color={color}>{status}</Tag>;
//     }
//   };

//   if (isLoading) {
//     return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spin size="large" /></div>;
//   }

//   if (!furgon) {
//     return <div>Furgon topilmadi</div>;
//   }

//   return (
//     <div className="furgon-details">
//       <Card 
//         title={
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <Button 
//               icon={<ArrowLeftOutlined />} 
//               style={{ marginRight: '16px' }}
//               onClick={() => navigate('/furgons')}
//             />
//             <span>Furgon ma'lumotlari: {furgon.model} ({furgon.number})</span>
//           </div>
//         }
//         extra={
//           <Space>
//             <Button 
//               type="primary" 
//               icon={<EditOutlined />} 
//               onClick={handleEdit}
//             >
//               Tahrirlash
//             </Button>
//             <Button 
//               danger 
//               icon={<DeleteOutlined />} 
//               onClick={handleDelete}
//             >
//               O'chirish
//             </Button>
//           </Space>
//         }
//       >
//         <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
//           <Descriptions.Item label="ID">{furgon.id}</Descriptions.Item>
//           <Descriptions.Item label="Model">{furgon.model}</Descriptions.Item>
//           <Descriptions.Item label="Davlat raqami">{furgon.number}</Descriptions.Item>
//           <Descriptions.Item label="Holati">{getStatusTag(furgon.status)}</Descriptions.Item>
//           <Descriptions.Item label="Haydovchi">{furgon.driver}</Descriptions.Item>
//           <Descriptions.Item label="Sig'imi">{furgon.capacity || '-'} tonna</Descriptions.Item>
//           <Descriptions.Item label="Tavsif" span={3}>
//             {furgon.description || 'Tavsif mavjud emas'}
//           </Descriptions.Item>
//         </Descriptions>

//         <Divider orientation="left">Qo'shimcha ma'lumotlar</Divider>
        
//         {/* Bu yerda kerakli bo'lsa qo'shimcha ma'lumotlar uchun komponentlar qo'shish mumkin */}
//         {/* Masalan: Haydovchi ma'lumotlari, texnik ko'rik sanasi, yoqilg'i sarfi, va h.k. */}
//       </Card>

//       <FurgonForm 
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         furgon={furgon}
//       />
//     </div>
//   );
// };

// export default FurgonDetails;