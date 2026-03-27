import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFinancialSummary } from '../api/finance/financeApi';
import { FinancialSummary } from '../types/finance';

interface DateRange {
  dateFrom?: string;
  dateTo?: string;
}

export const useFinancialSummary = (initialDateRange?: DateRange) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange || {});
  
  const {
    data: financialSummary,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<FinancialSummary>({
    queryKey: ['financialSummary', dateRange],
    queryFn: () => getFinancialSummary(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update date range and trigger refetch
  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  // Calculate derived metrics
  const derivedMetrics = {
    profitMargin: financialSummary?.totalRevenue 
      ? (financialSummary.totalProfit / financialSummary.totalRevenue) * 100 
      : 0,
    mtdProfitMargin: financialSummary?.mtdRevenue 
      ? (financialSummary.mtdProfit / financialSummary.mtdRevenue) * 100 
      : 0,
    totalExpensesBreakdown: {
      fuel: financialSummary?.fuelExpenses || 0,
      maintenance: financialSummary?.maintenanceExpenses || 0,
      salary: financialSummary?.salaryExpenses || 0,
      other: financialSummary?.otherExpenses || 0,
    }
  };

  return {
    financialSummary: financialSummary || {
      totalRevenue: 0,
      mtdRevenue: 0,
      totalExpenses: 0,
      mtdExpenses: 0,
      totalProfit: 0,
      mtdProfit: 0,
      fuelExpenses: 0,
      maintenanceExpenses: 0,
      salaryExpenses: 0,
      otherExpenses: 0,
      revenueByMonth: [],
      expensesByCategory: []
    },
    derivedMetrics,
    isLoading,
    isError,
    error,
    updateDateRange,
    refetch
  };
}; 