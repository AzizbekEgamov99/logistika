import { useState, useEffect } from 'react';
import { countryApi, Country } from '../api/country/countryApi';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await countryApi.getAllCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Davlat ma\'lumotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};