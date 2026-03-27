import axiosInstance from '@/api/axiosInstance';
import { API_URLS } from '@/api/apiConfig';
import { BalonFurgonType } from '../types/maintenance';

// Get all balon furgon services
export const getBalonFurgonServices = async (): Promise<BalonFurgonType[]> => {
  const response = await axiosInstance.get<BalonFurgonType[]>(API_URLS.balonfurgon);
  return response.data;
};

// Get a single balon furgon service
export const getBalonFurgonService = async (id: number): Promise<BalonFurgonType> => {
  const response = await axiosInstance.get<BalonFurgonType>(`${API_URLS.balonfurgon}${id}/`);
  return response.data;
};

// Create a new balon furgon service
export const createBalonFurgonService = async (balonFurgonService: BalonFurgonType): Promise<BalonFurgonType> => {
  const response = await axiosInstance.post<BalonFurgonType>(API_URLS.balonfurgon, balonFurgonService);
  return response.data;
};

// Update a balon furgon service
export const updateBalonFurgonService = async (id: number, balonFurgonService: BalonFurgonType): Promise<BalonFurgonType> => {
  const response = await axiosInstance.put<BalonFurgonType>(`${API_URLS.balonfurgon}${id}/`, balonFurgonService);
  return response.data;
};

// Partial update a balon furgon service
export const partialUpdateBalonFurgonService = async (id: number, balonFurgonService: Partial<BalonFurgonType>): Promise<BalonFurgonType> => {
  const response = await axiosInstance.patch<BalonFurgonType>(`${API_URLS.balonfurgon}${id}/`, balonFurgonService);
  return response.data;
};

// Delete a balon furgon service
export const deleteBalonFurgonService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URLS.balonfurgon}${id}/`);
}; 