import React, { useRef, useEffect } from 'react';
import { Typography, Spin, Empty } from 'antd';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const { Text } = Typography;

interface ExpenseItem {
  name: string;
  value: number;
}

interface ExpensesBreakdownChartProps {
  data: ExpenseItem[];
  loading?: boolean;
}

export const ExpensesBreakdownChart: React.FC<ExpensesBreakdownChartProps> = ({ 
  data = [],
  loading = false
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const colors = [
    '#4377CD', // Service xarajatlari
    '#F8BD7A', // Ish haqi
    '#98D9D9', // Boshqa xarajatlar
    '#B695C0', // Additional color
    '#F3B562', // Additional color
    '#DE8676'  // Additional color
  ];

  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    if (loading || !data.length || !chartRef.current) return;

    // Clear existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = data.map(item => item.name);
    const values = data.map(item => item.value);

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, data.length),
            borderColor: 'white',
            borderWidth: 2,
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12
              }
            }
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
                const value = context.raw as number;
                const percentage = totalExpenses ? ((value / totalExpenses) * 100).toFixed(1) : '0';
                return `${context.label}: $${value.toLocaleString(undefined, {maximumFractionDigits: 2})} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading, totalExpenses]);

  if (loading) {
    return (
      <div className="expenses-chart-container loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="expenses-chart-container empty">
        <Empty description="Ma'lumot topilmadi" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="expenses-chart-container"
    >
      <div className="expenses-summary">
        <div className="total-value">
          <Text type="secondary">Jami xarajatlar:</Text>
          <Text strong>${totalExpenses ? totalExpenses.toLocaleString(undefined, {maximumFractionDigits: 2}) : '0'}</Text>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <canvas ref={chartRef} height={300} />
      </div>
   

      <style jsx global>{`
        .expenses-chart-container {
          position: relative;
          height: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .expenses-chart-container.loading,
        .expenses-chart-container.empty {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .expenses-summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .total-value {
          display: flex;
          flex-direction: column;
        }
        
        .chart-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .expenses-breakdown {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .expense-category {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        
        .expense-category:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        
        .category-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .category-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .category-value {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        @media (max-width: 768px) {
          .expenses-chart-container {
            min-height: 350px;
          }
        }
      `}</style>
    </motion.div>
  );
}; 