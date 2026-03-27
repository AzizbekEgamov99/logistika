import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ServiceType } from '@/modules/accounting/types/maintenance'
import axiosInstance from '@/api/axiosInstance'

export const getServices = async (): Promise<ServiceType[]> => {
  const response = await axiosInstance.get<ServiceType[]>('/service')
  return response.data
}

export const createService = async (service: ServiceType): Promise<ServiceType> => {
  const response = await axiosInstance.post<ServiceType>('/service/', service)
  return response.data
}

export const deleteService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/service/${id}/`)
}

export const updateService = async (id: number, service: ServiceType): Promise<ServiceType> => {
  const response = await axiosInstance.put<ServiceType>(`/service/${id}/`, service)
  return response.data
}

export const completeService = async (id: number): Promise<ServiceType> => {
  const response = await axiosInstance.patch<ServiceType>(`/service/${id}/complete`, {})
  return response.data
}

export const useServiceManagement = () => {
  const queryClient = useQueryClient()

  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['service'],
    queryFn: getServices,
  })

  // Create a new service
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })

  // Delete a service
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })

  // Update a service
  const updateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: ServiceType }) =>
      updateService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })

  // Complete a service
  const completeMutation = useMutation({
    mutationFn: completeService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })

  return {
    services,
    isLoading,
    isError,
    addService: createMutation.mutate,
    deleteService: deleteMutation.mutate,
    updateService: updateMutation.mutate,
    completeService: completeMutation.mutate,
  }
}