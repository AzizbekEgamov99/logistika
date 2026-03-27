import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { completeAllRays, exportRays, returnTripFromHistory } from '../api/freight/freightapi'
import { TripFormValues } from '../types/freight'
import { baseURL } from '../../../api/axiosInstance'
import { message } from 'antd'

export const useHistory = () => {
  const queryClient = useQueryClient()
  
  const { data, isLoading, error, refetch } = useQuery<TripFormValues[], Error>({
    queryKey: ['history'],
    queryFn: completeAllRays,
  })

  const exportMutation = useMutation({
    mutationFn: exportRays,
    onSuccess: (data: Blob) => {
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `reys-tarixi-${new Date().toISOString().split('T')[0]}.xlsx`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      message.success('Reyslar muvaffaqiyatli eksport qilindi')
    },
    onError: (error) => {
      message.error('Reyslarni eksport qilishda xatolik yuz berdi')
      console.error('Export error:', error)
    }
  })

  const returnMutation = useMutation({
    mutationFn: returnTripFromHistory,
    onSuccess: () => {
      message.success('Reys muvaffaqiyatli faol reyslar ro\'yxatiga qaytarildi')
      queryClient.invalidateQueries({ queryKey: ['history'] })
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
    onError: (error) => {
      message.error('Reysni qaytarishda xatolik yuz berdi')
      console.error('Return trip error:', error)
    }
  })

  const downloadHistory = async (params: {
    period?: string;
    from?: string;
    to?: string;
  }) => {
    try {
      let queryString = '';
      if (params.period) {
        queryString += `period=${params.period}`;
      }
      if (params.from) {
        queryString += `${queryString ? '&' : ''}from=${params.from}`;
      }
      if (params.to) {
        queryString += `${queryString ? '&' : ''}to=${params.to}`;
      }
      
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = `${process.env.NEXT_PUBLIC_API_URL || ''}${baseURL}/rays-export/export${queryString ? `?${queryString}` : ''}`;
      document.body.appendChild(form);
      form.submit();
      form.remove();
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  return {
    data,
    isLoading,
    error,
    downloadHistory,
    isExporting: exportMutation.isPending,
    returnTrip: returnMutation.mutate,
    isReturning: returnMutation.isPending,
    returnError: returnMutation.error,
    refetchHistory: refetch
  }
}
