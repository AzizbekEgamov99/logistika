import axiosInstance from '@/api/axiosInstance';
export interface CashTransaction {
  client: number;
  rays?: number;
  product?: number;
  driver?: number;
  amount: number;
  amount_in_usd?: string;
  currency?: string;
  custom_rate_to_uzs?: number;
  payment_way?: number;
  comment?: string;
  is_debt?: boolean;
  is_via_driver?: boolean;
  is_delivered_to_cashier?: boolean;
  total_expected_amount?: number;
  paid_amount?: number;
}

export const cashTransactionApi = {
  getTransactions: async () => {
    const response = await axiosInstance.get('/casa/');
   
    return response.data;
  },
  createTransaction: async (data: CashTransaction) => {
    const response = await axiosInstance.post('/casa/', data);
    return response.data;
  },
  getRaysClientsMap: async () => {
    const response = await axiosInstance.get('/casa/rays-clients-map/');
    return response.data;
  },
  getCashTransactionById: async (id: number) => {
    const response = await axiosInstance.get(`/casa/${id}/`);
    return response.data;
  },
  updateCashTransaction: async (id: number, data: Partial<CashTransaction>) => {
    const response = await axiosInstance.patch(`/casa/${id}/`, data);
    return response.data;
  },

  deleteCashTransaction: async (id: number) => {
    await axiosInstance.delete(`/casa/${id}/`);
  }
}; 