import axiosInstance from '../../../../api/axiosInstance';
import { Car } from "../../types/car.types";
import { CarFilter, CarStatus } from "../../types/car";
export const carsApi = {
    getAllCars: async () => {
        const response = await axiosInstance.get('/cars/');
        return response.data;
    },

    createCar: async (values) => {
        const carData = new FormData();
        carData.append('name', values.name);
        carData.append('number', values.number);
        carData.append('year', values.year);
        carData.append('engine', values.engine);
        carData.append('transmission', values.transmission);
        carData.append('power', values.power);
        carData.append('capacity', values.capacity);
        carData.append('fuel', values.fuel);
        carData.append('mileage', values.mileage || '0');
        carData.append('kilometer', values.mileage || '0');
        carData.append('car_number', values.car_number);
        carData.append('holat', values.holat || 'kutmokda');
        if (values.photo && values.photo instanceof File) {
            carData.append('photo', values.photo);
        }

        try {
            const response = await axiosInstance.post('/cars/', carData);
            return response.data;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    },

    updateCar: async (id: number, data: Partial<Car>) => {
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.number) formData.append('number', data.number);
            if (data.car_number) formData.append('car_number', data.car_number);
            if (data.year) formData.append('year', data.year.toString());
            if (data.engine) formData.append('engine', data.engine);
            if (data.transmission) formData.append('transmission', data.transmission);
            if (data.power) formData.append('power', data.power);
            if (data.capacity) formData.append('capacity', data.capacity);
            if (data.fuel) formData.append('fuel', data.fuel);
            if (data.mileage) {
                formData.append('mileage', data.mileage.toString());
                formData.append('kilometer', data.mileage.toString());
            }
            if (data.holat) {
                const mappedHolat = data.holat === 'kutmoqda' ? 'kutmokda' : data.holat;
                formData.append('holat', mappedHolat);
            }
            if (data.photo) {
                if (data.photo instanceof File) {
                    formData.append('photo', data.photo);
                }
                else if (typeof data.photo === 'string') {
                    console.log('Keeping existing photo:', data.photo);
                }
            }
            const response = await axiosInstance.patch(`/cars/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating car:', error);
            throw error;
        }
    },

    deleteCar: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/cars/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Delete Car Error:', error);
            throw error;
        }
    }
};

export const getAllCars = async (params?: CarFilter) => {
    try {
        const response = await axiosInstance.get('/cars/', { params });
        console.log('Cars API Response:', response.data);
        return {
            results: response.data || [],
            count: response.data?.length || 0
        };
    } catch (error) {
        console.error('Error fetching cars:', error);
        throw error;
    }
};

export const createCar = async (data: Partial<Car>) => {
    try {
        const formData = new FormData();
        if (!data.name || !data.car_number || !data.number) {
            throw new Error('Majburiy maydonlar to\'ldirilmagan');
        }
        formData.append('name', data.name);
        formData.append('car_number', data.car_number);
        formData.append('number', data.number);
        if (data.year) formData.append('year', data.year.toString());
        if (data.engine) formData.append('engine', data.engine);
        if (data.transmission) formData.append('transmission', data.transmission);
        if (data.power) formData.append('power', data.power);
        if (data.capacity) formData.append('capacity', data.capacity);
        if (data.fuel) formData.append('fuel', data.fuel);
        if (data.mileage) {
            formData.append('mileage', data.mileage.toString());
            formData.append('kilometer', data.mileage.toString());
        } else {
            formData.append('kilometer', '0');
            formData.append('mileage', '0');
        }
        formData.append('holat', data.holat && data.holat !== 'kutmoqda' ? data.holat : 'kutmokda');
        if (data.photo instanceof File) {
            formData.append('photo', data.photo);
        }
        console.log('Sending data to server:', Object.fromEntries(formData));
        const response = await axiosInstance.post('/cars/', formData);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating car:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Transport qo\'shishda xatolik yuz berdi');
    }
};
export const updateCar = async (id: number, data: Partial<Car>) => {
    try {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.number) formData.append('number', data.number);
        if (data.car_number) formData.append('car_number', data.car_number);
        if (data.year) formData.append('year', data.year.toString());
        if (data.engine) formData.append('engine', data.engine);
        if (data.transmission) formData.append('transmission', data.transmission);
        if (data.power) formData.append('power', data.power);
        if (data.capacity) formData.append('capacity', data.capacity);
        if (data.fuel) formData.append('fuel', data.fuel);
        if (data.mileage) {
            formData.append('mileage', data.mileage.toString());
            formData.append('kilometer', data.mileage.toString());
        }
        if (data.holat) {
            const mappedHolat = data.holat === 'kutmoqda' ? 'kutmokda' : data.holat;
            formData.append('holat', mappedHolat);
        }
        if (data.photo) {
            if (data.photo instanceof File) {
                formData.append('photo', data.photo);
            }
            else if (typeof data.photo === 'string') {
                console.log('Keeping existing photo:', data.photo);
            }
        }
        const response = await axiosInstance.patch(`/cars/${id}/`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating car:', error);
        throw error;
    }
};

export const deleteCar = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/cars/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting car:', error);
        throw error;
    }
};

export const getCarsByStatus = async (status: CarStatus): Promise<Car[]> => {
    try {
        const response = await axiosInstance.get(`/cars/?status=${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cars by status:', error);
        throw error;
    }
};

export const getCarDetails = async (id: number): Promise<Car> => {
    try {
        const response = await axiosInstance.get(`/cars/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car details:', error);
        throw error;
    }
};
