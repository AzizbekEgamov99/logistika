import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/api/apiConfig'
import {
  raysType,
  TripFormValues,
  RaysResponseType as FreightRaysResponseType,
  PaginatedResponse
} from '../../types/freight'
import { AxiosError } from 'axios'
import { 
  RaysCreate,
  ProductCreate,
  Location,
  FromLocation,
  ToLocation
} from '../../types/freight.types'

type ApiRaysResponseType = FreightRaysResponseType;
type ApiError = AxiosError<{ message?: string }>;

interface HistoryResponseData {
  id: number;
  driver_data: {
    fullname: string;
    phone_number: string;
  };
  car_data: {
    name: string;
    number: string;
  };
  fourgon_data: {
    name: string;
    number: string;
  };
  client_data: Array<{
    id: number;
    name: string;
    company: string;
    phone: string;
    price: number;
    address: string;
    is_completed: boolean;
  }>;
  price: number;
  dr_price: number;
  dp_price: number;
  from1: string;
  to_go: string;
  kilometer: number;
  dp_information: string;
  created_at: string;
  count: number;
  country: number;
}

export const createRays = async (data: raysType): Promise<ApiRaysResponseType> => {
  try {
    console.log('Original payload data:', data);
    
    const clientData = Array.isArray(data.client) ? data.client : [];
    const payload: Record<string, unknown> = {
      driver: Number(data.driver),
      car: Number(data.car),
      fourgon: Number(data.fourgon),
      client: clientData,
      price: Number(data.price || 0),
      dr_price: Number(data.dr_price || 0),
      dp_price: Number(data.dp_price || 0),
      kilometer: Number(data.kilometer || 0),
      is_completed: Boolean(data.is_completed),
    };

    if (Array.isArray(data.client_completed) && data.client_completed.length > 0) {
      payload.client_completed = data.client_completed.map(id => Number(id));
    }
    
    if (data.from1 !== undefined && data.from1 !== null && data.from1 !== '') {
      payload.from1 = String(data.from1);
    }
    
    if (data.to_go !== undefined && data.to_go !== null && data.to_go !== '') {
      payload.to_go = String(data.to_go);
    }
    
    if (data.dp_information !== undefined && data.dp_information !== null) {
      payload.dp_information = String(data.dp_information);
    }
    
    if (data.count !== undefined && data.count !== null) {
      payload.count = Number(data.count);
    }
    
    if (data.country !== undefined && data.country !== null) {
      payload.country = Number(data.country);
    }

    // Checking if selected vehicle is busy
    console.log('Creating new rays started', payload);
    if (payload?.car && typeof payload.car === 'object' && 'is_busy' in payload.car && payload.car.is_busy) {
      throw new Error("Transport band!");
    }
    if (payload?.fourgon && typeof payload.fourgon === 'object' && 'is_busy' in payload.fourgon && payload.fourgon.is_busy) {
      throw new Error("Furgon band!");
    }
    if (payload?.driver && typeof payload.driver === 'object' && 'is_busy' in payload.driver && payload.driver.is_busy) {
      throw new Error("Haydovchi band!");
    }

    console.log('Formatted payload:', payload);
    const response = await axiosInstance.post<ApiRaysResponseType>(API_URLS.rays, payload);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('API Error Details:', {
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      headers: axiosError.response?.headers
    });
    
    // Handle specific error for busy vehicles
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data as any;
      
      // Check for busy car error
      if (errorData && errorData.car && Array.isArray(errorData.car) && 
          errorData.car.some((msg: string) => msg.includes('busy'))) {
        throw new Error('Tanlangan mashina band. Iltimos, boshqa mashina tanlang.');
      }
      
      // Check for busy furgon error
      if (errorData && errorData.fourgon && Array.isArray(errorData.fourgon) && 
          errorData.fourgon.some((msg: string) => msg.includes('busy'))) {
        throw new Error('Tanlangan furgon band. Iltimos, boshqa furgon tanlang.');
      }
    }
    
    throw new Error(axiosError.response?.data?.message || 'Reys yaratishda xatolik yuz berdi');
  }
};

export const fetchAllRays = async (): Promise<ApiRaysResponseType[]> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<ApiRaysResponseType>>(API_URLS.rays)
    console.log('✅ Fetched rays:', response.data)

    const transformedData = response.data.results.map(trip => ({
      ...trip,
    }));

    return transformedData;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error(
      '❌ Error fetching rays:',
      axiosError.response?.data || axiosError.message,
    )
    throw new Error(
      axiosError.response?.data?.message || 'Reyslarni olishda xatolik yuz berdi',
    )
  }
}

export const updateRayStatus = async (
  id: number,
  isCompleted: boolean,
): Promise<ApiRaysResponseType> => {
  try {
    console.log(`🚀 Updating ray ${id} status to ${isCompleted ? 'completed' : 'in progress'}...`)
    const response = await axiosInstance.patch<ApiRaysResponseType>(
      `${API_URLS.rays}${id}/`,
      {
        is_completed: isCompleted,
      },
    )
    console.log(
      `✅ Updated ray ${id} status to ${isCompleted ? 'completed' : 'in progress'}:`,
      response.data,
    )
    if (isCompleted) {
      try {
        console.log(`🚀 Moving ray ${id} to history...`)
        await completeRace(id)
        console.log(`✅ Ray ${id} moved to history successfully`)
      } catch (completeError: unknown) {
        const completeErrorAxios = completeError as ApiError;
        console.error(`⚠️ Failed to move ray ${id} to history:`, completeErrorAxios.message)
      }
    }

    return response.data
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error(
      `❌ Error updating ray ${id}:`,
      axiosError.response?.data || axiosError.message,
    )
    throw new Error(
      axiosError.response?.data?.message || 'Reysni yangilashda xatolik yuz berdi',
    )
  }
}

export const completeRace = async (id: number): Promise<HistoryResponseData> => {
  try {
    const response = await axiosInstance.get<ApiRaysResponseType>(`${API_URLS.rays}${id}/`)
    const ray = response.data

    console.log(`🚀 Creating history record for ray ${id}...`)
    const historyData = {
      driver_data: {
        fullname: ray.client.length > 0 ? ray.client[0].name : "Unknown",
        phone_number: ray.client.length > 0 ? ray.client[0].phone : "Unknown"
      },
      car_data: {
        name: ray.car.model,
        number: ray.car.number
      },
      fourgon_data: {
        name: ray.fourgon.type,
        number: ray.fourgon.number
      },
      client_data: ray.client,
      price: ray.price,
      dr_price: ray.dr_price,
      dp_price: ray.dp_price,
      from1: ray.from1,
      to_go: ray.to_go,
      kilometer: ray.kilometer,
      dp_information: ray.dp_information,
      created_at: ray.created_at,
      count: ray.count,
      country: ray.country || 0
    }

    const historyResponse = await axiosInstance.post(API_URLS.history, historyData)
    console.log(`✅ Ray ${id} completed and moved to history:`, historyResponse.data)
    return historyResponse.data
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error(
      `❌ Error completing ray ${id}:`,
      axiosError.response?.data || axiosError.message,
    )
    throw new Error(
      axiosError.response?.data?.message || 'Reysni tarixga o\'tkazishda xatolik yuz berdi',
    )
  }
}

export const completeAllRays = async (): Promise<TripFormValues[]> => {
  try {
    const response = await axiosInstance.get<TripFormValues[]>(
      `${API_URLS.history}`
    )
    console.log('✅ Fetched rays history:', response.data)
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error(
      '❌ Error fetching rays history:',
      axiosError.response?.data || axiosError.message,
    )
    throw new Error(
      axiosError.response?.data?.message || 'Reyslar tarixini olishda xatolik yuz berdi',
    )
  }
}

export const exportRays = async (params: {
  period?: string
  from?: string
  to?: string
}): Promise<Blob> => {
  try {
    const queryParams = new URLSearchParams()
    if (params.period) {
      queryParams.append('period', params.period)
    }
    if (params.from) {
      queryParams.append('from', params.from)
    }
    if (params.to) {
      queryParams.append('to', params.to)
    }
    const url = `${API_URLS.rays}export/?${queryParams.toString()}`
    console.log('Making export request to:', url)

    const response = await axiosInstance.get(url, {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })

    if (response.status !== 200) {
      throw new Error('Export failed')
    }

    return response.data
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Export error details:', axiosError)
    throw new Error('Reyslarni eksport qilishda xatolik yuz berdi')
  }
}

export const returnTripFromHistory = async (id: number): Promise<{ id: number; status: string }> => {
  try {
    const response = await axiosInstance.get<TripFormValues>(`${API_URLS.history}${id}/`)
    const trip = response.data

    const createdDate = new Date(trip.created_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 2) {
      throw new Error('Reys 2 kundan ko\'p vaqt o\'tgani uchun qaytarib bo\'lmaydi')
    }
    console.log(`🚀 Returning trip ${id} to active list...`)
    const restoreResponse = await axiosInstance.post(`/rayshistory-actions/${id}/restore/`)
    console.log(`✅ Trip ${id} successfully returned to active list:`, restoreResponse.data)
    return restoreResponse.data
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error(
      `❌ Error returning trip ${id}:`,
      axiosError.response?.data || axiosError.message,
    )
    const errorMessage = axiosError.response?.data?.message ||
      axiosError.message ||
      'Reysni qaytarishda xatolik yuz berdi'
    throw new Error(errorMessage)
  }
}

export const fetchFromLocations = async (): Promise<FromLocation[]> => {
  try {
    const response = await axiosInstance.get<FromLocation[]>('/fromlocation/');
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error fetching from locations:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch from locations');
  }
};

export const fetchToLocations = async (): Promise<ToLocation[]> => {
  try {
    const response = await axiosInstance.get<ToLocation[]>('/tolocation/');
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error fetching to locations:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch to locations');
  }
};

export const createFromLocation = async (name: string): Promise<FromLocation> => {
  try {
    const response = await axiosInstance.post<FromLocation>('/fromlocation/', { name });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error creating from location:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to create from location');
  }
};

export const createToLocation = async (name: string): Promise<ToLocation> => {
  try {
    const response = await axiosInstance.post<ToLocation>('/tolocation/', { name });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error creating to location:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to create to location');
  }
};

export const deleteFromLocation = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/fromlocation/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error deleting from location:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to delete from location');
  }
};

export const deleteToLocation = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/tolocation/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error deleting to location:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to delete to location');
  }
};

export const updateFromLocation = async (id: number, name: string): Promise<FromLocation> => {
  try {
    const response = await axiosInstance.put<FromLocation>(`/fromlocation/${id}/`, { name });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error updating from location:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to update from location');
  }
};

export const updateToLocation = async (id: number, name: string): Promise<ToLocation> => {
  try {
    const response = await axiosInstance.put<ToLocation>(`/tolocation/${id}/`, { name });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as ApiError;
    console.error('Error updating to location:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to update to location');
  }
};

export const freightApi = {
  // Get all freight deliveries
  getAllFreight: async () => {
    const response = await axiosInstance.get('/rays/');
    return response.data;
  },

  // Create new rays (route)
  createRays: async (data: RaysCreate) => {
    try {
      // Transform client data to match API expectations
      const formattedData = {
        ...data,
        client: Array.isArray(data.client) ? data.client : [data.client],
        client_completed: Array.isArray(data.client_completed) ? data.client_completed : [],
        driver_data: data.driver_data || {
          fullname: '',
          phone_number: ''
        },
        car_data: data.car_data || {
          name: '',
          number: ''
        },
        fourgon_data: data.fourgon_data || {
          name: '',
          number: ''
        },
        dp_currency: data.dp_currency || 'USD',
        is_completed: data.is_completed || false
      };

      const response = await axiosInstance.post('/rays/', formattedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating rays:', error.response?.data || error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (data: ProductCreate) => {
    try {
      console.log('Creating product with data:', data); // Debugging
      const response = await axiosInstance.post('/product/', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error.response?.data || error);
      throw error;
    }
  },

  // Get all locations
  getLocations: async (): Promise<Location[]> => {
    const response = await axiosInstance.get('/fromlocation/');
    return response.data;
  },

  getRaysById: async (id: number) => {
    const response = await axiosInstance.get(`/rays/${id}/`);
    return response.data;
  },

  updateRays: async (id: number, data: Partial<RaysCreate>) => {
    try {
      const response = await axiosInstance.patch(`/rays/${id}/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating rays:', error.response?.data || error);
      throw error;
    }
  },

  // Delete rays
  deleteRays: async (id: number) => {
    await axiosInstance.delete(`/rays/${id}/`);
  },

  // Get all rays
  getAllRays: async () => {
    const response = await axiosInstance.get('/rays/');
    return response.data;
  },

  // Get active rays
  getActiveRays: async () => {
    const response = await axiosInstance.get('/rays/?is_completed=false');
    return response.data;
  },

  // Complete rays
  completeRays: async (id: number) => {
    const response = await axiosInstance.patch(`/rays/${id}/`, {
      is_completed: true
    });
    return response.data;
  }
};