import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Typography, Button, Table, Tag, Space, Input, Modal, Form, Select, InputNumber, DatePicker, Spin, Alert, Empty } from 'antd';
import { PlusOutlined, SearchOutlined, WalletOutlined, DollarOutlined, FileExcelOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, UserOutlined, AreaChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { mockData } from '../../mockData';
import { PaymentStatus, Client, TripClient } from '../../mockData';
import ClientsList from './ClientsList';
import PaymentStatusList from './PaymentStatusList';
import ClientDebtChart from './ClientDebtChart';
import { cashApi } from '../../../../../accounting/api/cash/cashApi';
import styles from '../../finance.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Define types
export interface Client {
  id: string | number;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  balance: number;
  totalSpent?: number;
  createdAt?: Date | string;
}

export interface PaymentStatus {
  id: string | number;
  clientId: string | number;
  tripId?: string | number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate?: Date | string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  paymentType?: string;
  lastPaymentDate?: Date | string;
  notes?: string;
}

const ClientPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [clientDebts, setClientDebts] = useState<any[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch client debts from the real API
      const debtsResponse = await cashApi.getAllClientDebts();
      setClientDebts(debtsResponse);
      
      // Convert client debts to client format
      const extractedClients: Client[] = debtsResponse.map(debt => ({
        id: debt.client__id || debt.id,
        name: debt.client_name || (debt.client_details ? debt.client_details.name : 'Nomalum mijoz'),
        balance: debt.amount_usd || 0,
        company: debt.client_details?.company || '',
        phone: debt.client_details?.phone || '',
      }));
      
      setClients(extractedClients);
      
      // Create payment statuses from debt information
      const extractedPaymentStatuses: PaymentStatus[] = debtsResponse.map(debt => ({
        id: debt.id,
        clientId: debt.client__id,
        totalAmount: debt.amount_usd,
        paidAmount: 0,
        remainingAmount: debt.amount_usd,
        status: 'unpaid',
        createdAt: debt.created_at,
      }));
      
      setPaymentStatuses(extractedPaymentStatuses);
      setError(null);
    } catch (err) {
      console.error('Error fetching client data:', err);
      setError('Mijozlar ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchData();
  };
  
  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Mijozlar ma'lumotlari yuklanmoqda...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
      />
    );
  }
  
  return (
    <div className="client-payments">
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <div>
          <h2>Mijozlar va To'lovlar</h2>
          <p>Mijozlar balansi va to'lovlar holati</p>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Yangilash
          </Button>
          <Button 
            icon={<FileExcelOutlined />}
            onClick={() => console.log('Export data')}
          >
            Eksport
          </Button>
        </Space>
      </Space>
      
      {clients.length === 0 && !loading ? (
        <Empty 
          description={
            <span>
              Mijozlar mavjud emas.
            </span>
          }
        />
      ) : (
        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'clients',
                label: <span><UserOutlined /> Mijozlar</span>,
                children: <ClientsList clients={clients} />
              },
              {
                key: 'payments',
                label: <span><WalletOutlined /> To'lovlar holati</span>,
                children: <PaymentStatusList paymentStatuses={paymentStatuses} clients={clients} />
              },
              {
                key: 'debt-analysis',
                label: <span><AreaChartOutlined /> Qarzlar tahlili</span>,
                children: <ClientDebtChart clients={clients} paymentStatuses={paymentStatuses} />
              }
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default ClientPayments; 