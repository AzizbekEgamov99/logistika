import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../../api/axiosInstance';

export const useVehicleHistory = (id: string, vehicleType: 'car' | 'furgon') => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch vehicle data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        // Use different endpoints for car and furgon history
        if (vehicleType === 'furgon') {
          response = await axiosInstance.get(`/history/${id}/furgon-history/`);
        } else {
          response = await axiosInstance.get(`/history/${id}/car-history/`);
        }
        
        setData(response.data);
      } catch (err) {
        console.error('Error fetching vehicle history:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, vehicleType]);

  // Memoize processed data to avoid recalculations
  const processedData = useMemo(() => {
    if (!data) return null;

    // Destructure data with the correct property names
    const { 
      car, 
      furgon,
      optol = [], 
      bolon = [], 
      texnic = [],
      total_usd = 0,
      details_expense_usd = { optol: 0, bolon: 0, texnic: 0 },
      rays_history = [],
      rays_count = 0
    } = data;
    
    // Get the vehicle object based on type
    const vehicle = vehicleType === 'furgon' ? furgon : car;

    return {
      vehicle,
      optol,
      bolon,
      texnic,
      total_usd,
      details_expense_usd,
      rays_history,
      rays_count
    };
  }, [data, vehicleType]);

  return {
    data: processedData,
    loading,
    error
  };
}; 