import axiosInstance from '@/api/axiosInstance';
import { API_URLS } from '@/api/apiConfig';
import { BalonType } from '../types/maintenance';

// Get all balon services
export const getBalonServices = async (): Promise<BalonType[]> => {
  const response = await axiosInstance.get<BalonType[]>(API_URLS.balon);
  return response.data;
};

// Get a single balon service
export const getBalonService = async (id: number): Promise<BalonType> => {
  const response = await axiosInstance.get<BalonType>(`${API_URLS.balon}${id}/`);
  return response.data;
};

// Create a new balon service
export const createBalonService = async (balonService: BalonType): Promise<BalonType> => {
  const response = await axiosInstance.post<BalonType>(API_URLS.balon, balonService);
  return response.data;
};

// Update a balon service
export const updateBalonService = async (id: number, balonService: BalonType): Promise<BalonType> => {
  const response = await axiosInstance.put<BalonType>(`${API_URLS.balon}${id}/`, balonService);
  return response.data;
};

// Partial update a balon service
export const partialUpdateBalonService = async (id: number, balonService: Partial<BalonType>): Promise<BalonType> => {
  const response = await axiosInstance.patch<BalonType>(`${API_URLS.balon}${id}/`, balonService);
  return response.data;
};

// Delete a balon service
export const deleteBalonService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URLS.balon}${id}/`);
};
