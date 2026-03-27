import axios from 'axios';
import { API_URLS } from '@/api/apiConfig';
import axiosInstance from '@/api/axiosInstance';
import dayjs from 'dayjs';

export interface ServiceTotals {
  texnic: number;
  balon: number;
  chiqimlik: number;
  optol: number;
  total: number;
}

export interface DateRange {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

export const fetchServiceTotals = async (dateRange?: DateRange): Promise<ServiceTotals> => {
  try {
    let url = `/service/totals/`;
    
    // Add date range parameters if provided
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const startDate = dateRange.startDate.format('YYYY-MM-DD');
      const endDate = dateRange.endDate.format('YYYY-MM-DD');
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data.totals || response.data;
  } catch (error) {
    console.error('Error fetching service totals:', error);
    throw error;
  }
}; 