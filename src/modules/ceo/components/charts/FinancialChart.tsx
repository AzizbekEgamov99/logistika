import React, { useState, useRef, useEffect } from 'react';
import { Radio, Typography, Spin, Segmented, Tooltip, Button as AntButton } from 'antd';
import { ChartData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChartOutlined, 
  BarChartOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  InfoCircleOutlined, 
  DollarOutlined, 
  ShoppingOutlined, 
  FundOutlined 
} from '@ant-design/icons';
import Chart from 'chart.js/auto';
import { ChartOptions } from 'chart.js';

const {  Text } = Typography;
const { Button } = Radio;

interface FinancialChartProps {
  data: ChartData[];
  loading: boolean;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ data, loading }) => {
  const [metricType, setMetricType] = useState<'revenue' | 'expenses' | 'profit'>('revenue');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Calculate change percentages from previous period
  const getChangePercentage = () => {
    if (!data || data.length < 2) return null;
    
    const currentTotal = data.reduce((sum, item) => sum + (item[metricType] || 0), 0);
    let previousTotal = 0;
    
    // Assuming data is sorted chronologically
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    previousTotal = firstHalf.reduce((sum, item) => sum + (item[metricType] || 0), 0);
    
    if (previousTotal === 0) return null;
    const changePercent = ((currentTotal - previousTotal) / previousTotal) * 100;
    return changePercent;
  };

  const changePercentage = getChangePercentage();
  const isPositiveChange = changePercentage !== null && changePercentage > 0;

  useEffect(() => {
    if (loading || !data.length || !chartRef.current) return;

    // Mavjud chartni o'chirish
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Ma'lumotlarni tayyorlash
    const labels = data.map(item => item.period);
    const values = data.map(item => item[metricType] || 0);

    // Metrika turiga qarab ranglarni tanlash
    let primaryColor;
    let gradientColor;
    let secondaryColor;
    switch (metricType) {
      case 'revenue':
        primaryColor = '#1890ff';
        gradientColor = 'rgba(24, 144, 255, 0.2)';
        secondaryColor = 'rgba(24, 144, 255, 0.8)';
        break;
      case 'expenses':
        primaryColor = '#fa8c16';
        gradientColor = 'rgba(250, 140, 22, 0.2)';
        secondaryColor = 'rgba(250, 140, 22, 0.8)';
        break;
      case 'profit':
        primaryColor = '#52c41a';
        gradientColor = 'rgba(82, 196, 26, 0.2)';
        secondaryColor = 'rgba(82, 196, 26, 0.8)';
        break;
      default:
        primaryColor = '#1890ff';
        gradientColor = 'rgba(24, 144, 255, 0.2)';
        secondaryColor = 'rgba(24, 144, 255, 0.8)';
    }

    // Chart uchun gradient yaratish
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, gradientColor);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Metrika turi uchun o'zbek tilidagi nom
    const metricLabels = {
      revenue: 'Daromad',
      expenses: 'Xarajatlar',
      profit: 'Foyda'
    };

    // Yangi chart yaratish
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: metricLabels[metricType],
            data: values,
            borderColor: primaryColor,
            backgroundColor: chartType === 'line' ? gradient : secondaryColor,
            borderWidth: 3,
            tension: 0.4,
            fill: chartType === 'line',
            pointBackgroundColor: 'white',
            pointBorderColor: primaryColor,
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: primaryColor,
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#334155',
            bodyColor: '#334155',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                let value = context.raw as number;
                return `${metricLabels[metricType]}: ${value.toLocaleString()} $`;
              }
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(240, 242, 245, 0.7)',
              display: true,
              tickBorderDash: []
            },
            border: {
              display: false
            },
            ticks: {
              callback: function(value) {
                const numValue = value as number;
                if (numValue >= 1000000) {
                  return (numValue / 1000000).toLocaleString() + ' mln';
                } else if (numValue >= 1000) {
                  return (numValue / 1000).toLocaleString() + ' ming';
                }
                return numValue.toLocaleString();
              },
              color: '#64748b',
              font: {
                size: 11,
                weight: 'normal'
              },
              padding: 8,
            },
          },
          x: {
            grid: {
              display: false,
              tickBorderDash: []
            },
            border: {
              display: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
                weight: 'normal'
              },
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, metricType, chartType, loading]);

  const getMetricIcon = (type: 'revenue' | 'expenses' | 'profit') => {
    switch(type) {
      case 'revenue': return <DollarOutlined style={{ color: '#1890ff' }} />;
      case 'expenses': return <ShoppingOutlined style={{ color: '#fa8c16' }} />;
      case 'profit': return <FundOutlined style={{ color: '#52c41a' }} />;
    }
  };

  if (loading) {
    return (
      <div className="chart-loading-container">
        <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." fullscreen={true} />
      </div>
    );
  }

  const currentTotal = data.reduce((sum, item) => sum + (item[metricType] || 0), 0);
  const averageValue = (currentTotal / (data.length || 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="financial-chart-container"
    >
      <div>
        <div className="chart-controls">
          <div className="metric-selector-container">
            <Segmented
              value={metricType}
              onChange={(value) => setMetricType(value as 'revenue' | 'expenses' | 'profit')}
              options={[
                {
                  label: (
                    <div className="metric-option">
                      {getMetricIcon('revenue')}
                      <span>Daromad</span>
                    </div>
                  ),
                  value: 'revenue'
                },
                {
                  label: (
                    <div className="metric-option">
                      {getMetricIcon('expenses')}
                      <span>Xarajatlar</span>
                    </div>
                  ),
                  value: 'expenses'
                },
                {
                  label: (
                    <div className="metric-option">
                      {getMetricIcon('profit')}
                      <span>Foyda</span>
                    </div>
                  ),
                  value: 'profit'
                }
              ]}
            />
          </div>
          
          <div className="chart-type-selector">
            <Tooltip title="Chiziqli grafik">
              <AntButton 
                type={chartType === 'line' ? 'primary' : 'default'} 
                icon={<LineChartOutlined />} 
                onClick={() => setChartType('line')}
                shape="circle"
                style={{ marginRight: 8 }}
              />
            </Tooltip>
            <Tooltip title="Ustunli grafik">
              <AntButton 
                type={chartType === 'bar' ? 'primary' : 'default'} 
                icon={<BarChartOutlined />} 
                onClick={() => setChartType('bar')}
                shape="circle"
              />
            </Tooltip>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${metricType}-${chartType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="chart-container"
          >
            {data.length > 0 ? (
              <canvas ref={chartRef} />
            ) : (
              <div className="no-data-container">
                <Typography.Text type="secondary">Ma`lumot mavjud emas</Typography.Text>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="chart-summary">
          <div className="summary-item">
            <Text type="secondary">Jami:</Text>
            <Text strong className="summary-value">
              {currentTotal.toLocaleString()} so`m
              {changePercentage !== null && (
                <span className={`change-badge ${isPositiveChange ? 'positive' : 'negative'}`}>
                  {isPositiveChange ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(changePercentage).toFixed(1)}%
                </span>
              )}
            </Text>
          </div>
          <div className="summary-item">
            <Text type="secondary">
              O`rtacha:
              <Tooltip title="Ushbu ma'lumotlar davridagi o'rtacha qiymat">
                <InfoCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </Text>
            <Text strong className="summary-value">
              {averageValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} so`m
            </Text>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .financial-chart-container {
          background: white;
          border-radius: 12px;
          padding: 4px;
          height: 100%;
        }
        
        .chart-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .metric-selector-container {
          flex: 1;
        }
        
        .metric-selector-container .ant-segmented {
          padding: 4px;
          background-color: #f5f7fa;
          border-radius: 8px;
        }
        
        .metric-option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
        }
        
        .chart-type-selector .ant-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }
        
        .chart-type-selector .ant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .chart-container {
          height: 350px;
          position: relative;
          margin-bottom: 20px;
          padding: 8px;
          background: #fbfcfd;
          border-radius: 8px;
        }
        
        .chart-loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 350px;
          background: #f9fafc;
          border-radius: 8px;
        }
        
        .no-data-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          background: #f9fafc;
          border-radius: 8px;
        }
        
        .chart-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f5f7fa;
          border-radius: 8px;
          margin-top: 16px;
        }
        
        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .summary-value {
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .change-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          padding: 1px 6px;
          border-radius: 12px;
          margin-left: 8px;
        }
        
        .change-badge.positive {
          background-color: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }
        
        .change-badge.negative {
          background-color: rgba(245, 34, 45, 0.1);
          color: #f5222d;
        }
        
        @media (max-width: 768px) {
          .chart-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .chart-type-selector {
            align-self: flex-end;
          }
          
          .chart-summary {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </motion.div>
  );
}; 