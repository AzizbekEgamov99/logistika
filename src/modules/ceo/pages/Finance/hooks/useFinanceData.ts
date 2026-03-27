import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cashApi } from '../../../../accounting/api/cash/cashApi';
import { CashOverview } from '../../../../accounting/types/cash.types';

export interface DashboardStats {
  totalTrips: number;
  completedTrips: number;
  pendingTrips: number;
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  totalClients: number;
  clientsWithDebt: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  yearlyRevenue: number;
  yearlyExpenses: number;
  profitMargin: number;
}

export const useFinanceData = () => {
  // Use React Query to fetch cash overview data
  const { 
    data: cashOverview,
    isLoading: isLoadingCash, 
    error: cashError,
    refetch: refetchCash
  } = useQuery<CashOverview>({
    queryKey: ['cashOverview'],
    queryFn: cashApi.getCashOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Dashboard stats - in a real app, this would be fetched from API
  const dashboardStats: DashboardStats = {
    totalTrips: 348,
    completedTrips: 315,
    pendingTrips: 33,
    totalVehicles: 36,
    activeVehicles: 24,
    totalDrivers: 42,
    activeDrivers: 38,
    totalClients: 120,
    clientsWithDebt: 28,
    monthlyRevenue: 55000,
    monthlyExpenses: 30000,
    yearlyRevenue: 265000,
    yearlyExpenses: 179000,
    profitMargin: 32.45
  };

  // Set up last updated timestamp
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update timestamp when data is refreshed
  useEffect(() => {
    if (!isLoadingCash) {
      setLastUpdated(new Date());
    }
  }, [isLoadingCash]);

  return {
    cashOverview,
    isLoadingCash,
    cashError,
    refetchCash,
    dashboardStats,
    lastUpdated
  };
}; 