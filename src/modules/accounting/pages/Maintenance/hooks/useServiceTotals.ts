import { useState, useEffect } from 'react';
import { fetchServiceTotals, ServiceTotals, DateRange } from '../api/serviceTotals';
import dayjs from 'dayjs';

interface UseServiceTotalsResult {
  totals: ServiceTotals | null;
  isLoading: boolean;
  isError: boolean;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  refetch: () => Promise<void>;
}

export const useServiceTotals = (): UseServiceTotalsResult => {
  const [totals, setTotals] = useState<ServiceTotals | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await fetchServiceTotals(dateRange || undefined);
      setTotals(data);
    } catch (error) {
      setIsError(true);
      console.error('Error in useServiceTotals hook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return {
    totals,
    isLoading,
    isError,
    dateRange,
    setDateRange,
    refetch: fetchData
  };
}; 