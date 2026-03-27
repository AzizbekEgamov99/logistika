import axiosInstance from '@/api/axiosInstance';
import { 
    Cash, 
    CashFilter, 
    CashStatus, 
    CashCreate, 
    CashOverview, 
    RaysClientsMap,
    CashCategory,
    CashHistory,
    Currency,
    ServiceTotals
} from '../../types/cash.types';

export const cashApi = {
    getAllCash: async () => {
        const response = await axiosInstance.get('/casa/');
        return response.data;
    },

    getCashById: async (id: number) => {
        const response = await axiosInstance.get(`/casa/${id}/`);
        return response.data;
    },

    createCash: async (values: CashCreate) => {
        try {
            const response = await axiosInstance.post('/casa/', {
                ...values,
                custom_rate_to_uzs: values.custom_rate_to_uzs
            });
            return response.data;
        } catch (error) {
            console.error('Error creating cash entry:', error);
            throw error;
        }
    },

    updateCash: async (id: number, data: Partial<Cash>) => {
        try {
            const response = await axiosInstance.patch(`/casa/${id}/`, {
                ...data,
                custom_rate_to_uzs: data.custom_rate_to_uzs
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cash entry:', error);
            throw error;
        }
    },

    deleteCash: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/casa/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting cash entry:', error);
            throw error;
        }
    },

    confirmCashEntry: async (id: number) => {
        try {
            const response = await axiosInstance.patch(`/casa/${id}/`, {
                is_confirmed_by_cashier: true
            });
            return response.data;
        } catch (error) {
            console.error('Error confirming cash entry:', error);
            throw error;
        }
    },

    confirmCashTransaction: async (id: number, data?: any) => {
        try {
            const response = await axiosInstance.patch(`/casa/${id}/confirm/`, data || {});
            return response.data;
        } catch (error) {
            console.error('Error confirming cash transaction:', error);
            throw error;
        }
    },

    markAsDeliveredToCashier: async (id: number) => {
        try {
            const response = await axiosInstance.patch(`/casa/${id}/`, {
                is_delivered_to_cashier: true
            });
            return response.data;
        } catch (error) {
            console.error('Error marking cash as delivered to cashier:', error);
            throw error;
        }
    },

    getAllClientDebts: async () => {
        try {
            const response = await axiosInstance.get('/casa/all-debts/');
            return response.data;
        } catch (error) {
            console.error('Error fetching client debts:', error);
            throw error;
        }
    },

    getCashOverview: async () => {
        try {
            const response = await axiosInstance.get('/casa/overview/?period=month');
            return response.data;
        } catch (error) {
            console.error('Error fetching cash overview:', error);
            throw error;
        }
    },

    getRaysClientsMap: async () => {
        try {
            const response = await axiosInstance.get('/casa/rays-clients-map/');
            return response.data;
        } catch (error) {
            console.error('Error fetching rays-clients map:', error);
            throw error;
        }
    },

    getCashCategories: async () => {
        try {
            const response = await axiosInstance.get('/casacategory/');
            return response.data;
        } catch (error) {
            console.error('Error fetching cash categories:', error);
            throw error;
        }
    },

    getCashHistory: async () => {
        try {
            const response = await axiosInstance.get('/casahistory/');
            return response.data;
        } catch (error) {
            console.error('Error fetching cash history:', error);
            throw error;
        }
    },

    getCashHistoryById: async (id: number) => {
        try {
            const response = await axiosInstance.get(`/casahistory/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cash history by ID:', error);
            throw error;
        }
    },

    getCurrencies: async () => {
        try {
            const response = await axiosInstance.get('/currency/');
            return response.data;
        } catch (error) {
            console.error('Error fetching currencies:', error);
            throw error;
        }
    },

    getCashList: async (filters?: CashFilter): Promise<Cash[]> => {
        const response = await axiosInstance.get('/casa/', { params: filters });
        return response.data;
    },

    updateCashTransaction: async (id: number, data: Partial<CashCreate>): Promise<Cash> => {
        const response = await axiosInstance.patch(`/casa/${id}/`, data);
        return response.data;
    },

    deleteCashTransaction: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/casa/${id}/`);
    },

    getServiceTotals: async (): Promise<ServiceTotals> => {
        const response = await axiosInstance.get('/service/totals/');
        return response.data;
    },

    getServiceTotalsWithDate: async () => {
        const response = await axiosInstance.get('/service/totals-date/');
        
        // API response has { data: [...], totals: {...} } format
        return {
            all_expenses: response.data.data || [],
            totals_usd: response.data.totals || {
                texnic: 0,
                balon: 0,
                balon_furgon: 0,
                chiqimlik: 0,
                optol: 0,
                total: 0
            }
        };
    },

    getPaymentWays: async () => {
        try {
            // Fallback to static data since endpoint doesn't exist
            return [
                { id: 1, name: 'Naqd pul' },
                { id: 2, name: 'Bank o\'tkazmasi' },
                { id: 3, name: 'Terminal' }
            ];
        } catch (error) {
            console.error('Error fetching payment ways:', error);
            throw error;
        }
    },

    getPaymentTypes: async () => {
        try {
            // Use currency endpoint since payment types are actually currencies
            const response = await axiosInstance.get('/currency/');
            return response.data;
        } catch (error) {
            console.error('Error fetching payment types:', error);
            throw error;
        }
    },

    getAllServiceTypes: async () => {
        try {
            // Fetch services from all maintenance service endpoints
            const [generalServices, tehnicalServices, balonServices, balonFurgonServices, optolServices] = await Promise.all([
                axiosInstance.get('/service/'),
                axiosInstance.get('/texnic/'),
                axiosInstance.get('/balon/'),
                axiosInstance.get('/balonfurgon/'),
                axiosInstance.get('/optol/')
            ]);
            
            return {
                generalServices: generalServices.data || [],
                tehnicalServices: tehnicalServices.data || [],
                balonServices: balonServices.data || [],
                balonFurgonServices: balonFurgonServices.data || [],
                optolServices: optolServices.data || []
            };
        } catch (error) {
            console.error('Error fetching all service types:', error);
            throw error;
        }
    }
};

export const getAllCash = async (params?: CashFilter) => {
    try {
        const response = await axiosInstance.get('/casa/', { params });
        return {
            results: response.data || [],
            count: response.data?.length || 0
        };
    } catch (error) {
        console.error('Error fetching cash entries:', error);
        throw error;
    }
};

export const createCash = async (data: CashCreate) => {
    try {
        const response = await axiosInstance.post('/casa/', {
            ...data,
            custom_rate_to_uzs: data.custom_rate_to_uzs
        });
        return response.data;
    } catch (error) {
        console.error('Error creating cash entry:', error);
        throw new Error(error.response?.data?.detail || 'Kassa yozuvini qo\'shishda xatolik yuz berdi');
    }
};

export const updateCash = async (id: number, data: Partial<Cash>) => {
    try {
        const response = await axiosInstance.patch(`/casa/${id}/`, {
            ...data,
            custom_rate_to_uzs: data.custom_rate_to_uzs
        });
        return response.data;
    } catch (error) {
        console.error('Error updating cash entry:', error);
        throw error;
    }
};

export const deleteCash = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/casa/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting cash entry:', error);
        throw error;
    }
};

export const getCashByStatus = async (status: CashStatus): Promise<Cash[]> => {
    try {
        const response = await axiosInstance.get(`/casa/?status=${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cash entries by status:', error);
        throw error;
    }
};

export const getCashDetails = async (id: number): Promise<Cash> => {
    try {
        const response = await axiosInstance.get(`/casa/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cash details:', error);
        throw error;
    }
};

export const getAllClientDebts = async () => {
    try {
        const response = await axiosInstance.get('/casa/all-debts/');
        return response.data;
    } catch (error) {
        console.error('Error fetching client debts:', error);
        throw error;
    }
};

export const getCashOverview = async (): Promise<CashOverview> => {
    try {
        const response = await axiosInstance.get('/casa/overview/?period=month');
        return response.data;
    } catch (error) {
        console.error('Error fetching cash overview:', error);
        throw error;
    }
};

export const getRaysClientsMap = async (): Promise<RaysClientsMap[]> => {
    try {
        const response = await axiosInstance.get('/casa/rays-clients-map/');
        return response.data;
    } catch (error) {
        console.error('Error fetching rays-clients map:', error);
        throw error;
    }
};

export const getCashCategories = async (): Promise<CashCategory[]> => {
    try {
        const response = await axiosInstance.get('/casacategory/');
        return response.data;
    } catch (error) {
        console.error('Error fetching cash categories:', error);
        throw error;
    }
};

export const getCashHistory = async (): Promise<CashHistory[]> => {
    try {
        const response = await axiosInstance.get('/casahistory/');
        return response.data;
    } catch (error) {
        console.error('Error fetching cash history:', error);
        throw error;
    }
};

export const getCashHistoryById = async (id: number): Promise<CashHistory> => {
    try {
        const response = await axiosInstance.get(`/casahistory/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cash history by ID:', error);
        throw error;
    }
};

export const getCurrencies = async (): Promise<Currency[]> => {
    try {
        const response = await axiosInstance.get('/currency/');
        return response.data;
    } catch (error) {
        console.error('Error fetching currencies:', error);
        throw error;
    }
}; 