import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  createRays, 
  fetchAllRays, 
  completeAllRays, 
  returnTripFromHistory,
  completeRace
} from '../api/freight/freightapi'
import { raysType, RaysResponseType, TripFormValues } from '../types/freight'
import { message } from 'antd'

export const useCreateRays = () => {
  const queryClient = useQueryClient()
  
  return useMutation<RaysResponseType, Error, raysType>({
    mutationFn: createRays,
    onSuccess: (data) => {
      message.success('Reys muvaffaqiyatli yaratildi')
      queryClient.invalidateQueries({ queryKey: ['rays'] })
      console.log('🎉 Successfully created rays:', data)
    },
    onError: (error) => {
      message.error('Reys yaratishda xatolik yuz berdi')
      console.error('⚠️ Failed to create rays:', error.message)
    },
  })
}

export const useRays = () => {
  return useQuery<RaysResponseType[], Error>({
    queryKey: ['rays'],
    queryFn: fetchAllRays,
    staleTime: 1000 * 60 * 5, // 5 daqiqa
    refetchInterval: 1000 * 60 * 3, // 3 daqiqa
  })
}

export const useRaysHistory = () => {
  return useQuery<TripFormValues[], Error>({
    queryKey: ['rays-history'],
    queryFn: completeAllRays,
    staleTime: 1000 * 60 * 5, // 5 daqiqa
  })
}

export const useCompleteRace = () => {
  const queryClient = useQueryClient()
  
  return useMutation<any, Error, number>({
    mutationFn: completeRace,
    onSuccess: () => {
      message.success('Reys muvaffaqiyatli yakunlandi')
      queryClient.invalidateQueries({ queryKey: ['rays'] })
      queryClient.invalidateQueries({ queryKey: ['rays-history'] })
    },
    onError: (error) => {
      message.error('Reysni yakunlashda xatolik yuz berdi')
      console.error('Failed to complete race:', error.message)
    }
  })
}

export const useReturnTripFromHistory = () => {
  const queryClient = useQueryClient()
  
  return useMutation<any, Error, number>({
    mutationFn: returnTripFromHistory,
    onSuccess: () => {
      message.success('Reys muvaffaqiyatli faollashtirildi')
      queryClient.invalidateQueries({ queryKey: ['rays'] })
      queryClient.invalidateQueries({ queryKey: ['rays-history'] })
    },
    onError: (error) => {
      message.error('Reysni qaytarishda xatolik yuz berdi')
      console.error('Failed to return trip from history:', error.message)
    }
  })
}
