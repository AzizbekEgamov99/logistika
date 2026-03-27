import React, { useState, useRef, useEffect } from 'react';
import { Segmented, Spin, Empty } from 'antd';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { 
  LineChartOutlined, 
  BarChartOutlined, 
} from '@ant-design/icons';


interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface FinancialOverviewChartProps {
  data: FinancialData[];
  loading?: boolean;
}

export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({ 
  data = [],
  loading = false
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (loading || !data.length || !chartRef.current) return;

    // Clear existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const periods = data.map(item => item.period);
    
    // Create gradient for revenue
    const revenueGradient = ctx.createLinearGradient(0, 0, 0, 300);
    revenueGradient.addColorStop(0, 'rgba(24, 144, 255, 0.2)');
    revenueGradient.addColorStop(1, 'rgba(24, 144, 255, 0)');
    
    // Create gradient for expenses
    const expensesGradient = ctx.createLinearGradient(0, 0, 0, 300);
    expensesGradient.addColorStop(0, 'rgba(250, 140, 22, 0.2)');
    expensesGradient.addColorStop(1, 'rgba(250, 140, 22, 0)');
    
    // Create gradient for profit
    const profitGradient = ctx.createLinearGradient(0, 0, 0, 300);
    profitGradient.addColorStop(0, 'rgba(82, 196, 26, 0.2)');
    profitGradient.addColorStop(1, 'rgba(82, 196, 26, 0)');

    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: periods,
        datasets: [
          {
            label: 'Daromad',
            data: data.map(item => item.revenue),
            borderColor: '#1890ff',
            backgroundColor: chartType === 'line' ? revenueGradient : 'rgba(24, 144, 255, 0.6)',
            borderWidth: 2,
            tension: 0.4,
            fill: chartType === 'line',
            pointBackgroundColor: 'white',
            pointBorderColor: '#1890ff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            order: 2
          },
          {
            label: 'Xarajatlar',
            data: data.map(item => item.expenses),
            borderColor: '#fa8c16',
            backgroundColor: chartType === 'line' ? expensesGradient : 'rgba(250, 140, 22, 0.6)',
            borderWidth: 2,
            tension: 0.4,
            fill: chartType === 'line',
            pointBackgroundColor: 'white',
            pointBorderColor: '#fa8c16',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            order: 3
          },
          {
            label: 'Foyda',
            data: data.map(item => item.profit),
            borderColor: '#52c41a',
            backgroundColor: chartType === 'line' ? profitGradient : 'rgba(82, 196, 26, 0.6)',
            borderWidth: 2,
            tension: 0.4,
            fill: chartType === 'line',
            pointBackgroundColor: 'white',
            pointBorderColor: '#52c41a',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            order: 1
          }
        ]
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
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              padding: 15,
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
                return `${context.dataset.label}: ${value.toLocaleString()} $`;
              }
            }
          }
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
                if (!numValue && numValue !== 0) return '0';
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
              padding: 8,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading, chartType]);

  // Calculate totals
  const totals = data.reduce((acc, item) => {
    acc.revenue += item.revenue;
    acc.expenses += item.expenses;
    acc.profit += item.profit;
    return acc;
  }, { revenue: 0, expenses: 0, profit: 0 });

  if (loading) {
    return (
      <div className="financial-chart-container loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="financial-chart-container empty">
        <Empty description="Ma'lumot topilmadi" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="financial-chart-container"
    >
      <div className="chart-header">
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-color" style={{ backgroundColor: '#1890ff' }}></span>
            <div className="summary-data">
              <span className="summary-label">Daromad</span>
              <span className="summary-value">{totals.revenue ? totals.revenue.toLocaleString() : '0'} so`m</span>
            </div>
          </div>
          <div className="summary-item">
            <span className="summary-color" style={{ backgroundColor: '#fa8c16' }}></span>
            <div className="summary-data">
              <span className="summary-label">Xarajatlar</span>
              <span className="summary-value">{totals.expenses ? totals.expenses.toLocaleString() : '0'} so`m</span>
            </div>
          </div>
          <div className="summary-item">
            <span className="summary-color" style={{ backgroundColor: '#52c41a' }}></span>
            <div className="summary-data">
              <span className="summary-label">Foyda</span>
              <span className="summary-value">{totals.profit ? totals.profit.toLocaleString() : '0'} so`m</span>
            </div>
          </div>
        </div>
        
        <Segmented
          value={chartType}
          onChange={(value) => setChartType(value as 'line' | 'bar')}
          options={[
            {
              value: 'line',
              icon: <LineChartOutlined />,
            },
            {
              value: 'bar',
              icon: <BarChartOutlined />,
            },
          ]}
        />
      </div>
      
      <div className="chart-wrapper">
        <canvas ref={chartRef} height={300} />
      </div>

      <style jsx global>{`
        .financial-chart-container {
          position: relative;
          height: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .financial-chart-container.loading,
        .financial-chart-container.empty {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .chart-summary {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .summary-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .summary-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .summary-data {
          display: flex;
          flex-direction: column;
        }
        
        .summary-label {
          font-size: 12px;
          color: #64748b;
        }
        
        .summary-value {
          font-weight: 600;
          font-size: 14px;
        }
        
        .chart-wrapper {
          flex: 1;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .financial-chart-container {
            min-height: 350px;
          }
        }
      `}</style>
    </motion.div>
  );
}; 