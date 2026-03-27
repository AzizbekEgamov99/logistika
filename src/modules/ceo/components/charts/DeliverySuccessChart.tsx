import React, { useRef, useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin } from 'antd';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { DeliverySuccessData } from '../../types';

const { Title, Text } = Typography;

interface DeliverySuccessChartProps {
  data: DeliverySuccessData;
  loading: boolean;
}

export const DeliverySuccessChart: React.FC<DeliverySuccessChartProps> = ({ data, loading }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [safeData, setSafeData] = useState({
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    delivered: [],
    failed: []
  });

  useEffect(() => {
    if (data) {
      setSafeData({
        months: data.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        delivered: Array.isArray(data.delivered) ? data.delivered : [],
        failed: Array.isArray(data.failed) ? data.failed : []
      });
    }
  }, [data]);

  useEffect(() => {
    if (loading || !safeData || !chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Extract data from safeData
    const { months, delivered, failed } = safeData;
    
    // Calculate success rates - Ensure arrays are valid before mapping
    const successRates = months.map((_, idx) => {
      const d = delivered[idx] || 0;
      const f = failed[idx] || 0;
      const total = d + f;
      return total > 0 ? (d / total) * 100 : 0;
    });

    // Create gradients
    const deliveredGradient = ctx.createLinearGradient(0, 0, 0, 300);
    deliveredGradient.addColorStop(0, 'rgba(82, 196, 26, 0.8)');
    deliveredGradient.addColorStop(1, 'rgba(82, 196, 26, 0.2)');

    const failedGradient = ctx.createLinearGradient(0, 0, 0, 300);
    failedGradient.addColorStop(0, 'rgba(255, 77, 79, 0.8)');
    failedGradient.addColorStop(1, 'rgba(255, 77, 79, 0.2)');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Delivered',
            data: delivered,
            backgroundColor: deliveredGradient,
            borderColor: '#52c41a',
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            order: 2,
          },
          {
            label: 'Failed',
            data: failed,
            backgroundColor: failedGradient,
            borderColor: '#ff4d4f',
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            order: 3,
          },
          {
            label: 'Success Rate',
            data: successRates,
            type: 'line',
            borderColor: '#1890ff',
            backgroundColor: 'rgba(24, 144, 255, 0.5)',
            borderWidth: 2,
            pointBackgroundColor: '#1890ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            tension: 0.3,
            yAxisID: 'y1',
            order: 1,
          }
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
            position: 'left',
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
          y1: {
            beginAtZero: true,
            max: 100,
            position: 'right',
            title: {
              display: true,
              text: 'Success Rate (%)',
              font: {
                size: 12,
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
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
                if (label.includes('Success Rate')) {
                  label += context.parsed.y.toFixed(1) + '%';
                } else {
                  label += context.parsed.y;
                }
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

  if (loading || !safeData) {
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  // Function to determine color based on success rate
  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 90) return '#52c41a'; // Green for excellent
    if (rate >= 70) return '#1890ff'; // Blue for good
    if (rate >= 50) return '#faad14'; // Orange for average
    return '#ff4d4f'; // Red for poor
  };
  
  // Move calculations inside the return block
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        {(() => {
          // Calculate overall metrics using safeData
          const totalDelivered = safeData.delivered.reduce((sum, val) => sum + val, 0);
          const totalFailed = safeData.failed.reduce((sum, val) => sum + val, 0);
          const totalDeliveries = totalDelivered + totalFailed;
          const overallSuccessRate = totalDeliveries > 0 
            ? ((totalDelivered / totalDeliveries) * 100).toFixed(1) 
            : '0.0';
          const successRateColor = getSuccessRateColor(parseFloat(overallSuccessRate));
          
          return (
            <>
              <div style={{ marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0 }}>Delivery Success</Title>
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
                      <Text type="secondary">Delivered</Text>
                      <Title level={3} style={{ margin: '8px 0 0', color: '#52c41a' }}>{totalDelivered}</Title>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(255, 77, 79, 0.1), rgba(255, 77, 79, 0.03))'
                    }}
                  >
                    <div>
                      <Text type="secondary">Failed</Text>
                      <Title level={3} style={{ margin: '8px 0 0', color: '#ff4d4f' }}>{totalFailed}</Title>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    size="small" 
                    style={{ 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${successRateColor}1A, ${successRateColor}08)`
                    }}
                  >
                    <div>
                      <Text type="secondary">Success Rate</Text>
                      <Title level={3} style={{ margin: '8px 0 0', color: successRateColor }}>
                        {overallSuccessRate}%
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