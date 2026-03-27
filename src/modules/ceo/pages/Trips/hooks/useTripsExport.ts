import { useState, useCallback } from 'react';
import { message } from 'antd';
import axiosInstance from '@/api/axiosInstance';
import dayjs from 'dayjs';

export const useTripsExport = (dateRange: any) => {
  const [isExporting, setIsExporting] = useState(false);

  // Export functionality
  const exportToExcel = useCallback(async (period = 'all') => {
    try {
      setIsExporting(true);
      
      let url = '/rays-export/export/';
      let params = {};
      
      // Add period if provided
      if (period !== 'all') {
        params.period = period;
      } 
      // Use the current date range from the filter if it exists
      else if (dateRange && dateRange[0] && dateRange[1]) {
        params.from = dayjs(dateRange[0]).format('YYYY-MM-DD');
        params.to = dayjs(dateRange[1]).format('YYYY-MM-DD');
      }
      
      // Call export API with parameters
      const response = await axiosInstance.get(url, {
        params,
        responseType: 'blob',
      });
      
      // Download the file
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileUrl;
      
      // Set filename with date
      const currentDate = new Date().toISOString().split('T')[0];
      let fileName = `reyslar_tarixi_${currentDate}`;
      
      if (period !== 'all') {
        fileName += `_${period}`;
      } else if (dateRange && dateRange[0] && dateRange[1]) {
        const fromDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
        const toDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
        fileName += `_${fromDate}_${toDate}`;
      }
      
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Excel fayli muvaffaqiyatli yuklandi');
    } catch (error) {
      console.error('Eksport qilishda xatolik:', error);
      message.error('Eksport qilishda xatolik yuz berdi');
    } finally {
      setIsExporting(false);
    }
  }, [dateRange]);

  return {
    isExporting,
    exportToExcel
  };
}; 