import React from 'react';
import { Card, Row, Col, Typography, Descriptions, Divider, Progress } from 'antd';
import { Line } from '@ant-design/charts';
import { DollarOutlined, CarOutlined, ArrowUpOutlined, PercentageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface ExpenseBreakdown {
  driverExpenses: number;
  dispatcherExpenses: number;
  fuelCosts: number;
  maintenanceCosts: number;
  otherExpenses: number;
}

interface FinanceSummaryProps {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  expenseBreakdown: ExpenseBreakdown;
  monthlyData: MonthlyData[];
}

export const FinanceSummary: React.FC<FinanceSummaryProps> = ({
  revenue,
  expenses,
  profit,
  profitMargin,
  expenseBreakdown,
  monthlyData
}) => {
  // Format currency values to millions
  const formatToMillions = (value: number) => {
    return `${(value / 1000000).toFixed(1)} mln $`;
  };
  
  // Prepare data for the trend chart
  const trendData = monthlyData.flatMap(item => [
    { month: item.month, value: item.revenue, type: 'Daromad' },
    { month: item.month, value: item.expenses, type: 'Xarajat' },
    { month: item.month, value: item.profit, type: 'Foyda' },
  ]);
  
  // Line chart configuration
  const lineConfig = {
    data: trendData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      label: {
        formatter: (v: any) => `${(Number(v) / 1000000).toFixed(1)} mln`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: formatToMillions(datum.value) };
      },
    },
  };
  
  // Calculate expense percentages
  const totalExpenses = expenses || 1; // Prevent division by zero
  const driverPercent = (expenseBreakdown.driverExpenses / totalExpenses) * 100;
  const dispatcherPercent = (expenseBreakdown.dispatcherExpenses / totalExpenses) * 100;
  const fuelPercent = (expenseBreakdown.fuelCosts / totalExpenses) * 100;
  const maintenancePercent = (expenseBreakdown.maintenanceCosts / totalExpenses) * 100;
  const otherPercent = (expenseBreakdown.otherExpenses / totalExpenses) * 100;
  
  return (
    <div className="finance-summary">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Moliyaviy ko'rsatkichlar">
            <Descriptions layout="vertical" bordered column={1}>
              <Descriptions.Item label="Jami daromad">
                <Text strong>{formatToMillions(revenue)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Jami xarajatlar">
                <Text strong>{formatToMillions(expenses)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Sof foyda">
                <Text strong style={{ color: profit >= 0 ? '#3f8600' : '#cf1322' }}>
                  {formatToMillions(profit)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="foyda">
                <Text strong style={{ color: profitMargin >= 0 ? '#3f8600' : '#cf1322' }}>
                  {Math.round(profitMargin)}%
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Xarajatlar taqsimoti">
            <div className="expense-breakdowns">
              <div className="expense-item">
                <div className="expense-header">
                  <span>Haydovchilar</span>
                  <Text type="secondary">{formatToMillions(expenseBreakdown.driverExpenses)}</Text>
                </div>
                <Progress percent={Math.round(driverPercent)} status="active" showInfo={false} />
                <Text type="secondary">{Math.round(driverPercent)}%</Text>
              </div>
              
              <div className="expense-item">
                <div className="expense-header">
                  <span>Dispetcherlar</span>
                  <Text type="secondary">{formatToMillions(expenseBreakdown.dispatcherExpenses)}</Text>
                </div>
                <Progress percent={Math.round(dispatcherPercent)} status="active" showInfo={false} />
                <Text type="secondary">{Math.round(dispatcherPercent)}%</Text>
              </div>
              
              <div className="expense-item">
                <div className="expense-header">
                  <span>Yoqilg'i</span>
                  <Text type="secondary">{formatToMillions(expenseBreakdown.fuelCosts)}</Text>
                </div>
                <Progress percent={Math.round(fuelPercent)} status="active" showInfo={false} />
                <Text type="secondary">{Math.round(fuelPercent)}%</Text>
              </div>
              
              <div className="expense-item">
                <div className="expense-header">
                  <span>Xizmat ko'rsatish</span>
                  <Text type="secondary">{formatToMillions(expenseBreakdown.maintenanceCosts)}</Text>
                </div>
                <Progress percent={Math.round(maintenancePercent)} status="active" showInfo={false} />
                <Text type="secondary">{Math.round(maintenancePercent)}%</Text>
              </div>
              
              <div className="expense-item">
                <div className="expense-header">
                  <span>Boshqa xarajatlar</span>
                  <Text type="secondary">{formatToMillions(expenseBreakdown.otherExpenses)}</Text>
                </div>
                <Progress percent={Math.round(otherPercent)} status="active" showInfo={false} />
                <Text type="secondary">{Math.round(otherPercent)}%</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Card title="Daromad va xarajatlar dinamikasi" style={{ marginTop: 16 }}>
        <div style={{ height: 400 }}>
          <Line {...lineConfig} />
        </div>
      </Card>
    </div>
  );
}; 