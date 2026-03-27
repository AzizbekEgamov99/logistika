import React from 'react';
import { Pie } from '@ant-design/charts';
import { Empty } from 'antd';

interface BreakdownData {
  driverExpenses: number;
  dispatcherExpenses: number;
  fuelCosts: number;
  maintenanceCosts: number;
  otherExpenses: number;
}

interface ExpensesBreakdownProps {
  breakdown: BreakdownData;
}

export const ExpensesBreakdown: React.FC<ExpensesBreakdownProps> = ({ 
  breakdown 
}) => {
  const { driverExpenses, dispatcherExpenses, fuelCosts, maintenanceCosts, otherExpenses } = breakdown;
  
  const totalExpenses = driverExpenses + dispatcherExpenses + fuelCosts + maintenanceCosts + otherExpenses;
  
  // If no data, show empty placeholder
  if (totalExpenses === 0) {
    return <Empty description="Ma'lumot mavjud emas" />;
  }
  
  // Format data for pie chart
  const data = [
    { type: 'Haydovchi', value: driverExpenses },
    { type: 'Dispetcher', value: dispatcherExpenses },
    { type: 'Yoqilg\'i', value: fuelCosts },
    { type: 'Xizmat ko\'rsatish', value: maintenanceCosts },
    { type: 'Boshqa', value: otherExpenses },
  ].filter(item => item.value > 0); // Only include non-zero values
  
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `${(datum.value/1000000).toFixed(1)} mln $` };
      },
    },
  };
  
  return <Pie {...config} />;
}; 