import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../api/finance/financeApi';

export interface ExpenseTotals {
  texnic: any[];
  totals: {
    texnic: number;
    balon: number;
    balonfurgon: number;
    chiqimlik: number;
    optol: number;
    driversalary: number;
    total: number;
  };
}

export const useExpenseTotals = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['expense-totals'],
    queryFn: financeApi.getExpenseTotals,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}; 