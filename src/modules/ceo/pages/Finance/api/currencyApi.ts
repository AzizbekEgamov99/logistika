import axiosInstance from '../../../../../api/axiosInstance';
import { Currency, CurrencyFormValues } from '../types/currency';

// Get all currencies
export const getCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await axiosInstance.get('/currency/');
    
    // Handle both paginated ({results: []}) and non-paginated ([]) responses
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching currencies in CEO module:', error);
    // Fallback static data if API fails
    return [
      { id: 1, currency: 'USD', rate_to_uzs: '12917.36', updated_at: new Date().toISOString() },
      { id: 2, currency: 'UZS', rate_to_uzs: '1', updated_at: new Date().toISOString() },
    ];
  }
};

// Get a single currency by ID
export const getCurrencyById = async (id: number): Promise<Currency> => {
  const response = await axiosInstance.get(`/currency/${id}/`);
  return response.data;
};

// Create a new currency
export const createCurrency = async (data: CurrencyFormValues): Promise<Currency> => {
  const response = await axiosInstance.post('/currency/', data);
  return response.data;
};

// Update an existing currency
export const updateCurrency = async (id: number, data: CurrencyFormValues): Promise<Currency> => {
  const response = await axiosInstance.put(`/currency/${id}/`, data);
  return response.data;
};

// Delete a currency
export const deleteCurrency = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/currency/${id}/`);
}; 