import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { useCEODrivers } from './useCEODrivers';
import { useCEOCars } from './useCEOCars';
import { useCEOClients } from './useCEOClients';
import { useCEOTrips } from './useCEOTrips';

interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  revenue30Days: number;
  expenses30Days: number;
  profit30Days: number;
}

export const useDashboardData = () => {
  // Use our newly updated hooks with real backend data
  const { drivers, total: totalDrivers, activeDriversCount, loading: driversLoading } = useCEODrivers();
  const { cars, total: totalCars, activeCarsCount, loading: carsLoading } = useCEOCars();
  const { clients, total: totalClients, loading: clientsLoading } = useCEOClients();
  const { 
    trips, 
    total: totalTrips, 
    activeTripsCount,
    completedTripsCount,
    loading: tripsLoading 
  } = useCEOTrips();

  // Fetch financial data from the backend
  const { data: financialData, isLoading: financialLoading } = useQuery({
    queryKey: ['dashboard-financial'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/dashboard/financial/');
        return response.data;
      } catch (error) {
        console.error('Error fetching financial data:', error);
        return {
          totalRevenue: 0,
          totalExpenses: 0,
          profit: 0,
          revenue30Days: 0,
          expenses30Days: 0,
          profit30Days: 0
        } as DashboardMetrics;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Summary metrics for the dashboard
  const summaryMetrics = {
    totalDrivers,
    activeDrivers: activeDriversCount,
    totalCars,
    activeCars: activeCarsCount,
    totalClients,
    totalTrips,
    activeTrips: activeTripsCount,
    completedTrips: completedTripsCount,
    totalRevenue: financialData?.totalRevenue || 0,
    totalExpenses: financialData?.totalExpenses || 0,
    profit: financialData?.profit || 0,
    revenue30Days: financialData?.revenue30Days || 0,
    expenses30Days: financialData?.expenses30Days || 0,
    profit30Days: financialData?.profit30Days || 0
  };

  // Completion rate
  const tripCompletionRate = totalTrips > 0 ? (completedTripsCount / totalTrips) * 100 : 0;

  // Revenue and expense trends (simulated - can be replaced with actual API data)
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/dashboard/charts/');
        return response.data;
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Return fallback data if API call fails
        return {
          revenueData: Array(12).fill(0).map((_, i) => ({ month: i + 1, value: 0 })),
          expenseData: Array(12).fill(0).map((_, i) => ({ month: i + 1, value: 0 })),
          profitData: Array(12).fill(0).map((_, i) => ({ month: i + 1, value: 0 }))
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    drivers,
    cars, 
    clients,
    trips,
    summaryMetrics,
    tripCompletionRate,
    chartData: chartData || {
      revenueData: [],
      expenseData: [],
      profitData: []
    },
    loading: driversLoading || carsLoading || clientsLoading || tripsLoading || financialLoading || chartLoading
  };
}; 