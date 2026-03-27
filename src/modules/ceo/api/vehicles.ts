import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { getAllCars, createCar, updateCar, deleteCar, getCarDetails } from '../../accounting/api/cars/carsApi';
import { getFurgons, createFurgon, updateFurgon, deleteFurgon, getFurgon, getFurgonStatusSummary } from '../../accounting/api/furgon/furgonapi';

// Simple notification utilities
const showSuccess = (msg: string) => message.success(msg);
const showError = (msg: string) => message.error(msg);

// Types - based on actual backend fields from accounting module
export interface Vehicle {
  id: string | number;
  name: string;
  number: string;
  photo?: string | File | null;
}

export interface Car extends Vehicle {
  year: string;
  engine: string;
  transmission: string;
  power: string;
  capacity: string;
  fuel: string;
  mileage: string;
  holat: 'foal' | 'tamirda' | 'kutmoqda';
  car_number: string;
  driver: number;
  kilometer: number;
  is_busy?: boolean;
}

export interface Furgon extends Vehicle {
  kilometer?: number;
  status?: string;
  description?: string;
  is_busy: boolean;
}

// Enhanced CEO Car hooks that leverage the accounting module functionality
export const useCEOCars = () => {
  return useQuery({
    queryKey: ['ceo', 'cars'],
    queryFn: async () => {
      const carsResponse = await getAllCars();
      return Array.isArray(carsResponse) ? carsResponse : (carsResponse.results || []);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCEOCarDetails = (id: number | undefined) => {
  return useQuery({
    queryKey: ['ceo', 'car', id],
    queryFn: async () => {
      if (!id) return null;
      return await getCarDetails(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddCEOCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating new car with data:', data);
      return createCar(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo', 'cars'] });
      queryClient.invalidateQueries({ queryKey: ['ceo', 'vehicle-statistics'] });
      showSuccess('Avtomobil muvaffaqiyatli qo\'shildi');
    },
    onError: (error: any) => {
      console.error('Error adding car:', error);
      showError('Avtomobilni qo\'shishda xatolik: ' + (error.response?.data?.message || error.message));
    }
  });
};

export const useUpdateCEOCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
      console.log(`Updating car ${id} with data:`, data);
      return updateCar(Number(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo', 'cars'] });
      queryClient.invalidateQueries({ queryKey: ['ceo', 'vehicle-statistics'] });
      showSuccess('Avtomobil muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      console.error('Error updating car:', error);
      showError('Avtomobilni yangilashda xatolik: ' + (error.response?.data?.message || error.message));
    }
  });
};

export const useDeleteCEOCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      console.log(`Deleting car with ID: ${id}`);
      return deleteCar(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo', 'cars'] });
      queryClient.invalidateQueries({ queryKey: ['ceo', 'vehicle-statistics'] });
      showSuccess('Avtomobil muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      console.error('Error deleting car:', error);
      showError('Avtomobilni o\'chirishda xatolik: ' + (error.response?.data?.message || error.message));
    }
  });
};

// Enhanced CEO Furgon hooks that leverage the accounting module functionality
export const useCEOFurgons = () => {
  return useQuery({
    queryKey: ['ceo', 'furgons'],
    queryFn: async () => {
      return getFurgons();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCEOFurgonDetails = (id: number | undefined) => {
  return useQuery({
    queryKey: ['ceo', 'furgon', id],
    queryFn: async () => {
      if (!id) return null;
      return await getFurgon(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCEOFurgonStatusSummary = () => {
  return useQuery({
    queryKey: ['ceo', 'furgons', 'status-summary'],
    queryFn: async () => {
      return getFurgonStatusSummary();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddCEOFurgon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Add all relevant fields to FormData
      if (data.name) formData.append('name', data.name);
      if (data.number) formData.append('number', data.number);
      if (data.kilometer) formData.append('kilometer', data.kilometer.toString());
      if (data.description) formData.append('description', data.description);
      if (data.is_busy !== undefined) formData.append('is_busy', data.is_busy.toString());
      if (data.status) formData.append('status', data.status);
      
      if (data.photo instanceof File) {
        formData.append('photo', data.photo);
      }
      
      console.log('Creating new furgon with data:', Object.fromEntries(formData));
      return createFurgon(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo', 'furgons'] });
      queryClient.invalidateQueries({ queryKey: ['ceo', 'vehicle-statistics'] });
      showSuccess('Furgon muvaffaqiyatli qo\'shildi');
    },
    onError: (error: any) => {
      console.error('Error adding furgon:', error);
      showError('Furgonni qo\'shishda xatolik: ' + (error.response?.data?.message || error.message));
    }
  });
};

export const useUpdateCEOFurgon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
      const formData = new FormData();
      
      // Add all relevant fields to FormData
      if (data.name) formData.append('name', data.name);
      if (data.number) formData.append('number', data.number);
      if (data.kilometer) formData.append('kilometer', data.kilometer.toString());
      if (data.description) formData.append('description', data.description);
      if (data.is_busy !== undefined) formData.append('is_busy', data.is_busy.toString());
      if (data.status) formData.append('status', data.status);
      
      if (data.photo instanceof File) {
        formData.append('photo', data.photo);
      }
      
      console.log(`Updating furgon ${id} with data:`, Object.fromEntries(formData));
      return updateFurgon(Number(id), formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo', 'furgons'] });
      queryClient.invalidateQueries({ queryKey: ['ceo', 'vehicle-statistics'] });
      showSuccess('Furgon muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      console.error('Error updating furgon:', error);
      showError('Furgonni yangilashda xatolik: ' + (error.response?.data?.message || error.message));
    }
  });
};

export const useDeleteCEOFurgon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      console.log(`Deleting furgon with ID: ${id}`);
      return deleteFurgon(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceo', 'furgons'] });
      queryClient.invalidateQueries({ queryKey: ['ceo', 'vehicle-statistics'] });
      showSuccess('Furgon muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      console.error('Error deleting furgon:', error);
      
      // Display a more specific error message if available
      if (error.message && error.message.includes('bog\'langan')) {
        showError(error.message);
      } else if (error.response?.data?.detail) {
        showError(error.response.data.detail);
      } else if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else if (error.response?.data) {
        // Try to extract error message from the response data
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          showError(errorData);
        } else if (typeof errorData === 'object') {
          const errorMessage = Object.values(errorData)
            .flat()
            .join(', ');
          showError(`Furgonni o\'chirishda xatolik: ${errorMessage}`);
        } else {
          showError('Furgonni o\'chirishda noma\'lum xatolik yuz berdi.');
        }
      } else {
        showError('Furgonni o\'chirishda xatolik: ' + error.message);
      }
    }
  });
};

// Additional CEO-specific vehicle utilities
export const useCEOVehicleStatistics = () => {
  return useQuery({
    queryKey: ['ceo', 'vehicle-statistics'],
    queryFn: async () => {
      try {
        const [cars, furgons] = await Promise.all([
          getAllCars(),
          getFurgons()
        ]);
        
        const carData = Array.isArray(cars) ? cars : (cars.results || []);
        const furgonData = furgons || [];
        
        // Use actual status fields from the backend
        const activeCars = carData.filter(car => car.holat === 'foal');
        const inactiveCars = carData.filter(car => car.holat === 'tamirda');
        const availableCars = carData.filter(car => car.holat === 'kutmoqda');
        
        // For furgons, use the is_busy field
        const activeFurgons = furgonData.filter(furgon => furgon.is_busy === true);
        const availableFurgons = furgonData.filter(furgon => furgon.is_busy === false);
        
        return {
          totalVehicles: carData.length + furgonData.length,
          cars: {
            total: carData.length,
            active: activeCars.length,
            inactive: inactiveCars.length,
            available: availableCars.length
          },
          furgons: {
            total: furgonData.length,
            active: activeFurgons.length,
            available: availableFurgons.length
          },
          fleetUtilization: {
            active: ((activeCars.length + activeFurgons.length) / (carData.length + furgonData.length || 1)) * 100,
            inactive: inactiveCars.length / (carData.length || 1) * 100,
            available: ((availableCars.length + availableFurgons.length) / (carData.length + furgonData.length || 1)) * 100
          }
        };
      } catch (error) {
        console.error('Error fetching vehicle statistics:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}; 