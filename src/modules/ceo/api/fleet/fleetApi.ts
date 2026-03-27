import axiosInstance from "../../../../api/axiosInstance";
import { VehicleData, VehicleFilter } from "../../types/fleet";
import { carsApi as accountingVehicleApi, getCarDetails } from "../../../accounting/api/cars/carsApi";

export const getAllVehicles = async (params?: VehicleFilter) => {
    try {
        const response = await axiosInstance.get('/cars/', {
            params: {
                search: params?.search || undefined,
                page: params?.page || 1,
                page_size: params?.pageSize || 10,
                status: params?.status || undefined,
                type: params?.type || undefined
            }
        });
        return {
            data: response.data.results || [],
            total: response.data?.count || 0
        };
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return {
            data: [],
            total: 0
        };
    }
};

export const getVehicleById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/cars/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
    }
};

export const getVehicleStatistics = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/cars/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle statistics:', error);
        throw error;
    }
};

export const createVehicle = async (data: Partial<VehicleData>) => {
    try {
        const response = await axiosInstance.post('/cars/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
    }
};

export const updateVehicle = async (id: number, data: Partial<VehicleData>) => {
    try {
        const response = await axiosInstance.put(`/cars/${id}/`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating vehicle:', error);
        throw error;
    }
};

export const deleteVehicle = async (id: number) => {
    try {
        await axiosInstance.delete(`/cars/${id}/`);
        return true;
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
    }
};

// CEO-specific fleet statistics functionality
const getFleetStats = async (params?: { dateFrom?: string, dateTo?: string }) => {
    try {
        // Leverage existing vehicle data from accounting module
        const response = await accountingVehicleApi.getAllCars();
        const vehicles = Array.isArray(response) ? response : response.results || [];
        
        // Calculate CEO-specific stats
        return {
            totalVehicles: vehicles.length,
            activeVehicles: vehicles.filter(vehicle => vehicle.holat === 'foal').length,
            maintenanceVehicles: vehicles.filter(vehicle => vehicle.holat === 'tamirlash').length,
            utilization: calculateUtilizationRate(vehicles),
            fuelConsumption: calculateAverageFuelConsumption(vehicles),
            totalMileage: calculateTotalMileage(vehicles),
            vehiclesByType: calculateVehiclesByType(vehicles)
        };
    } catch (error) {
        console.error('Error fetching fleet stats:', error);
        return {
            totalVehicles: 0,
            activeVehicles: 0,
            maintenanceVehicles: 0,
            utilization: 0,
            fuelConsumption: 0,
            totalMileage: 0,
            vehiclesByType: []
        };
    }
};

// Helper functions for calculating fleet statistics
const calculateUtilizationRate = (vehicles: any[]) => {
    // In a real app, this would calculate the percentage of time vehicles are in use
    return vehicles.length > 0 ? (vehicles.filter(v => v.holat === 'foal').length / vehicles.length) * 100 : 0;
};

const calculateAverageFuelConsumption = (vehicles: any[]) => {
    // This would calculate average fuel consumption across the fleet
    return 0; 
};

const calculateTotalMileage = (vehicles: any[]) => {
    // Sum up total mileage across all vehicles
    return vehicles.reduce((total, vehicle) => total + (vehicle.mileage || 0), 0);
};

const calculateVehiclesByType = (vehicles: any[]) => {
    // Group vehicles by type and count them
    const types: Record<string, number> = {};
    vehicles.forEach(vehicle => {
        const type = vehicle.type || 'unknown';
        types[type] = (types[type] || 0) + 1;
    });
    
    return Object.entries(types).map(([type, count]) => ({
        type,
        count
    }));
};

// Convert car data to vehicle format for consistency across CEO module
const adaptCarToVehicle = (car: any) => {
    return {
        id: car.id,
        name: car.name,
        number: car.car_number || car.number,
        type: 'car',
        status: car.holat === 'foal' ? 'active' : 
                car.holat === 'tamirlash' ? 'maintenance' : 
                car.holat === 'kutmoqda' ? 'available' : 'inactive',
        mileage: car.mileage || 0,
        year: car.year,
        model: car.name,
        engine: car.engine,
        transmission: car.transmission,
        fuel_type: car.fuel,
        photo: car.photo,
        created_at: car.created_at,
        updated_at: car.updated_at
    };
};

// Implement getAllVehicles wrapper that formats data properly
const getAllVehiclesWrapper = async (params?: VehicleFilter) => {
    try {
        const cars = await accountingVehicleApi.getAllCars();
        const carsArray = Array.isArray(cars) ? cars : cars.results || [];
        const formattedVehicles = carsArray.map(adaptCarToVehicle);
        
        return {
            data: formattedVehicles,
            total: formattedVehicles.length
        };
    } catch (error) {
        console.error('Error in getAllVehiclesWrapper:', error);
        return {
            data: [],
            total: 0
        };
    }
};

// Export the fleet API with our additions
export const fleetApi = {
    // Include base vehicle functions with proper formatting
    getAllVehicles: getAllVehiclesWrapper,
    getVehicleById: async (id: number) => {
        const car = await getCarDetails(id);
        return adaptCarToVehicle(car);
    },
    createVehicle: accountingVehicleApi.createCar,
    updateVehicle: accountingVehicleApi.updateCar,
    deleteVehicle: accountingVehicleApi.deleteCar,
    // Add CEO-specific functions
    getFleetStats
};

// Export CEO-specific functions separately
export { getFleetStats }; 