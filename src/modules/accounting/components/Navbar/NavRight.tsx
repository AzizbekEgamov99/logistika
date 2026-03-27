import React, { useState, useEffect } from 'react';
import { Space, Tag, Tooltip, Badge, Divider, message } from 'antd';
import FullScreen from './FullScreen';
import Profile from './Profile';
import { 
  DollarOutlined, 
  EuroOutlined, 
  BankOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import { useCurrencies } from '../../hooks/useCurrencies';

// Currency rate interface
interface CurrencyRate {
  id: number;
  currency: string;
  rate_to_uzs: string;
  updated_at: string;
}

const NavRight: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { currencies, loading, error } = useCurrencies();

  // Set last update time when currencies are loaded
  useEffect(() => {
    if (currencies.length > 0 && !loading) {
      setLastUpdate(new Date());
    }
    
    if (error) {
      message.error('Valyuta kurslarini yuklashda xatolik yuz berdi');
    }
  }, [currencies, loading, error]);

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'RUB': return '₽';
      case 'UZS': return 'so\'m';
      default: return code;
    }
  };

  // Get currency icon
  const getCurrencyIcon = (code: string) => {
    switch (code) {
      case 'USD': return <DollarOutlined />;
      case 'EUR': return <EuroOutlined />;
      case 'RUB': return <BankOutlined />;
      case 'UZS': return <BankOutlined />;
      default: return <DollarOutlined />;
    }
  };

  // Format last update time
  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdate.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Hozirgina yangilandi';
    if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin yangilandi`;
    
    return `${Math.floor(diffMinutes / 60)} soat oldin yangilandi`;
  };

    return (
    <Space size={16} className="nav-right-container" split={<Divider type="vertical" />}>
      <div className="currency-container" style={{ display: 'flex', alignItems: 'center' }}>
        <Badge 
          dot={loading}
          status={loading ? 'processing' : 'default'}
        >
          <Tooltip title={formatLastUpdate()}>
            <AreaChartOutlined 
              style={{ fontSize: '18px', marginRight: '8px', color: '#1890ff' }} 
            />
          </Tooltip>
        </Badge>

        <Space size={8}>
          {currencies
            .filter(curr => curr.currency !== 'UZS') // Skip UZS as it's the base currency
            .map(currency => (
              <Tooltip 
                key={currency.id} 
                title={`1 ${currency.currency} = ${Number(currency.rate_to_uzs).toLocaleString()} UZS`}
                >
                <Tag 
                  color={currency.currency === 'USD' ? 'green' : 
                        currency.currency === 'EUR' ? 'blue' : 
                        'orange'} 
                  icon={getCurrencyIcon(currency.currency)}
                  style={{ 
                    padding: '4px 8px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                    borderRadius: '4px',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {getCurrencySymbol(currency.currency)} {Number(currency.rate_to_uzs).toLocaleString()}
                </Tag>
              </Tooltip>
            ))}
        </Space>
      </div>
      
      <Space>
        <FullScreen />
                <Profile />
            </Space>
    </Space>
    );
};

export default NavRight;