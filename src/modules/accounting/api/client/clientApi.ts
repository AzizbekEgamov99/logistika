import axiosInstance from "../../../../api/axiosInstance";
import { Client, ClientFilter } from "../../types/client";
export const getAllClients = async (params?: ClientFilter) => {
    try {
        const response = await axiosInstance.get('/clients/', {
            params: {
                search: params?.search || undefined,
                page: params?.page || 1,
                page_size: params?.pageSize || 10
            }
        });
        console.log('Clients response:', response.data);
        return {
            data: response.data || [],
            total: response.data?.length || 0
        };
    } catch (error) {
        console.error('Error fetching clients:', error);
        return {
            data: [],
            total: 0
        };
    }
};
export const createClient = async (data: Partial<Client>) => {
    try {
        const response = await axiosInstance.post('/clients/', {
            first_name: data.first_name,
            last_name: data.last_name,
            city: data.city,
            number: data.number,
            driver: data.driver === true ? true : null,
            company: data.company
        });
        return response.data;
    } catch (error) {
        console.error('Error creating client:', error);
        throw error;
    }
};

export const updateClient = async (id: number, data: Partial<Client>) => {
    try {
        const response = await axiosInstance.put(`/clients/${id}/`, {
            first_name: data.first_name,
            last_name: data.last_name,
            city: data.city,
            number: data.number,
            driver: data.driver === true ? true : null 
        });
        return response.data;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
};

export const deleteClient = async (id: number) => {
    try {
        await axiosInstance.delete(`/clients/${id}/`);
        return true;
    } catch (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
};

export const clientApi = {
    getAllClients,
    getClientById: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/clients/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching client:', error);
            throw error;
        }
    },
    createClient,
    updateClient,
    deleteClient
};