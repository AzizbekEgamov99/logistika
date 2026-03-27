import axiosInstance from "../../../../api/axiosInstance";
import { TripData, TripFilter, TripStats } from "../../types/trip";

export const getAllTrips = async (params?: TripFilter) => {
    try {
        const response = await axiosInstance.get('/rays/', {
            params: {
                search: params?.search || undefined,
                page: params?.page || 1,
                page_size: params?.pageSize || 10,
                status: params?.status || undefined,
                start_date: params?.startDate || undefined,
                end_date: params?.endDate || undefined,
                driver_id: params?.driverId || undefined,
                vehicle_id: params?.vehicleId || undefined,
                client_id: params?.clientId || undefined
            }
        });
        return {
            data: response.data.results || [],
            total: response.data?.count || 0
        };
    } catch (error) {
        console.error('Error fetching trips:', error);
        return {
            data: [],
            total: 0
        };
    }
};

export const getTripById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/rays/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching trip:', error);
        throw error;
    }
};

// Add a function to get trip stats in the format expected by the Dashboard
export const getTripStats = async (params?: { dateFrom?: string, dateTo?: string }): Promise<TripStats> => {
    try {
        // Use the existing getTripStatistics with appropriate parameter mapping
        const stats = await getTripStatistics({
            startDate: params?.dateFrom,
            endDate: params?.dateTo
        });
        
        // Transform into the format expected by the dashboard
        return {
            totalTrips: stats.total_trips || 0,
            completedTrips: stats.completed_trips || 0,
            activeTrips: stats.in_progress_trips || 0,
            cancelledTrips: stats.canceled_trips || 0,
            totalDistance: stats.total_distance || 0,
            totalRevenue: stats.total_revenue || 0,
            averageDistance: stats.avg_trip_distance || 0,
            mostCommonRoutes: []
        };
    } catch (error) {
        console.error('Error fetching trip stats:', error);
        return {
            totalTrips: 0,
            completedTrips: 0,
            activeTrips: 0,
            cancelledTrips: 0,
            totalDistance: 0,
            totalRevenue: 0,
            averageDistance: 0,
            mostCommonRoutes: []
        };
    }
};

export const getTripStatistics = async (params?: { 
    startDate?: string; 
    endDate?: string;
    driverId?: number;
    vehicleId?: number;
    clientId?: number;
}) => {
    try {
        const response = await axiosInstance.get('/rays/', {
            params: {
                start_date: params?.startDate || undefined,
                end_date: params?.endDate || undefined,
                driver_id: params?.driverId || undefined,
                vehicle_id: params?.vehicleId || undefined,
                client_id: params?.clientId || undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching trip statistics:', error);
        throw error;
    }
};

export const createTrip = async (data: Partial<TripData>) => {
    try {
        const response = await axiosInstance.post('/rays/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
};

export const updateTrip = async (id: number, data: Partial<TripData>) => {
    try {
        const response = await axiosInstance.put(`/rays/${id}/`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating trip:', error);
        throw error;
    }
};

export const deleteTrip = async (id: number) => {
    try {
        await axiosInstance.delete(`/rays/${id}/`);
        return true;
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
};

export const tripApi = {
    getAllTrips,
    getTripById,
    getTripStatistics,
    getTripStats,
    createTrip,
    updateTrip,
    deleteTrip
}; 