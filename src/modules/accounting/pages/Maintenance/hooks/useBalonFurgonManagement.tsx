import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BalonFurgonType } from '../types/maintenance'
import {
  getBalonFurgonServices,
  createBalonFurgonService,
  updateBalonFurgonService,
  deleteBalonFurgonService,
  partialUpdateBalonFurgonService,
} from '../api/balonFurgonService'

export const useBalonFurgonManagement = () => {
  const queryClient = useQueryClient()

  const {
    data: balonFurgonServices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['balonfurgon'],
    queryFn: getBalonFurgonServices,
  })

  // Create a new balon furgon service
  const createMutation = useMutation({
    mutationFn: createBalonFurgonService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balonfurgon'] })
    },
  })

  // Update a balon furgon service
  const updateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: BalonFurgonType }) =>
      updateBalonFurgonService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balonfurgon'] })
    },
  })

  // Partially update a balon furgon service
  const partialUpdateMutation = useMutation({
    mutationFn: ({
      id,
      service,
    }: {
      id: number
      service: Partial<BalonFurgonType>
    }) => partialUpdateBalonFurgonService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balonfurgon'] })
    },
  })

  // Delete a balon furgon service
  const deleteMutation = useMutation({
    mutationFn: deleteBalonFurgonService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balonfurgon'] })
    },
  })

  return {
    balonFurgonServices,
    isLoading,
    isError,
    addBalonFurgonService: createMutation.mutate,
    updateBalonFurgonService: updateMutation.mutate,
    partialUpdateBalonFurgonService: partialUpdateMutation.mutate,
    deleteBalonFurgonService: deleteMutation.mutate,
  }
} 