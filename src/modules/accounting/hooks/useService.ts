import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ServiceType } from '../types/maintenance'
import {
  updateService,
  deleteService,
  createService,
  getServices,
} from '../api/maintance/ServiceCreate'
export const useService = () => {
  const queryClient = useQueryClient()
  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['service'],
    queryFn: getServices,
  })
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: ServiceType }) =>
      updateService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] })
    },
  })
  return {
    services,
    isLoading,
    isError,
    createService: createMutation.mutate,
    deleteService: deleteMutation.mutate,
    updateService: updateMutation.mutate,
  }
}
