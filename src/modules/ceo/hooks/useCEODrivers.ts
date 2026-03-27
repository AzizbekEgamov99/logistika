import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { getAllDrivers, getDriver, createDriver, updateDriver, deleteDriver } from '../../accounting/api/drivers/driverApi';
import { DriverType, DriverFilter } from '../../accounting/types/driver';
import { useTrips } from '../../accounting/hooks/useTrips';
import { AxiosError } from 'axios';
import axiosInstance from '@/api/axiosInstance';

export const useCEODrivers = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DriverFilter>({
    page: 1,
    pageSize: 10,
    search: '',
    status: 'all',
    sortBy: undefined,
    sortOrder: undefined
  });

  // Use the same API as accounting module
  const { data, isLoading: isLoadingDrivers, error } = useQuery({
    queryKey: ['ceo-drivers', filters],
    queryFn: () => getAllDrivers(filters),
    staleTime: 5 * 60 * 1000,
  });

  const { data: tripsData, isLoading: isLoadingTrips } = useTrips();
  const { data: activeCarsData, isLoading: isLoadingCars } = useQuery({
    queryKey: ['active-cars'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/car-active/');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching active cars:', error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
  
  const trips = tripsData || [];
  const activeCars = activeCarsData || [];

  // Process data the same way as accounting module
  const drivers = Array.isArray(data?.results) ? data.results : [];
  const total = data?.count || 0;

  // Get drivers on road (active cars)
  const driversOnRoad = useMemo(() => {
    if (!activeCars.length) return [];
    
    // Extract driver IDs from active cars
    const driverIds = new Set(
      activeCars.map(car => 
        typeof car.driver === 'object' ? car.driver.id : car.driver
      )
    );
    
    // Return drivers that are in active cars
    return drivers.filter(driver => driverIds.has(driver.id));
  }, [drivers, activeCars]);
  
  // Get waiting drivers
  const waitingDrivers = useMemo(() => {
    if (!drivers.length) return [];
    
    // Extract driver IDs from active cars
    const driverIds = new Set(
      activeCars.map(car => 
        typeof car.driver === 'object' ? car.driver.id : car.driver
      )
    );
    
    // Return drivers that are active but not in active cars
    return drivers.filter(driver => 
      !driverIds.has(driver.id) && 
      (driver.status === 'active' || driver.status === 'driver') &&
      driver.is_active && // Make sure driver is active
      !driver.is_busy // Not busy
    );
  }, [drivers, activeCars]);

  // Get active drivers count
  const activeDrivers = drivers.filter((driver: DriverType) => 
    driver.status === 'active' || driver.status === 'driver'
  );
  const activeDriversCount = activeDrivers.length;
  
  // Get inactive drivers count
  const inactiveDriversCount = total - activeDriversCount;
  
  // Calculate active drivers percentage
  const activeDriversPercentage = total > 0 ? (activeDriversCount / total) * 100 : 0;
  
  // Calculate on-road drivers percentage
  const driversOnRoadCount = driversOnRoad.length;
  const driversOnRoadPercentage = activeDriversCount > 0 ? (driversOnRoadCount / activeDriversCount) * 100 : 0;
  
  // Calculate waiting drivers
  const waitingDriversCount = waitingDrivers.length;
  const waitingDriversPercentage = activeDriversCount > 0 ? (waitingDriversCount / activeDriversCount) * 100 : 0;

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DriverFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create driver
  const createDriverMutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo-drivers'] });
      message.success('Haydovchi muvaffaqiyatli qo\'shildi');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Haydovchi qo\'shishda xatolik yuz berdi';
      message.error(errorMessage);
    }
  });

  // Update driver
  const updateDriverMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DriverType> }) => updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo-drivers'] });
      message.success('Haydovchi muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Haydovchi yangilashda xatolik yuz berdi';
      message.error(errorMessage);
    }
  });

  // Delete driver
  const deleteDriverMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo-drivers'] });
      message.success('Haydovchi muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      // Check for our custom error messages from the API adapter
      const errorMessage = error.message || 'Haydovchi o\'chirishda xatolik yuz berdi';
      message.error(errorMessage);
    }
  });

  return {
    drivers,
    driversOnRoad,
    waitingDrivers,
    total,
    activeCars,
    isLoading: isLoadingDrivers || isLoadingTrips || isLoadingCars,
    error,
    activeDriversCount,
    inactiveDriversCount,
    activeDriversPercentage,
    driversOnRoadCount,
    driversOnRoadPercentage,
    waitingDriversCount,
    waitingDriversPercentage,
    filters,
    updateFilters,
    createDriver: createDriverMutation.mutate,
    updateDriver: (id: number, data: Partial<DriverType>) => updateDriverMutation.mutate({ id, data }),
    deleteDriver: deleteDriverMutation.mutate,
    isCreatingDriver: createDriverMutation.isPending,
    isUpdatingDriver: updateDriverMutation.isPending,
    isDeletingDriver: deleteDriverMutation.isPending
  };
};

export const useCEODriver = (id: number) => {
  return useQuery({
    queryKey: ["ceo-driver", id],
    queryFn: () => getDriver(id),
    enabled: !!id,
  });
}; 