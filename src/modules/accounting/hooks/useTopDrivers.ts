import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface TopDriver {
  id: number;
  username: string;
  fullname: string;
  phone_number: string;
  photo: string | null;
  is_busy: boolean;
  rays_count: number;
  status: string;
  total_rays_usd: number;
  date?: string;
}

export const useTopDrivers = () => {
  return useQuery<TopDriver[]>({
    queryKey: ['topDrivers'],
    queryFn: async () => {
      const response = await axiosInstance.get('/customusers/top-drivers/');
      return response.data;
    }
  });
};
