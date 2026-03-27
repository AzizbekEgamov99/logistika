import React, { useRef, useEffect, useState } from 'react';
import { Card, Typography, Progress, Skeleton, Tooltip, Badge } from 'antd';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { PieController, ArcElement, Legend, Tooltip as ChartTooltip, DoughnutController } from 'chart.js';
import { InfoCircleOutlined, DollarOutlined } from '@ant-design/icons';

Chart.register(PieController, DoughnutController, ArcElement, Legend, ChartTooltip);

const {  Text } = Typography;

interface ExpenseCategory {
  name: string;
  value: number;
  percentage: number;
}

interface ExpensesBreakdownCardProps {
  data: ExpenseCategory[];
  totalExpenses: number;
  loading?: boolean;
}

export const ExpensesBreakdownCard: React.FC<ExpensesBreakdownCardProps> = ({ 
  data, 
  totalExpenses,
  loading = false 
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Chart uchun ranglar - modern va yorqin ranglar
  const chartColors = ['#1890ff', '#fa8c16', '#52c41a', '#722ed1', '#f759ab'];
  const chartHoverColors = ['#40a9ff', '#ffa940', '#73d13d', '#9254de', '#ff85c0'];
  
  useEffect(() => {
    if (loading || !data.length || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Doughnut chart uchun ma'lumotlarni tayyorlash
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.name),
        datasets: [
          {
            data: data.map(item => item.percentage),
            backgroundColor: data.map((_, index) => chartColors[index % chartColors.length]),
            hoverBackgroundColor: data.map((_, index) => chartHoverColors[index % chartHoverColors.length]),
            borderColor: '#ffffff',
            borderWidth: 2,
            borderRadius: 4,
            hoverBorderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: false,  // Legend o'rniga qo'lda ko'rsatamiz
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#333',
            titleFont: {
              weight: 'bold',
              size: 14
            },
            bodyFont: {
              size: 13
            },
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                const categoryValue = (totalExpenses * value / 100);
                return [
                  `${value.toFixed(1)}%`,
                  `${categoryValue.toLocaleString()} $`
                ];
              }
            }
          },
        },
        animation: {
          duration: 1500,
          animateRotate: true,
          animateScale: true,
        },
        onHover: (event, elements) => {
          if (elements && elements.length) {
            setSelectedCategory(elements[0].index);
          } else {
            setSelectedCategory(null);
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading, totalExpenses]);

  const renderCenterText = () => {
    if (!data.length) return null;
    
    return (
      <div className="chart-center-text">
        <Text className="chart-center-label">Jami</Text>
        <Text className="chart-center-value">
          {Number(totalExpenses).toLocaleString()} 
          <span className="chart-center-currency">so`m</span>
        </Text>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="expenses-breakdown-card">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="expenses-breakdown-container"
    >
      <Card 
        title={
          <div className="card-title-with-icon">
            <DollarOutlined className="card-title-icon" />
            <span>Xarajatlar taqsimoti</span>
            <Tooltip title="Xarajatlarning kategoriyalar bo'yicha taqsimoti">
              <InfoCircleOutlined className="info-icon" />
            </Tooltip>
          </div>
        }
        className="expenses-breakdown-card"
        bordered={false}
      >
        <div className="expenses-content">
          <div className="chart-container">
            <div className="chart-wrapper">
              <canvas ref={chartRef} />
              {renderCenterText()}
            </div>
          </div>
          
          <div className="expenses-categories">
            {data.map((item, index) => (
              <motion.div 
                key={index} 
                className={`expense-category ${selectedCategory === index ? 'selected' : ''}`}
                whileHover={{ translateX: 4 }}
                onClick={() => setSelectedCategory(index === selectedCategory ? null : index)}
              >
                <div className="category-header">
                  <Badge color={chartColors[index % chartColors.length]} text={item.name} />
                  <Text strong className="category-percentage">{item.percentage.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={item.percentage} 
                  showInfo={false} 
                  strokeColor={chartColors[index % chartColors.length]}
                  trailColor="rgba(0,0,0,0.04)"
                  className="category-progress"
                />
                <Text className="category-value">
                  {Number(item.value).toLocaleString()} so`m
                </Text>
              </motion.div>
            ))}
          </div>
          
          <div className="expenses-total">
            <Text>Jami xarajatlar:</Text>
            <Text strong>{Number(totalExpenses).toLocaleString()} so`m</Text>
          </div>
        </div>
      </Card>
      
      <style jsx global>{`
        .expenses-breakdown-container {
          height: 100%;
        }
        
        .expenses-breakdown-card {
          height: 100%;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .expenses-breakdown-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }
        
        .card-title-with-icon {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .card-title-icon {
          color: #1890ff;
          font-size: 18px;
        }
        
        .info-icon {
          font-size: 14px;
          color: #8c8c8c;
          margin-left: 8px;
          cursor: pointer;
          transition: color 0.3s;
        }
        
        .info-icon:hover {
          color: #1890ff;
        }
        
        .expenses-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .chart-container {
          position: relative;
          height: 240px;
          margin-bottom: 24px;
        }
        
        .chart-wrapper {
          position: relative;
          height: 100%;
          width: 100%;
        }
        
        .chart-center-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }
        
        .chart-center-label {
          display: block;
          font-size: 14px;
          color: #8c8c8c;
          margin-bottom: 4px;
        }
        
        .chart-center-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #333;
          white-space: nowrap;
        }
        
        .chart-center-currency {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.7;
        }
        
        .expenses-categories {
          flex: 1;
        }
        
        .expense-category {
          margin-bottom: 16px;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .expense-category:hover, .expense-category.selected {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .category-percentage {
          font-size: 14px;
        }
        
        .category-progress {
          margin-bottom: 6px;
        }
        
        .category-progress .ant-progress-bg {
          height: 8px !important;
          border-radius: 4px;
        }
        
        .category-value {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.65);
        }
        
        .expenses-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          font-size: 15px;
        }
        
        @media (max-width: 576px) {
          .chart-container {
            height: 200px;
          }
          
          .chart-center-value {
            font-size: 16px;
          }
        }
      `}</style>
    </motion.div>
  );
}; 