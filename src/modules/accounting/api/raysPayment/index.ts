import axiosInstance from '@/api/axiosInstance';
import {  RaysPaymentCreate } from '../../types/raysPayment';

export const raysPaymentApi = {
  // Get rays-clients map
  getRaysClientsMap: async () => {
    const response = await axiosInstance.get('/casa/rays-clients-map/');
    return response.data;
  },

  // Get payments by rays ID
  getPaymentsByRaysId: async (raysId: number) => {
    const response = await axiosInstance.get(`/casa/?rays=${raysId}`);
    return response.data;
  },

  // Create payment for rays client
  createPayment: async (data: RaysPaymentCreate) => {
    const response = await axiosInstance.post('/casa/', {
      ...data,
      custom_rate_to_uzs: data.custom_rate_to_uzs
    });
    return response.data;
  },

  // Update payment
  updatePayment: async (id: number, data: Partial<RaysPaymentCreate>) => {
    const response = await axiosInstance.patch(`/casa/${id}/`, {
      ...data,
      custom_rate_to_uzs: data.custom_rate_to_uzs
    });
    return response.data;
  },

  // Delete payment
  deletePayment: async (id: number) => {
    await axiosInstance.delete(`/casa/${id}/`);
  }
}; 