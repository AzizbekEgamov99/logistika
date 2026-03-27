import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashApi } from '../api/cash/cashApi';
import { 
  Cash, 
  CashFilter, 
  CashStatus, 
  CashSummary, 
  CashCreate, 
} from '../types/cash.types';
import { message } from 'antd';
import axiosInstance from '@/api/axiosInstance';
import { useMemo, useState, useEffect } from 'react';
import { useClients } from './useClients';
import { useDrivers } from './useDrivers';
import { useRays } from './useRays';
import { cashTransactionApi, CashTransaction } from '../api/cashTransaction';
import axios from 'axios';

export const useCashSummary = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cash', 'summary'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/casa/summary/');
        return response.data as CashSummary;
      } catch (error) {
        console.error('Error fetching cash summary:', error);
        throw error;
      }
    }
  });

  const summaryData = useMemo(() => {
    return {
      totalAmount: data?.total_amount || 0,
      completedCount: data?.completed_count || 0,
      pendingCount: data?.pending_count || 0,
      cancelledCount: data?.cancelled_count || 0,
      totalCount: data?.total_count || 0
    };
  }, [data]);

  return {
    summaryData,
    isLoading,
    error
  };
};

export const useCashOverview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cash', 'overview'],
    queryFn: cashApi.getCashOverview
  });

  return {
    cashOverview: data,
    isLoading,
    error
  };
};

export const useAllClientDebts = () => {
  const { data, isLoading: isLoadingDebts, error: debtsError } = useQuery({
    queryKey: ['cash', 'client-debts'],
    queryFn: cashApi.getAllClientDebts
  });
  
  const { data: clientsData, isLoading: isLoadingClients } = useClients();
  
  const clientDebts = useMemo(() => {
    if (!data || !clientsData?.data) return [];
    
    return data.map(debt => {
      const clientDetails = clientsData.data.find(client => client.id === debt.client__id);
      
      return {
        ...debt,
        client_details: clientDetails || null
      };
    });
  }, [data, clientsData]);

  return {
    clientDebts,
    isLoading: isLoadingDebts || isLoadingClients,
    error: debtsError
  };
};

export const useRaysClientsMap = () => {
  const { data, isLoading: isLoadingMap, error: mapError } = useQuery({
    queryKey: ['cash', 'rays-clients-map'],
    queryFn: cashApi.getRaysClientsMap
  });
  
  const { data: raysData, isLoading: isLoadingRays } = useRays();
  
  const raysClientsMap = useMemo(() => {
    if (!data || !raysData) return [];
    
    return data.map(raysMap => {
      const raysDetails = raysData.find(ray => ray.id === raysMap.rays_id);
      
      return {
        ...raysMap,
        rays_details: raysDetails || null
      };
    });
  }, [data, raysData]);

  return {
    raysClientsMap,
    isLoading: isLoadingMap || isLoadingRays,
    error: mapError
  };
};

export const useCashCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cash', 'categories'],
    queryFn: cashApi.getCashCategories
  });

  return {
    cashCategories: data || [],
    isLoading,
    error
  };
};

export const useCashHistory = () => {
  const { data, isLoading: isLoadingHistory, error: historyError } = useQuery({
    queryKey: ['cash', 'history'],
    queryFn: cashApi.getCashHistory
  });
  
  const { data: raysData, isLoading: isLoadingRays } = useRays();
  const { drivers, loading: isLoadingDrivers } = useDrivers();
  const { data: clientsData, isLoading: isLoadingClients } = useClients();
  
  const cashHistory = useMemo(() => {
    if (!data) return [];
    
    return data.map(history => {
      const driverDetails = drivers?.find(d => d.id === history.driver);
      const clientDetails = clientsData?.data.find(c => c.id === history.client);
      const raysDetails = raysData?.find(r => r.id === history.rays);
      
      return {
        ...history,
        driver_details: driverDetails || null,
        client_details: clientDetails || null,
        rays_details: raysDetails || null
      };
    });
  }, [data, drivers, clientsData, raysData]);

  return {
    cashHistory,
    isLoading: isLoadingHistory || isLoadingRays || isLoadingDrivers || isLoadingClients,
    error: historyError
  };
};

export const useCashHistoryDetails = (id: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cash', 'history', id],
    queryFn: () => cashApi.getCashHistoryById(id),
    enabled: !!id
  });

  const { drivers } = useDrivers();
  const { data: clientsData } = useClients();
  const { data: raysData } = useRays();
  
  const cashHistoryDetails = useMemo(() => {
    if (!data) return null;
    
    const driverDetails = drivers?.find(d => d.id === data.driver);
    const clientDetails = clientsData?.data.find(c => c.id === data.client);
    const raysDetails = raysData?.find(r => r.id === data.rays);
    
    return {
      ...data,
      driver_details: driverDetails || null,
      client_details: clientDetails || null,
      rays_details: raysDetails || null
    };
  }, [data, drivers, clientsData, raysData]);

  return {
    cashHistoryDetails,
    isLoading,
    error
  };
};

export const useCash = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [raysClientsMap, setRaysClientsMap] = useState<any[]>([]);
  const [cashOverview, setCashOverview] = useState<any>(null);

  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CashFilter>({});

  const { drivers } = useDrivers();
  const { data: clientsData, isLoading: isLoadingClients } = useClients();
  const { data: raysData } = useRays();

  const { data: cashEntriesRaw = [], isLoading } = useQuery({
    queryKey: ['cash', filters],
    queryFn: () => cashApi.getAllCash(),
  });

  const cashEntries = useMemo(() => {
    return cashEntriesRaw.map(cash => {
      const driverDetails = drivers?.find(d => d.id === cash.driver);
      const clientDetails = clientsData?.data.find(c => c.id === cash.client);
      const raysDetails = raysData?.find(r => r.id === cash.rays);
      
      return {
        ...cash,
        driver_details: driverDetails || null,
        client_details: clientDetails || null,
        rays_details: raysDetails || null
      };
    });
  }, [cashEntriesRaw, drivers, clientsData, raysData]);

  // Fetch cash overview
  const fetchCashOverview = async () => {
    try {
      setLoading(true);
      const data = await cashApi.getCashOverview();
      setCashOverview(data);
      return data;
    } catch (error) {
      console.error('Error fetching cash overview:', error);
      message.error('Kassa ma\'lumotlarini yuklashda xatolik yuz berdi');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CashCreate) => cashApi.createCash(data),
    onSuccess: () => {
      invalidateRelatedQueries();
      message.success("Kassa yozuvi muvaffaqiyatli qo'shildi");
    },
    onError: (error: any) => {
      console.error('Create cash error:', error);
      message.error(error.response?.data?.detail || "Kassa yozuvini yaratishda xatolik yuz berdi");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Cash> & { id: number }) => {
      const { id, ...updateData } = data;
      return cashApi.updateCash(id, updateData);
    },
    onSuccess: () => {
      invalidateRelatedQueries();
      message.success("Kassa yozuvi muvaffaqiyatli yangilandi");
    },
    onError: (error: any) => {
      console.error('Update cash error:', error);
      message.error(error.response?.data?.detail || "Kassa yozuvini yangilashda xatolik yuz berdi");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cashApi.deleteCash(id),
    onSuccess: () => {
      invalidateRelatedQueries();
      message.success("Kassa yozuvi muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      console.error('Delete cash error:', error);
      message.error(error.response?.data?.detail || "Kassa yozuvini o'chirishda xatolik yuz berdi");
    }
  });

  const confirmCashMutation = useMutation({
    mutationFn: (id: number) => cashApi.confirmCashEntry(id),
    onSuccess: () => {
      invalidateRelatedQueries();
      message.success("Kassa yozuvi muvaffaqiyatli tasdiqlandi");
    },
    onError: (error: any) => {
      console.error('Confirm cash error:', error);
      message.error(error.response?.data?.detail || "Kassa yozuvini tasdiqlashda xatolik yuz berdi");
    }
  });

  const markAsDeliveredMutation = useMutation({
    mutationFn: (id: number) => cashApi.markAsDeliveredToCashier(id),
    onSuccess: () => {
      invalidateRelatedQueries();
      message.success("Kassa yozuvi kassirga topshirilgan deb belgilandi");
    },
    onError: (error: any) => {
      console.error('Mark as delivered error:', error);
      message.error(error.response?.data?.detail || "Kassa yozuvini kassirga topshirilgan deb belgilashda xatolik yuz berdi");
    }
  });

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['cash'] });
    queryClient.invalidateQueries({ queryKey: ['cash', 'summary'] });
    queryClient.invalidateQueries({ queryKey: ['cash', 'client-debts'] });
    queryClient.invalidateQueries({ queryKey: ['cash', 'overview'] });
    queryClient.invalidateQueries({ queryKey: ['cash', 'history'] });
  };

  const setFilter = (key: keyof CashFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await cashTransactionApi.getTransactions();
      setTransactions(data);
    } catch (error) {
      message.error('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaysClientsMap = async () => {
    try {
      setLoading(true);
      const data = await cashTransactionApi.getRaysClientsMap();
      setRaysClientsMap(data);
    } catch (error) {
      message.error('Failed to fetch rays-clients mapping');
      console.error('Error fetching rays-clients mapping:', error);
    } finally {
      setLoading(false);
    }
  };
  const createTransaction = async (data: CashTransaction) => {
    try {
      setLoading(true);
      const response = await cashTransactionApi.createTransaction(data);
      message.success('Transaction created successfully');
      await fetchTransactions(); // Refresh the list
      return response;
    } catch (error) {
      message.error('Failed to create transaction');
      console.error('Error creating transaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get clients for a specific rays
  const getClientsForRays = (raysId: number) => {
    const raysData = raysClientsMap.find(item => item.rays_id === raysId);
    return raysData?.clients || [];
  };

  // Initialize data
  useEffect(() => {
    fetchTransactions();
    fetchRaysClientsMap();
    fetchCashOverview();
  }, []);

  return {
    cashEntries,
    isLoading,
    filters,
    setFilter,
    setFilters,
    createCash: createMutation.mutate,
    updateCash: updateMutation.mutate,
    deleteCash: deleteMutation.mutate,
    confirmCash: confirmCashMutation.mutate,
    markAsDelivered: markAsDeliveredMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isConfirming: confirmCashMutation.isPending,
    isMarkingAsDelivered: markAsDeliveredMutation.isPending,
    loading,
    transactions,
    raysClientsMap,
    cashOverview,
    createTransaction,
    getClientsForRays,
    fetchTransactions,
    fetchRaysClientsMap,
    fetchCashOverview
  };
};

export const useCashByStatus = (status: CashStatus) => {
  const { data: cashEntries = [], isLoading, error } = useQuery({
    queryKey: ['cash', 'status', status],
    queryFn: () => cashApi.getCashByStatus(status),
  });

  const { drivers } = useDrivers();
  const { data: clientsData } = useClients();
  const { data: raysData } = useRays();
  
  const enrichedCashEntries = useMemo(() => {
    return cashEntries.map(cash => {
      const driverDetails = drivers?.find(d => d.id === cash.driver);
      const clientDetails = clientsData?.data.find(c => c.id === cash.client);
      const raysDetails = raysData?.find(r => r.id === cash.rays);
      
      return {
        ...cash,
        driver_details: driverDetails || null,
        client_details: clientDetails || null,
        rays_details: raysDetails || null
      };
    });
  }, [cashEntries, drivers, clientsData, raysData]);

  return {
    cashEntries: enrichedCashEntries,
    isLoading,
    error
  };
};

export const useCashDetails = (id: number) => {
  const { data: cashDetails, isLoading, error } = useQuery({
    queryKey: ['cash', 'details', id],
    queryFn: () => cashApi.getCashById(id),
    enabled: !!id
  });

  const { drivers } = useDrivers();
  const { data: clientsData } = useClients();
  const { data: raysData } = useRays();
  
  const enrichedCashDetails = useMemo(() => {
    if (!cashDetails) return null;
    
    const driverDetails = drivers?.find(d => d.id === cashDetails.driver);
    const clientDetails = clientsData?.data.find(c => c.id === cashDetails.client);
    const raysDetails = raysData?.find(r => r.id === cashDetails.rays);
    
    return {
      ...cashDetails,
      driver_details: driverDetails || null,
      client_details: clientDetails || null,
      rays_details: raysDetails || null
    };
  }, [cashDetails, drivers, clientsData, raysData]);

  return {
    cashDetails: enrichedCashDetails,
    isLoading,
    error
  };
}; 