import axiosInstance from '../../../../api/axiosInstance';
import { API_URLS } from '../../../../api/apiConfig';
import {
    DriverSalary,
    DriverSalaryCreate,
    DriverSalaryFilter
} from '../../types/driverSalary';

export const driverSalaryApi = {
    getAllDriverSalaries: async (params: any = {}) => {
        try {
            const response = await axiosInstance.get('/driversalary/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching driver salaries:', error);
            throw error;
        }
    },

    getDriverSalary: async (id: number) => {
        try {
            const response = await axiosInstance.get<DriverSalary>(
                `/driversalary/${id}/`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching driver salary:', error);
            throw error;
        }
    },

    getDriverSalariesByDriver: async (driverId: number): Promise<DriverSalary[]> => {
        try {
            const response = await axiosInstance.get(`/driversalary/?driver=${driverId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching driver salaries by driver:', error);
            throw error;
        }
    },

    createDriverSalary: async (data: DriverSalaryCreate) => {
        try {
            const response = await axiosInstance.post<DriverSalary>(
                '/driversalary/',
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error creating driver salary:', error);
            throw error;
        }
    },

    updateDriverSalary: async (id: number, data: Partial<DriverSalaryCreate>) => {
        try {
            const response = await axiosInstance.patch<DriverSalary>(
                `/driversalary/${id}/`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error updating driver salary:', error);
            throw error;
        }
    },

    deleteDriverSalary: async (id: number) => {
        try {
            await axiosInstance.delete(`/driversalary/${id}/`);
        } catch (error) {
            console.error('Error deleting driver salary:', error);
            throw error;
        }
    }
};