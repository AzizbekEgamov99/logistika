import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { message } from 'antd';

// Trip types
export interface TripData {
  id: number;
  driver: {
    id: number;
    fullname: string;
  };
  client: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
  car: {
    id: number;
    name: string;
    number: string;
  };
  from1: string;
  to_go: string;
  created_at: string;
  end_date: string | null;
  kilometer: number;
  price: number;
  dr_price: number;
  dp_price: number;
  is_completed: boolean;
  cargo_name: string;
  cargo_weight: number;
  notes: string;
  country: {
    id: number;
    name: string;
  };
  fourgon: any;
  [key: string]: any;
}

// Function to fetch active trips
const fetchActiveTrips = async (): Promise<TripData[]> => {
  try {
    const response = await axiosInstance.get('/rays/');
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching active trips:', error);
    throw error;
  }
};

// Hook to get active trips
export const useTrips = () => {
  return useQuery<TripData[], Error>({
    queryKey: ['active-trips'],
    queryFn: fetchActiveTrips,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 1, // 1 minute
  });
};

// Function to complete a trip
const completeTrip = async (id: number): Promise<TripData> => {
  const response = await axiosInstance.post(`/complate-race/${id}/`);
  return response.data;
};

// Hook for completing trips
export const useCompleteTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TripData, Error, number>({
    mutationFn: completeTrip,
    onSuccess: () => {
      message.success('Reys muvaffaqiyatli yakunlandi');
      queryClient.invalidateQueries({ queryKey: ['active-trips'] });
      queryClient.invalidateQueries({ queryKey: ['history-trips'] });
    },
    onError: (error) => {
      message.error('Reysni yakunlashda xatolik yuz berdi');
      console.error('Failed to complete trip:', error);
    }
  });
}; 