import React, { useRef, useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Spin } from 'antd';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { DeliverySummaryData } from '../../types';

const { Title, Text } = Typography;

interface DeliverySummaryChartProps {
  data: DeliverySummaryData;
  loading: boolean;
}

export const DeliverySummaryChart: React.FC<DeliverySummaryChartProps> = ({ data, loading }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [safeData, setSafeData] = useState({
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    completed: [],
    pending: []
  });

  useEffect(() => {
    if (data) {
      setSafeData({
        months: data.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        completed: Array.isArray(data.completed) ? data.completed : [],
        pending: Array.isArray(data.pending) ? data.pending : []
      });
    }
  }, [data]);

  useEffect(() => {
    if (loading || !data || !chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Extract data from safeData
    const { months, completed, pending } = safeData;

    // Create gradients
    const completedGradient = ctx.createLinearGradient(0, 0, 0, 300);
    completedGradient.addColorStop(0, 'rgba(82, 196, 26, 0.8)');
    completedGradient.addColorStop(1, 'rgba(82, 196, 26, 0.2)');

    const pendingGradient = ctx.createLinearGradient(0, 0, 0, 300);
    pendingGradient.addColorStop(0, 'rgba(250, 173, 20, 0.8)');
    pendingGradient.addColorStop(1, 'rgba(250, 173, 20, 0.2)');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Completed',
            data: completed,
            backgroundColor: completedGradient,
            borderColor: '#52c41a',
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'Pending',
            data: pending,
            backgroundColor: pendingGradient,
            borderColor: '#faad14',
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
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
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Deliveries',
              font: {
                size: 12,
              },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              padding: 15,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#334155',
            bodyColor: '#334155',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            boxPadding: 6,
            padding: 12,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y;
                return label;
              }
            }
          },
        },
        animation: {
          duration: 1200,
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [safeData, loading]);

  if (loading || !data) {
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        {(() => {
          const totalCompleted = safeData.completed.reduce((sum, val) => sum + val, 0);
          const totalPending = safeData.pending.reduce((sum, val) => sum + val, 0);
          const totalDeliveries = totalCompleted + totalPending;
          const completionRate = totalDeliveries > 0 
            ? ((totalCompleted / totalDeliveries) * 100).toFixed(1) 
            : '0.0';

          return (
            <>
              <div style={{ marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0 }}>Delivery Summary</Title>
              </div>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.03))'
                    }}
                  >
                    <div>
                      <Text type="secondary">Completed</Text>
                      <Title level={3} style={{ margin: '8px 0 0', color: '#52c41a' }}>{totalCompleted}</Title>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(250, 173, 20, 0.1), rgba(250, 173, 20, 0.03))'
                    }}
                  >
                    <div>
                      <Text type="secondary">Pending</Text>
                      <Title level={3} style={{ margin: '8px 0 0', color: '#faad14' }}>{totalPending}</Title>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(24, 144, 255, 0.03))'
                    }}
                  >
                    <div>
                      <Text type="secondary">Completion Rate</Text>
                      <Title level={3} style={{ margin: '8px 0 0', color: '#1890ff' }}>
                        {completionRate}%
                      </Title>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div style={{ height: '300px', marginTop: '16px' }}>
                <canvas ref={chartRef} />
              </div>
            </>
          );
        })()}
      </Card>
    </motion.div>
  );
}; 