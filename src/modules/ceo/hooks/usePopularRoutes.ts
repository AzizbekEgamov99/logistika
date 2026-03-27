import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

export interface PopularRoute {
  from_location: string;
  to_location: string;
  rays_count: number;
  total_price: number;
}

export const usePopularRoutes = () => {
  const [data, setData] = useState<PopularRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/rayshistory/locations/');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  return { data, loading, error };
}; 