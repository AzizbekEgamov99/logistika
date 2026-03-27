import { useState, useCallback } from 'react';
import { message } from 'antd';
import axiosInstance from '@/api/axiosInstance';
import { TripData } from '../types';

export const useTripData = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripData[]>([]);
  const [displayTrips, setDisplayTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalTrips: 0,
    totalRevenue: 0,
    totalExpense: 0,
    totalProfit: 0,
    avgDistance: 0,
  });

  // Process trips data
  const processTripsData = (apiTrips: any[]) => {
    const formattedTrips: TripData[] = apiTrips.map((trip, index) => ({
      id: trip.id || 1000 + index,
      driverName: trip.driver?.fullname || 'Unknown Driver',
      driverId: trip.driver?.id || 0,
      clientName: trip.client && trip.client.length > 0 
        ? trip.client[0]?.first_name 
        : 'Mijoz kiritilmagan',
      clientId: trip.client && trip.client.length > 0 ? trip.client[0]?.id : 0,
      vehicleId: trip.car?.id || 0,
      vehicleNumber: trip.car ? `${trip.car.name} (${trip.car.number})` : 'Unknown',
      vehicleType: trip.fourgon ? 'Furgon' : 'Truck',
      startLocation: trip.from1 || 'Unknown',
      endLocation: trip.to_go || 'Unknown',
      startDate: trip.created_at ? new Date(trip.created_at) : new Date(),
      endDate: trip.end_date ? new Date(trip.end_date) : null,
      distance: trip.kilometer || 0,
      price: trip.price || 0,
      expense: (trip.dr_price || 0) + (trip.dp_price || 0),
      profit: (trip.price || 0) - (trip.dr_price || 0) - (trip.dp_price || 0),
      status: trip.is_completed ? 'completed' : 'in_progress',
      cargo: trip.cargo_name || 'Unknown Cargo',
      cargoWeight: trip.cargo_weight || 0,
      notes: trip.notes || null,
      country: trip.country?.name || '',
      rawData: trip  // Store the original data for details view
    }));
    
    setTrips(formattedTrips);
    setFilteredTrips(formattedTrips);
    updateDisplayTrips(formattedTrips, 1, 10); // Default pageSize is 10
    calculateStatistics(formattedTrips);
  };

  // Fetch trips directly from API
  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/rayshistory/');
      
      if (response.data && Array.isArray(response.data)) {
        processTripsData(response.data);
      } 
      else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        processTripsData(response.data.results);
      }
      else {
        console.error('Server xato javob qaytardi:', response.data);
        setTrips([]);
        message.error('Server ma\'lumotlari noto\'g\'ri formatda');
      }
    } catch (err) {
      console.error('Reyslarni yuklashda xatolik:', err);
      message.error('Reyslarni yuklashda xatolik yuz berdi');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update the displayed trips based on pagination
  const updateDisplayTrips = useCallback((tripsData: TripData[], page: number, size: number) => {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    setDisplayTrips(tripsData.slice(startIndex, endIndex));
  }, []);

  // Calculate statistics from trips data
  const calculateStatistics = useCallback((tripsData: TripData[]) => {
    if (tripsData.length === 0) {
      setStatistics({
        totalTrips: 0,
        totalRevenue: 0,
        totalExpense: 0,
        totalProfit: 0,
        avgDistance: 0,
      });
      return;
    }

    const totalTrips = tripsData.length;
    const totalRevenue = tripsData.reduce(
      (sum, trip) => sum + trip.price,
      0
    );
    const totalExpense = tripsData.reduce(
      (sum, trip) => sum + trip.expense,
      0
    );
    const totalProfit = totalRevenue - totalExpense;
    const avgDistance = Math.round(
      tripsData.reduce((sum, trip) => sum + trip.distance, 0) / totalTrips
    );

    setStatistics({
      totalTrips,
      totalRevenue,
      totalExpense,
      totalProfit,
      avgDistance,
    });
  }, []);

  return {
    trips,
    setTrips,
    filteredTrips,
    setFilteredTrips,
    displayTrips,
    setDisplayTrips,
    loading,
    statistics,
    fetchTrips,
    updateDisplayTrips,
    calculateStatistics
  };
}; 