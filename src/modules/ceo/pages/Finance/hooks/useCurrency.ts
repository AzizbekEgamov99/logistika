import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { 
  getCurrencies, 
  createCurrency, 
  updateCurrency, 
  deleteCurrency 
} from '../api/currencyApi';
import { Currency, CurrencyFormValues } from '../types/currency';

export const useCurrency = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch all currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const data = await getCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Error fetching currencies:', error);
        message.error('Valyutalarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [refreshTrigger]);

  // Force refresh of data
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Add a new currency
  const addCurrency = useCallback(async (values: CurrencyFormValues) => {
    setLoading(true);
    try {
      await createCurrency(values);
      message.success('Valyuta muvaffaqiyatli qo\'shildi');
      refreshData();
      return true;
    } catch (error: any) {
      console.error('Error adding currency:', error);
      const errorDetail = error.response?.data?.detail || error.response?.data?.message || '';
      message.error(`Valyuta qo'shishda xatolik yuz berdi: ${errorDetail}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  // Update an existing currency
  const editCurrency = useCallback(async (id: number, values: CurrencyFormValues) => {
    setLoading(true);
    try {
      await updateCurrency(id, values);
      message.success('Valyuta muvaffaqiyatli yangilandi');
      refreshData();
      return true;
    } catch (error) {
      console.error('Error updating currency:', error);
      message.error('Valyutani yangilashda xatolik yuz berdi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  // Delete a currency
  const removeCurrency = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deleteCurrency(id);
      message.success('Valyuta muvaffaqiyatli o\'chirildi');
      refreshData();
      return true;
    } catch (error: any) {
      console.error('Error deleting currency:', error);
      const errorDetail = error.response?.data?.detail || error.response?.data?.message || '';
      message.error(`Valyutani o'chirishda xatolik yuz berdi: ${errorDetail}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  return {
    currencies,
    loading,
    addCurrency,
    editCurrency,
    removeCurrency
  };
}; 