import axiosInstance from '@/api/axiosInstance'
import { Furgon, FurgonStatusSummary } from '../../types/furgon'

export const getFurgons = async (): Promise<Furgon[]> => {
  try {
    const response = await axiosInstance.get<Furgon[]>('/furgon/')
    return response.data
  } catch (error) {
    console.error('Error fetching furgons:', error)
    throw error
  }
}

export const getFurgonStatusSummary =
  async (): Promise<FurgonStatusSummary> => {
    try {
      const response = await axiosInstance.get<FurgonStatusSummary>(
        '/furgon/status-summary/',
      )
      return response.data
    } catch (error) {
      console.error('Error fetching furgon status summary:', error)
      throw error
    }
  }

export const getFurgon = async (id: number): Promise<Furgon> => {
  try {
    const response = await axiosInstance.get<Furgon>(`/furgon/${id}/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching furgon with ID ${id}:`, error)
    throw error
  }
}

export const createFurgon = async (formData: FormData): Promise<Furgon> => {
  try {
    const response = await axiosInstance.post<Furgon>('/furgon/', formData)
    return response.data
  } catch (error) {
    console.error('Error creating furgon:', error)
    throw error
  }
}
export const updateFurgon = async (
  id: number,
  formData: FormData,
): Promise<Furgon> => {
  try {
    // Log the formData contents for debugging
    console.log('Sending update to backend, formData contents:')
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}`)
      } else {
        console.log(`${pair[0]}: ${pair[1]}`)
      }
    }

    // Send the update request
    const response = await axiosInstance.put<Furgon>(
      `/furgon/${id}/`,
      formData
    )
    return response.data
  } catch (error) {
    console.error(`Error updating furgon with ID ${id}:`, error)
    
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data)
      console.error('Error response status:', error.response.status)
    }
    
    throw error
  }
}

export const patchFurgon = async (
  id: number,
  formData: FormData,
): Promise<Furgon> => {
  try {
    console.log('Sending PATCH to backend, formData contents:')
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}`)
      } else {
        console.log(`${pair[0]}: ${pair[1]}`)
      }
    }

    const response = await axiosInstance.patch<Furgon>(
      `/furgon/${id}/`,
      formData
    )
    return response.data
  } catch (error) {
    console.error(`Error patching furgon with ID ${id}:`, error)
    
    if (error.response) {
      console.error('Error response data:', error.response.data)
      console.error('Error response status:', error.response.status)
    }
    
    throw error
  }
}

export const deleteFurgon = async (id: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/furgon/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting furgon with ID ${id}:`, error);
    
    // Log more detailed information about the error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
      
      // Handle specific status codes
      if (error.response.status === 409 || error.response.status === 400) {
        throw new Error('Bu furgon boshqa ma\'lumotlarga bog\'langan va o\'chirib bo\'lmaydi. Avval bog\'liq ma\'lumotlarni o\'chiring.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request made but no response received:', error.request);
      throw new Error('Server bilan bog\'lanishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
    }
    
    throw error;
  }
}
