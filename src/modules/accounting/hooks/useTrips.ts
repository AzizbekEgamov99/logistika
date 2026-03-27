import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllRays, updateRayStatus } from '../api/freight/freightapi'
import { RaysResponseType } from '../types/freight'

export const useTrips = () => {
  return useQuery<RaysResponseType[], Error>({
    queryKey: ['trips'],
    queryFn: fetchAllRays
  })
}

export const useUpdateTripStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation<RaysResponseType, Error, { id: number, isCompleted: boolean }>({
    mutationFn: ({ id, isCompleted }) => updateRayStatus(id, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['history'] })
    }
  })
}