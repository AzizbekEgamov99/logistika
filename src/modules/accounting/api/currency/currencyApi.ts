import axiosInstance from '../../../../api/axiosInstance';

export interface Currency {
  id: number;
  currency: string;  
  rate_to_uzs: string;
  updated_at: string;
}
export const getAllCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await axiosInstance.get('/currency/');
    console.log('Currency API response:', response.data);
    
    // Handle both paginated ({results: []}) and non-paginated ([]) responses
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error: any) {
    if (error?.response?.status !== 401) {
      console.error('Error fetching currencies:', error);
    } else {
      console.warn('Silent 401 in getAllCurrencies');
    }
    // Fallback static data if API fails (e.g. 403 or network error)
    return [
      { id: 1, currency: 'USD', rate_to_uzs: '12917.36', updated_at: new Date().toISOString() },
      { id: 2, currency: 'UZS', rate_to_uzs: '1', updated_at: new Date().toISOString() },
    ];
  }
};

export const currencyApi = {
  getAllCurrencies
}; 