import React, { useMemo } from 'react';
import { Empty, Spin } from 'antd';
import { Line } from '@ant-design/charts';
import type { Transaction } from '../../mockData';

interface CashFlowProps {
  transactions: Transaction[];
  loading?: boolean;
}

interface DailyData {
  date: string;
  value: number;
  type: string;
}

const CashFlow: React.FC<CashFlowProps> = ({ transactions, loading = false }) => {
  // Group and calculate daily data
  const data = useMemo(() => {
    if (!transactions.length) return [];
    
    // Get date range
    const dates = transactions.map(t => t.date);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Initialize daily data map
    const dailyDataMap = new Map<string, { income: number; expense: number; balance: number }>();
    
    // Fill all dates in range
    const currentDate = new Date(minDate);
    let runningBalance = 0;
    
    while (currentDate <= maxDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyDataMap.set(dateKey, { income: 0, expense: 0, balance: runningBalance });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Aggregate transaction data by date
    transactions.forEach(transaction => {
      const dateKey = transaction.date.toISOString().split('T')[0];
      const dailyData = dailyDataMap.get(dateKey) || { income: 0, expense: 0, balance: 0 };
      
      if (transaction.type === 'income') {
        dailyData.income += transaction.amount;
      } else {
        dailyData.expense += transaction.amount;
      }
      
      dailyDataMap.set(dateKey, dailyData);
    });
    
    // Calculate running balance and format for chart
    const sortedDates = Array.from(dailyDataMap.keys()).sort();
    let balance = 0;
    
    sortedDates.forEach(date => {
      const dailyData = dailyDataMap.get(date)!;
      balance += dailyData.income - dailyData.expense;
      dailyData.balance = balance;
    });
    
    // Convert to format needed for chart
    const result: DailyData[] = [];
    
    sortedDates.forEach(date => {
      const { income, expense, balance } = dailyDataMap.get(date)!;
      
      result.push(
        { date, type: 'Kirim', value: income },
        { date, type: 'Chiqim', value: expense },
        { date, type: 'Balans', value: balance }
      );
    });
    
    return result;
  }, [transactions]);
  
  // Chart configuration
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (v: string) => {
          return `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        },
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#52c41a', '#f5222d', '#1890ff'],
    lineStyle: ({ type }: { type: string }) => {
      if (type === 'Balans') {
        return {
          lineWidth: 3,
          lineDash: [0, 0],
        };
      }
      return {
        lineWidth: 2,
        lineDash: [4, 4],
      };
    },
    point: {
      size: 5,
      shape: 'circle',
      style: ({ type }: { type: string }) => {
        return {
          fillOpacity: type === 'Balans' ? 1 : 0,
        };
      },
    },
  };
  
  if (loading) {
    return <Spin />;
  }
  
  if (!data.length) {
    return <Empty description="Ma'lumot mavjud emas" />;
  }
  
  return <Line {...config} />;
};

export default CashFlow; 