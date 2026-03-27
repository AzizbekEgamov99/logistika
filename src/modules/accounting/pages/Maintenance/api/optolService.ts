import axiosInstance from '@/api/axiosInstance';
import { API_URLS } from '@/api/apiConfig';
import { OptolType } from '../types/maintenance';

// Get all optol services
export const getOptolServices = async (): Promise<OptolType[]> => {
  const response = await axiosInstance.get<OptolType[]>(API_URLS.optol);
  return response.data;
};

// Get a single optol service
export const getOptolService = async (id: number): Promise<OptolType> => {
  const response = await axiosInstance.get<OptolType>(`${API_URLS.optol}${id}/`);
  return response.data;
};

// Create a new optol service
export const createOptolService = async (optolService: OptolType): Promise<OptolType> => {
  const response = await axiosInstance.post<OptolType>(API_URLS.optol, optolService);
  return response.data;
};

// Update an optol service
export const updateOptolService = async (id: number, optolService: OptolType): Promise<OptolType> => {
  const response = await axiosInstance.put<OptolType>(`${API_URLS.optol}${id}/`, optolService);
  return response.data;
};

// Partial update an optol service
export const partialUpdateOptolService = async (id: number, optolService: Partial<OptolType>): Promise<OptolType> => {
  const response = await axiosInstance.patch<OptolType>(`${API_URLS.optol}${id}/`, optolService);
  return response.data;
};

// Delete an optol service
export const deleteOptolService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URLS.optol}${id}/`);
};
