import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BalonType } from '../types/maintenance'
import {
  getBalonServices,
  createBalonService,
  updateBalonService,
  deleteBalonService,
  partialUpdateBalonService,
} from '../api/balonService'

export const useBalonManagement = () => {
  const queryClient = useQueryClient()

  const {
    data: balonServices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['balon'],
    queryFn: getBalonServices,
  })

  // Create a new balon service
  const createMutation = useMutation({
    mutationFn: createBalonService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balon'] })
    },
  })

  // Update a balon service
  const updateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: BalonType }) =>
      updateBalonService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balon'] })
    },
  })

  // Partially update a balon service
  const partialUpdateMutation = useMutation({
    mutationFn: ({
      id,
      service,
    }: {
      id: number
      service: Partial<BalonType>
    }) => partialUpdateBalonService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balon'] })
    },
  })

  // Delete a balon service
  const deleteMutation = useMutation({
    mutationFn: deleteBalonService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balon'] })
    },
  })

  return {
    balonServices,
    isLoading,
    isError,
    addBalonService: createMutation.mutate,
    updateBalonService: updateMutation.mutate,
    partialUpdateBalonService: partialUpdateMutation.mutate,
    deleteBalonService: deleteMutation.mutate,
  }
}
