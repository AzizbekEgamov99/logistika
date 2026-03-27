import React from 'react';
import { Pie } from '@ant-design/charts';
import { Card, Typography, Empty } from 'antd';

const { Title } = Typography;

interface ExpenseCategory {
  category: string;
  amount: number;
  color?: string;
}

interface ExpensesByCategoryProps {
  expenses: ExpenseCategory[];
  isLoading: boolean;
}

export const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = ({
  expenses,
  isLoading
}) => {
  // Format to millions for easier reading
  const formatToMillions = (value: number) => {
    return `${(value / 1000000).toFixed(1)} mln`;
  };

  const config = {
    appendPadding: 10,
    data: expenses,
    angleField: 'amount',
    colorField: 'category',
    radius: 0.8,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: '-30%',
      formatter: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    statistic: {
      title: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Jami',
      },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: formatToMillions(expenses.reduce((acc, curr) => acc + curr.amount, 0)),
      },
    },
    tooltip: {
      formatter: (datum: ExpenseCategory) => {
        return { name: datum.category, value: formatToMillions(datum.amount) + ' so\'m' };
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'bottom'
    },
    loading: isLoading,
  };

  return (
    <Card>
      <Title level={4}>Xarajatlar kategoriyasi</Title>
      {expenses.length === 0 ? (
        <Empty
          description="Ma'lumot topilmadi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Pie {...config} />
      )}
    </Card>
  );
}; 