import React from 'react';
import { Row, Col, Card } from 'antd';

interface Currency {
  id: number;
  currency: string;
  rate_to_uzs: string;
}

interface CashOverview {
  cashbox?: {
    USD?: number;
    UZS?: number;
    EUR?: number;
    RUB?: number;
    KZT?: number;
    total_in_usd?: number;
    [key: string]: number | undefined;
  };
}

interface CurrencyCardsProps {
  currencies: Currency[];
  cashOverview: CashOverview | null;
}

const CurrencyCards: React.FC<CurrencyCardsProps> = ({ currencies, cashOverview }) => {
  // Get currency symbol
  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'RUB': return '₽';
      case 'EUR': return '€';
      case 'UZS': return 'so\'m';
      case 'KZT': return '₸';
      default: return currencyCode;
    }
  };

  // Function to get color class for currency
  const getCurrencyColorClass = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD': return 'usd-card';
      case 'RUB': return 'rub-card';
      case 'EUR': return 'eur-card';
      case 'UZS': return 'uzs-card';
      case 'KZT': return 'kzt-card';
      default: return 'default-card';
    }
  };

  // Ensure we always have at least default currencies available if no currencies are loaded
  const availableCurrencies = currencies && currencies.length > 0 
    ? currencies 
    : [
        { id: 1, currency: 'USD', rate_to_uzs: '1' },
        { id: 2, currency: 'UZS', rate_to_uzs: '1' },
        { id: 3, currency: 'EUR', rate_to_uzs: '1' },
        { id: 4, currency: 'RUB', rate_to_uzs: '1' },
        { id: 5, currency: 'KZT', rate_to_uzs: '1' }
      ];
      
  return (
    <Row gutter={[24, 24]} className="currency-stats">
      {availableCurrencies.map(currency => (
        <Col xs={24} sm={12} md={6} key={`currency-card-${currency.id}`}>
          <Card className={`currency-card ${getCurrencyColorClass(currency.currency)}`} hoverable>
            <div className="currency-card-header">
              <span className="currency-icon">{getCurrencySymbol(currency.currency)}</span>
              <div className="currency-title">{currency.currency}</div>
            </div>
            <div className="currency-amount">
              {cashOverview?.cashbox?.[currency.currency]?.toLocaleString() || 0}
            </div>
            <div className="currency-rate" style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
              1 {currency.currency} = {parseFloat(currency.rate_to_uzs).toLocaleString('uz-UZ')} so'm
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CurrencyCards; 