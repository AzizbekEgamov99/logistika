import { useState } from 'react';
import { 
  useCEOCars, 
  useCEOFurgons, 
  useAddCEOCar, 
  useUpdateCEOCar, 
  useDeleteCEOCar,
  useAddCEOFurgon,
  useUpdateCEOFurgon,
  useDeleteCEOFurgon,
  useCEOVehicleStatistics,
  Car,
  Furgon
} from '../api/vehicles';

// Common interface for both vehicle types
export interface VehicleItem {
  id: number | string;
  key: string;
  name: string;
  number: string;
  type: 'car' | 'furgon';
  photo?: string | null;
  status: 'active' | 'inactive' | 'available';
  originalData: Car | Furgon; // Store the original data for reference
}

// Map vehicle status to consistent values for the UI
const mapCarStatus = (status?: string): 'active' | 'inactive' | 'available' => {
  switch(status) {
    case 'foal': return 'active';
    case 'tamirda': return 'inactive';
    case 'kutmoqda': return 'available';
    default: return 'available';
  }
};

const mapFurgonStatus = (isBusy?: boolean): 'active' | 'available' => {
  return isBusy ? 'active' : 'available';
};

// Custom hook for managing CEO cars
export const useCEOCarsHook = () => {
  const { data: cars = [], isLoading: isLoadingCars, error: carsError } = useCEOCars();
  const addCarMutation = useAddCEOCar();
  const updateCarMutation = useUpdateCEOCar();
  const deleteCarMutation = useDeleteCEOCar();
  
  // Format cars for display
  const formattedCars: VehicleItem[] = cars.map((car: Car) => ({
    id: car.id,
    key: `car-${car.id}`,
    name: car.name,
    number: car.number || car.car_number || '',
    type: 'car',
    photo: car.photo,
    status: mapCarStatus(car.holat),
    originalData: car
  }));
  
  // Filtered cars based on status
  const activeCars = formattedCars.filter(car => car.status === 'active');
  const inactiveCars = formattedCars.filter(car => car.status === 'inactive');
  const availableCars = formattedCars.filter(car => car.status === 'available');
  
  return {
    cars: formattedCars,
    activeCars,
    inactiveCars,
    availableCars,
    isLoadingCars,
    carsError,
    addCar: addCarMutation.mutate,
    updateCar: updateCarMutation.mutate,
    deleteCar: deleteCarMutation.mutate,
    isAddingCar: addCarMutation.isPending,
    isUpdatingCar: updateCarMutation.isPending,
    isDeletingCar: deleteCarMutation.isPending
  };
};

// Custom hook for managing CEO furgons
export const useCEOFurgonsHook = () => {
  const { data: furgons = [], isLoading: isLoadingFurgons, error: furgonsError } = useCEOFurgons();
  const addFurgonMutation = useAddCEOFurgon();
  const updateFurgonMutation = useUpdateCEOFurgon();
  const deleteFurgonMutation = useDeleteCEOFurgon();
  
  // Format furgons for display
  const formattedFurgons: VehicleItem[] = furgons.map((furgon: Furgon) => ({
    id: furgon.id,
    key: `furgon-${furgon.id}`,
    name: furgon.name,
    number: furgon.number || '',
    type: 'furgon',
    photo: furgon.photo,
    status: mapFurgonStatus(furgon.is_busy),
    originalData: furgon
  }));
  
  // Filtered furgons based on status
  const activeFurgons = formattedFurgons.filter(furgon => furgon.status === 'active');
  const availableFurgons = formattedFurgons.filter(furgon => furgon.status === 'available');
  
  return {
    furgons: formattedFurgons,
    activeFurgons,
    availableFurgons,
    isLoadingFurgons,
    furgonsError,
    addFurgon: addFurgonMutation.mutate,
    updateFurgon: updateFurgonMutation.mutate,
    deleteFurgon: deleteFurgonMutation.mutate,
    isAddingFurgon: addFurgonMutation.isPending,
    isUpdatingFurgon: updateFurgonMutation.isPending,
    isDeletingFurgon: deleteFurgonMutation.isPending
  };
};

// Combined hook for managing all vehicles
export const useAllVehicles = () => {
  const { 
    cars, activeCars, inactiveCars, availableCars,
    isLoadingCars, carsError, addCar, updateCar, deleteCar,
    isAddingCar, isUpdatingCar, isDeletingCar
  } = useCEOCarsHook();
  
  const {
    furgons, activeFurgons, availableFurgons,
    isLoadingFurgons, furgonsError, addFurgon, updateFurgon, deleteFurgon,
    isAddingFurgon, isUpdatingFurgon, isDeletingFurgon
  } = useCEOFurgonsHook();
  
  const { data: statistics, isLoading: isLoadingStatistics } = useCEOVehicleStatistics();
  
  // State for filtered vehicles
  const [selectedVehicleType, setSelectedVehicleType] = useState<'all' | 'car' | 'furgon'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'available'>('all');
  
  // Combine all vehicles
  const allVehicles: VehicleItem[] = [...cars, ...furgons];
  
  // Filter vehicles based on selected type and status
  const filteredVehicles = allVehicles.filter(vehicle => {
    const typeMatch = selectedVehicleType === 'all' || vehicle.type === selectedVehicleType;
    const statusMatch = selectedStatus === 'all' || vehicle.status === selectedStatus;
    return typeMatch && statusMatch;
  });
  
  // Utility function to prepare car data for form submission
  const prepareCarFormData = (data: any) => {
    // Handle both direct data and FormData inputs
    if (data instanceof FormData) {
      return data;
    }
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      if (key === 'photo' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });
    
    return formData;
  };
  
  // Function to add a new vehicle
  const addVehicle = (data: any) => {
    if (data.type === 'car') {
      addCar(prepareCarFormData(data));
    } else {
      addFurgon(data);
    }
  };
  
  // Function to update a vehicle
  const updateVehicle = (data: any) => {
    if (data.type === 'car') {
      updateCar({ id: data.id, data: prepareCarFormData(data) });
    } else {
      updateFurgon({ id: data.id, data });
    }
  };
  
  // Function to delete a vehicle
  const deleteVehicle = (vehicle: any) => {
    if (vehicle.type === 'car') {
      deleteCar(vehicle.id);
    } else {
      deleteFurgon(vehicle.id);
    }
  };
  
  return {
    // All vehicles data
    allVehicles,
    filteredVehicles,
    cars,
    furgons,
    
    // Status-filtered lists
    activeCars,
    inactiveCars,
    availableCars,
    activeFurgons,
    availableFurgons,
    
    // Loading states
    isLoading: isLoadingCars || isLoadingFurgons,
    isLoadingStatistics,
    carsError,
    furgonsError,
    
    // Statistics
    statistics,
    
    // Filter controls
    selectedVehicleType,
    setSelectedVehicleType,
    selectedStatus,
    setSelectedStatus,
    
    // CRUD operations
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Operation states
    isAdding: isAddingCar || isAddingFurgon,
    isUpdating: isUpdatingCar || isUpdatingFurgon,
    isDeleting: isDeletingCar || isDeletingFurgon
  };
}; 