import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { message } from 'antd';
import { TripData } from './useTrips';

// Function to fetch trip history
const fetchTripHistory = async (): Promise<TripData[]> => {
  try {
    const response = await axiosInstance.get('/rayshistory/');
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching trip history:', error);
    throw error;
  }
};

// Hook to get trip history
export const useHistoryTrips = () => {
  return useQuery<TripData[], Error>({
    queryKey: ['history-trips'],
    queryFn: fetchTripHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Function to reactivate a trip from history
const reactivateTrip = async (id: number): Promise<TripData> => {
  const response = await axiosInstance.post(`/return-complate-race/${id}/`);
  return response.data;
};

// Hook for reactivating trips from history
export const useReactivateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TripData, Error, number>({
    mutationFn: reactivateTrip,
    onSuccess: () => {
      message.success('Reys muvaffaqiyatli faollashtirildi');
      queryClient.invalidateQueries({ queryKey: ['active-trips'] });
      queryClient.invalidateQueries({ queryKey: ['history-trips'] });
    },
    onError: (error) => {
      message.error('Reysni faollashtirishda xatolik yuz berdi');
      console.error('Failed to reactivate trip:', error);
    }
  });
}; 