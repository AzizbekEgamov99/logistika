import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';

export const useClientPaymentData = () => {
  const [clientPaymentData, setClientPaymentData] = useState({
    total_clients: 0,
    paid_clients: 0,
    unpaid_clients: 0,
    percent_paid: 0,
    percent_unpaid: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientPaymentData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/casa/cash-pay-present/');
        console.log('Client payment data:', response.data);
        setClientPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching client payment data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientPaymentData();
  }, []);

  return { clientPaymentData, isLoading };
}; 