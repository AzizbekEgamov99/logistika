import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../../../api/axiosInstance';
import { TripStatisticsData } from '../types';

interface ApiTrip {
  id: number;
  country_name?: string;
  dp_currency_name?: string;
  expenses?: {
    texnics: any[];
    balons: any[];
    balon_furgons: any[];
    optols: any[];
    chiqimliks: any[];
    arizalar: any[];
    referenslar: any[];
    total_usd: number;
  };
  price: number; // USD
  dr_price: number; // USD
  dp_price: number; // local currency (UZS, etc.)
  dp_information?: string;
  kilometer: number;
  count: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  dp_currency: number;
  country: number;
  car: {
    name: string;
    number: string;
  };
  fourgon?: {
    name: string;
    number: string;
  };
  client: Array<{
    id: number;
    first_name: string;
    last_name: string;
    number: string;
    products: any[];
  }>;
  driver: {
    id: number;
    fullname: string;
    phone_number: string;
  };
  client_completed: any[];
  // Optional fields from other API endpoints
  from1?: string;
  to_go?: string;
  end_date?: string;
}

export const useTripData = () => {
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<ApiTrip[]>([]);
  const [displayTrips, setDisplayTrips] = useState<ApiTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statistics state
  const [statistics, setStatistics] = useState<TripStatisticsData>({
    totalTrips: 0,
    totalRevenue: 0,
    totalExpense: 0,
    totalProfit: 0,
    avgDistance: 0,
  });

  // Fetch trips data from API
  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trips
      const tripsResponse = await axiosInstance.get('/rays/');
      const tripsData: ApiTrip[] = tripsResponse.data.results || [];
      setTrips(tripsData);
      setFilteredTrips(tripsData);
      setDisplayTrips(tripsData.slice(0, 10)); // Initial display

      // Fetch statistics
      const statsResponse = await axiosInstance.get('/rayshistory/rayshistory-overview/');
      const locationResponse = await axiosInstance.get('/rayshistory/locations/');

      // Process statistics data
      setStatistics({
        totalTrips: statsResponse.data.rays_count || 0,
        totalRevenue: statsResponse.data.rays_price || 0, // This is in USD
        totalExpense: 0, // We'll calculate this from trips
        totalProfit: statsResponse.data.rays_total_price || 0, // Need to check currency
        avgDistance: statsResponse.data.rays_kilometr
          ? statsResponse.data.rays_kilometr / (statsResponse.data.rays_count || 1)
          : 0,
      });

      // Calculate expenses from trips data
      const totalExpenses = tripsData.reduce((sum, trip) => {
        // Add USD expenses
        const tripExpenses = trip.expenses?.total_usd || 0;
        return sum + tripExpenses;
      }, 0);

      setStatistics(prev => ({
        ...prev,
        totalExpense: totalExpenses,
      }));

    } catch (err) {
      console.error('Error fetching trip data:', err);
      setError('Reys ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters and pagination
  const updateDisplayTrips = useCallback((filtered: ApiTrip[], page: number, pageSize: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayTrips(filtered.slice(startIndex, endIndex));
  }, []);

  // Initial load
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    filteredTrips,
    displayTrips,
    loading,
    error,
    statistics,
    fetchTrips,
    updateDisplayTrips,
  };
}; 