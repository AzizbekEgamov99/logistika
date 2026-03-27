import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

// Interface for the trip overview data
export interface TripOverviewData {
  rays_count: number;
  rays_kilometr: number;
  rays_price: number;
  rays_total_price: number;
}

// Function to fetch trip overview data
const fetchTripOverview = async (): Promise<TripOverviewData> => {
  try {
    const response = await axiosInstance.get('/rayshistory/rayshistory-overview/');
    return response.data;
  } catch (error) {
    console.error('Error fetching trip overview:', error);
    // Return default values if API fails
    return {
      rays_count: 0,
      rays_kilometr: 0,
      rays_price: 0,
      rays_total_price: 0
    };
  }
};

// Hook to get trip overview data
export const useTripsOverview = () => {
  return useQuery<TripOverviewData, Error>({
    queryKey: ['trips-overview'],
    queryFn: fetchTripOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
}; 