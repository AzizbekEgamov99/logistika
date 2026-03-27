import React from 'react';
import { Card, Row, Col, Progress, Typography, Divider } from 'antd';
import { 
  SettingOutlined, 
  ExperimentOutlined, 
  CheckCircleOutlined, 
  DollarCircleOutlined 
} from '@ant-design/icons';
import { ServiceTotals } from '../api/serviceTotals';

const { Title, Text } = Typography;

interface ServiceSummaryProps {
  totals: ServiceTotals | null;
}

const styles = {
  summaryCard: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    border: 'none',
    overflow: 'hidden'
  },
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #40a9ff 0%, #096dd9 100%)',
    color: 'white'
  },
  summaryContent: {
    padding: '20px 24px'
  },
  iconBlue: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '8px',
    borderRadius: '50%',
    marginRight: '8px'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressContainer: {
    marginBottom: '20px',
    background: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px'
  },
  progressIcon: {
    marginRight: '8px',
    fontSize: '16px'
  },
  totalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  totalTitle: {
    textAlign: 'center',
    marginBottom: '16px',
    color: '#1677ff'
  },
  totalValue: {
    textAlign: 'center',
    color: '#1677ff',
    fontSize: '36px',
    fontWeight: 'bold'
  },
  totalIcon: {
    fontSize: '48px',
    color: '#1677ff',
    marginBottom: '16px'
  },
  progressColorTexnic: {
    '& .ant-progress-bg': {
      background: 'linear-gradient(90deg, #eb2f96 0%, #c41d7f 100%)'
    }
  },
  progressColorOptol: {
    '& .ant-progress-bg': {
      background: 'linear-gradient(90deg, #fa8c16 0%, #d46b08 100%)'
    }
  },
  progressColorBalon: {
    '& .ant-progress-bg': {
      background: 'linear-gradient(90deg, #722ed1 0%, #531dab 100%)'
    }
  },
  progressColorChiqimlik: {
    '& .ant-progress-bg': {
      background: 'linear-gradient(90deg, #52c41a 0%, #389e0d 100%)'
    }
  },
  progressValue: {
    fontWeight: 'bold',
    fontSize: '16px'
  }
};

const ServiceSummary: React.FC<ServiceSummaryProps> = ({ totals }) => {
  if (!totals) return null;

  const total = totals.total || 1; // Avoid division by zero
  
  const calculatePercentage = (value: number) => {
    return Math.round((value / total) * 100);
  };
  
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} $`;
  };

  return (
    <Card 
      style={styles.summaryCard}
      bodyStyle={{ padding: 0 }}
    >
      <div style={styles.summaryHeader}>
        <DollarCircleOutlined style={styles.iconBlue} />
        Xizmatlar bo'yicha umumiy statistika
      </div>
      
      <div style={styles.summaryContent}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <div style={styles.progressContainer}>
              <div style={styles.progressLabel}>
                <Text><SettingOutlined style={{ ...styles.progressIcon, color: '#eb2f96' }} /> Texnik xizmat</Text>
                <Text style={styles.progressValue}>{formatCurrency(totals.texnic)}</Text>
              </div>
              <Progress 
                percent={calculatePercentage(totals.texnic)} 
                strokeColor={{ from: '#eb2f96', to: '#c41d7f' }}
                size="small"
                status="active"
              />
            </div>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressLabel}>
                <Text><ExperimentOutlined style={{ ...styles.progressIcon, color: '#fa8c16' }} /> Moy xizmati</Text>
                <Text style={styles.progressValue}>{formatCurrency(totals.optol)}</Text>
              </div>
              <Progress 
                percent={calculatePercentage(totals.optol)} 
                strokeColor={{ from: '#fa8c16', to: '#d46b08' }}
                size="small"
                status="active"
              />
            </div>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressLabel}>
                <Text><CheckCircleOutlined style={{ ...styles.progressIcon, color: '#722ed1' }} /> Balon xizmati</Text>
                <Text style={styles.progressValue}>{formatCurrency(totals.balon)}</Text>
              </div>
              <Progress 
                percent={calculatePercentage(totals.balon)}
                strokeColor={{ from: '#722ed1', to: '#531dab' }}
                size="small"
                status="active"
              />
            </div>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressLabel}>
                <Text><DollarCircleOutlined style={{ ...styles.progressIcon, color: '#52c41a' }} /> Chiqimlik</Text>
                <Text style={styles.progressValue}>{formatCurrency(totals.chiqimlik)}</Text>
              </div>
              <Progress 
                percent={calculatePercentage(totals.chiqimlik)} 
                strokeColor={{ from: '#52c41a', to: '#389e0d' }}
                size="small"
                status="active"
              />
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <div style={styles.totalContainer}>
              <DollarCircleOutlined style={styles.totalIcon} />
              <Title level={5} style={styles.totalTitle}>Umumiy summa</Title>
              <div style={styles.totalValue}>
                {formatCurrency(totals.total)}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ServiceSummary; 