import React from 'react';
import { Row, Col, Card, Statistic, Typography, Divider, Empty, Spin } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';
import { ExpensesBreakdownChart } from '../../../../components/charts/ExpensesBreakdownChart';

const { Title } = Typography;

const ExpensesBreakdownSection = ({ 
  expensesData = [], 
  realTotalExpenses = 0, 
  isLoading = false 
}) => {
  // Process expense data to ensure it's in the right format for the chart
  const processedExpensesData = Array.isArray(expensesData) 
    ? expensesData 
    : Object.entries(expensesData || {}).map(([name, value], index) => {
        const colors = [
          '#4377CD', '#F8BD7A', '#98D9D9', '#B695C0', '#F3B562', '#DE8676', '#7EB0D5', '#BD7EBE'
        ];
        return {
          name,
          value: typeof value === 'number' ? value : 0,
          color: colors[index % colors.length]
        };
      });

  // Calculate total expenses if not provided
  const calculatedTotalExpenses = realTotalExpenses || 
    processedExpensesData.reduce((sum, item) => sum + (item.value || 0), 0);

  // Get the largest expense if available
  const largestExpense = processedExpensesData.length > 0 
    ? [...processedExpensesData].sort((a, b) => b.value - a.value)[0] 
    : null;

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <Title level={4}><PieChartOutlined /> Xarajatlar taqsimoti (USD)</Title>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="dashboard-card expense-chart-card" loading={isLoading} variant="borderless">
            <div className="expense-chart-header">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Jami xarajatlar (USD)"
                    value={formatCurrency(calculatedTotalExpenses)}
                    valueStyle={{ color: '#cf1322', fontSize: '24px' }}
                    prefix="$"
                  />
                </Col>
                {largestExpense && (
                  <Col span={12}>
                    <Statistic
                      title="Eng katta xarajat"
                      value={largestExpense.name}
                      valueStyle={{ color: '#2fc25b', fontSize: '18px' }}
                      suffix={` ($${formatCurrency(largestExpense.value)})`}
                    />
                  </Col>
                )}
              </Row>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            
            <div className="expense-chart-container">
              {isLoading ? (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
              ) : processedExpensesData.length > 0 ? (
                <ExpensesBreakdownChart data={processedExpensesData} loading={isLoading} />
              ) : (
                <Empty description="Ma'lumot topilmadi" />
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title="Xarajatlar tahlili" 
            className="dashboard-card expense-analysis-card" 
            loading={isLoading} 
            variant="borderless"
          >
            {processedExpensesData.length > 0 ? (
              <>
                <div className="expense-metric">
                  <div className="metric-label">
                    <div className="metric-indicator" style={{ backgroundColor: '#cf1322' }}></div>
                    Oylik xarajatlar
                  </div>
                  <div className="metric-value">
                    ${formatCurrency(calculatedTotalExpenses)}
                  </div>
                </div>
                
                <div className="expense-breakdown">
                  <div className="breakdown-title">Xarajatlar kategoriyalari</div>
                  {processedExpensesData
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => (
                      <div className="breakdown-item" key={index}>
                        <div className="breakdown-info">
                          <div className="breakdown-name">
                            <span className="breakdown-indicator" style={{ backgroundColor: item.color }}></span>
                            {item.name}
                          </div>
                          <div className="breakdown-value">${formatCurrency(item.value)}</div>
                        </div>
                        <div className="breakdown-bar-container">
                          <div 
                            className="breakdown-bar" 
                            style={{ 
                              width: `${Math.round((item.value / calculatedTotalExpenses) * 100)}%`,
                              backgroundColor: item.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <Empty description="Ma'lumot topilmadi" />
            )}
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }
        
        .expense-breakdown {
          margin-top: 20px;
        }
        
        .breakdown-title {
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .breakdown-item {
          margin-bottom: 16px;
        }
        
        .breakdown-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .breakdown-name {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
        
        .breakdown-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .breakdown-value {
          font-weight: 500;
        }
        
        .breakdown-bar-container {
          height: 6px;
          background-color: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .breakdown-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default ExpensesBreakdownSection; 