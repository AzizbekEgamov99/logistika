import { useQuery } from '@tanstack/react-query'
import { completeAllRays } from '../api/freight/freightapi'
import { TripFormValues } from '../types/freight'

export const useHistoryTrips = () => {
  return useQuery<TripFormValues[], Error>({
    queryKey: ['tripHistory'],
    queryFn: completeAllRays,
  })
} 