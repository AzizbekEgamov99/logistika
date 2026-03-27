import { useState, useEffect } from 'react';
import { currencyApi, Currency } from '../api/currency/currencyApi';

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const data = await currencyApi.getAllCurrencies();
        setCurrencies(data);
        setError(null);
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.error('Error fetching currencies:', err);
        } else {
          console.warn('Silent 401 in useCurrencies hook');
        }
        setError('Valyuta ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencies, loading, error };
}; 