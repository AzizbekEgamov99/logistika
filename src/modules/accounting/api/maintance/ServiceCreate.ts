import axiosInstance from '@/api/axiosInstance'
import { ServiceType } from '../../types/maintenance'

export const getServices = async (): Promise<ServiceType[]> => {
  const response = await axiosInstance.get<ServiceType[]>('/service/')
  return response.data
}

export const createService = async (service: ServiceType): Promise<ServiceType> => {
  const response = await axiosInstance.post<ServiceType>('/service/', service)
  return response.data
}
export const deleteService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/service/${id}`)
}

export const updateService = async (id: number, service: ServiceType): Promise<ServiceType> => {
  const response = await axiosInstance.put<ServiceType>(`/service/${id}`, service)
  return response.data
}
