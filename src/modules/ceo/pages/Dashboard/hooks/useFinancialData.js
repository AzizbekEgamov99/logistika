import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';

export const useFinancialData = (dateRange) => {
  const [financialOverview, setFinancialOverview] = useState({
    cashbox: {
      USD: 0,
      RUB: 0,
      EUR: 0,
      UZS: 0,
      total_in_usd: 0
    },
    expenses: {
      dp_price_usd: 0,
      salaries_usd: 0,
      total_expenses_usd: 0
    },
    final_balance_usd: 0
  });

  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true);
      try {
        // Формируем параметры запроса на основе выбранного dateRange
        const params = new URLSearchParams();
        
        // Убедимся, что тип периода всегда корректный
        const periodType = dateRange.type || 'month';
        
        // Используем правильное значение для API
        switch(periodType) {
          case 'week':
            params.append('period', 'week');
            break;
          case 'month':
            params.append('period', 'month');
            break;
          case 'year':
            params.append('period', 'year');
            break;
          case 'custom':
            // Для кастомного диапазона используем точные даты
            params.append('period', 'custom');
            break;
          default:
            params.append('period', 'month');
        }
        
        // If there are specific date boundaries, add them
        if (dateRange.startDate) {
          const startDateStr = dateRange.startDate.toISOString().split('T')[0];
          params.append('date_from', startDateStr);
        }
        
        if (dateRange.endDate) {
          const endDateStr = dateRange.endDate.toISOString().split('T')[0];
          params.append('date_to', endDateStr);
        }
        
        // Делаем запрос с сформированными параметрами
        const response = await axiosInstance.get(`/casa/overview/?${params.toString()}`);
        setFinancialOverview(response.data);
        
        // For the 6-month data, create a date range for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // -5 to include current month (total 6 months)
        sixMonthsAgo.setDate(1); // Start from the 1st day of the month
        
        const today = new Date();
        // Set to last day of current month
        today.setMonth(today.getMonth() + 1);
        today.setDate(0);
        
        const monthlyParams = new URLSearchParams();
        monthlyParams.append('period', 'custom');
        monthlyParams.append('start_date', sixMonthsAgo.toISOString().split('T')[0]);
        monthlyParams.append('end_date', today.toISOString().split('T')[0]);
        
        // Fetch monthly data for the last 6 months regardless of the date range selected
        let monthlyData = [];
        /* 
        // Endpoint /casa/monthly-income/ does not exist yet and causes 404 errors as logged by axiosInstance
        try {
          const monthlyResponse = await axiosInstance.get(`/casa/monthly-income/?${monthlyParams.toString()}`);
          monthlyData = monthlyResponse.data || [];
        } catch (monthlyErr) {
          console.warn('Could not fetch monthly-income (endpoint might not exist yet):', monthlyErr);
        }
        */
        
        // If we have less than 6 months data, we'll create placeholder data
        if (monthlyData.length < 7) { 
          const monthOrder = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
          
          // Filter out the "Total" entry if it exists
          const totalEntry = monthlyData.find(item => item.month === "Total");
          const filteredData = monthlyData.filter(item => item.month !== "Total");
          
          // Create a months list for the last 6 months
          const months = [];
          const currentMonth = today.getMonth();
          
          for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
            months.push(monthOrder[monthIndex]);
          }
          
          // Create data with zeros for missing months
          const completeData = months.map(month => {
            const existingData = filteredData.find(item => item.month === month);
            if (existingData) {
              return existingData;
            }
            
            return {
              month,
              total_income_usd: 0,
              total_expense_usd: 0,
              balance_usd: 0
            };
          });
          
          // Re-add the total entry if it existed
          if (totalEntry) {
            completeData.push(totalEntry);
          } else if (completeData.length > 0) {
            // Calculate our own total if API doesn't provide it
            const calculatedTotal = {
              month: "Total",
              total_income_usd: completeData.reduce((sum, item) => sum + (item.total_income_usd || 0), 0),
              total_expense_usd: completeData.reduce((sum, item) => sum + (item.total_expense_usd || 0), 0),
              balance_usd: completeData.reduce((sum, item) => sum + (item.balance_usd || 0), 0)
            };
            completeData.push(calculatedTotal);
          }
          
          monthlyData = completeData;
        }
        
        setMonthlyIncome(monthlyData);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFinancialData();
  }, [dateRange]);

  const totalRevenue = financialOverview.cashbox?.total_in_usd || 0;
  const totalExpenses = financialOverview.expenses?.total_expenses_usd || 0;
  const netProfit = financialOverview.final_balance_usd || 0;

  return {
    financialOverview,
    monthlyIncome,
    isLoading,
    totalRevenue,
    totalExpenses,
    netProfit
  };
}; 