import { DriverData, DriverFilter } from "../../types/driver";
import * as accountingDriverApi from "../../../accounting/api/drivers/driverApi";

// Adapter to convert accounting driver format to CEO driver format
const adaptDriver = (driver: any): DriverData => {
    const nameParts = (driver.fullname || '').split(' ');
    const firstName = driver.first_name || nameParts[0] || '';
    const lastName = driver.last_name || nameParts.slice(1).join(' ') || '';

    return {
        id: driver.id,
        username: driver.username,
        first_name: firstName,
        last_name: lastName,
        full_name: driver.fullname,
        phone: driver.phone_number,
        phone_number: driver.phone_number,
        email: driver.email,
        status: driver.status === 'driver' || driver.status === 'active' ? 'active' : 
                driver.status === 'on_trip' ? 'on_trip' : 'inactive',
        photo: driver.photo,
        license_number: driver.license_number || '',
        license_expiry: driver.license_expiry || '',
        address: driver.address || '',
        city: driver.city || '',
        joining_date: driver.date || driver.created_at || '',
        created_at: driver.created_at || '',
        updated_at: driver.updated_at || ''
    } as DriverData;
};

// CEO-specific driver statistics functionality
const getDriverStats = async (params?: { dateFrom?: string, dateTo?: string }) => {
    try {
        // Leverage existing driver data from accounting module
        const driversResponse = await accountingDriverApi.getAllDrivers({
            page: 1,
            pageSize: 100,
            status: 'all'
        });
        
        const drivers = Array.isArray(driversResponse.results) 
            ? driversResponse.results 
            : [];
        
        // Calculate CEO-specific stats
        return {
            totalDrivers: driversResponse.count || 0,
            activeDrivers: drivers.filter(driver => driver.status === 'driver').length,
            newDrivers: drivers.filter(driver => {
                // Consider drivers added in the last 30 days as 'new'
                if (!driver.date) return false;
                const created = new Date(driver.date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return created >= thirtyDaysAgo;
            }).length,
            topPerformers: [] // Would be populated with actual performance data
        };
    } catch (error) {
        console.error('Error fetching driver stats:', error);
        return {
            totalDrivers: 0,
            activeDrivers: 0,
            newDrivers: 0,
            topPerformers: []
        };
    }
};

const getDriverPerformance = async (params?: { dateFrom?: string, dateTo?: string }) => {
    try {
        return {
            averageTripsPerDriver: 0,
            averageMileage: 0,
            performance: []
        };
    } catch (error) {
        console.error('Error fetching driver performance:', error);
        return {
            averageTripsPerDriver: 0,
            averageMileage: 0,
            performance: []
        };
    }
};

// Wrap accounting API functions with our adapted format
export const getAllDrivers = async (params?: DriverFilter) => {
    try {
        const accountingParams = {
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
            search: params?.search,
            status: params?.status === 'active' ? 'driver' : params?.status
        };
        
        const response = await accountingDriverApi.getAllDrivers(accountingParams);
        
        return {
            data: (response.results || []).map(adaptDriver),
            total: response.count || 0
        };
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return {
            data: [],
            total: 0
        };
    }
};

export const getDriverById = async (id: number) => {
    try {
        const driver = await accountingDriverApi.getDriver(id);
        return adaptDriver(driver);
    } catch (error) {
        console.error('Error fetching driver:', error);
        throw error;
    }
};

export const createDriver = async (data: Partial<DriverData>) => {
    try {
        const accountingDriverData = {
            fullname: data.full_name,
            username: data.username,
            password: data.password,
            phone_number: data.phone_number || data.phone || '',
            email: data.email,
            status: (data.status === 'active' ? 'driver' : data.status) as any,
            photo: data.photo || null
        };
        
        const driver = await accountingDriverApi.createDriver(accountingDriverData);
        return adaptDriver(driver);
    } catch (error) {
        console.error('Error creating driver:', error);
        throw error;
    }
};

export const updateDriver = async (id: number, data: Partial<DriverData>) => {
    try {
        const accountingDriverData = {
            fullname: data.full_name,
            phone_number: data.phone_number || data.phone,
            status: (data.status === 'active' ? 'driver' : data.status) as any,
            photo: data.photo
        };
        
        const driver = await accountingDriverApi.updateDriver(id, accountingDriverData);
        return adaptDriver(driver);
    } catch (error) {
        console.error('Error updating driver:', error);
        throw error;
    }
};

export const deleteDriver = async (id: number) => {
    try {
        await accountingDriverApi.deleteDriver(id);
        return true;
    } catch (error) {
        console.error('Error deleting driver:', error);
        throw error;
    }
};

// Export all API functions through driverApi object
export const driverApi = {
    getAllDrivers,
    getDriverById,
    getDriverStatistics: getDriverById, // Fallback to using basic driver data
    getDriverStats,
    getDriverPerformance,
    createDriver,
    updateDriver,
    deleteDriver
};

// Export individual functions
export { getDriverStats, getDriverPerformance }; 