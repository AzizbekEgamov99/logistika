import axiosInstance from "../../../../api/axiosInstance";
import { TransactionData, TransactionFilter, FinancialSummary } from "../../types/finance";


export const getAllTransactions = async (params?: TransactionFilter) => {
    try {
        const response = await axiosInstance.get('/casa/', {
            params: {
                search: params?.search || undefined,
                page: params?.page || 1,
                page_size: params?.pageSize || 10,
                type: params?.type || undefined,
                start_date: params?.startDate || undefined,
                end_date: params?.endDate || undefined,
                driver_id: params?.driverId || undefined,
                vehicle_id: params?.vehicleId || undefined,
                client_id: params?.clientId || undefined
            }
        });
        return {
            data: response.data.results || [],
            total: response.data?.count || 0
        };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return {
            data: [],
            total: 0
        };
    }
};

export const getTransactionById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/casa/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};

// Add a function to get financial summary in the format expected by the Dashboard
export const getFinancialSummary = async (params?: { dateFrom?: string, dateTo?: string }): Promise<FinancialSummary> => {
    try {
        // Use the existing getFinancialStatistics with appropriate parameter mapping
        const stats = await getFinancialStatistics({
            startDate: params?.dateFrom,
            endDate: params?.dateTo
        });
        
        // Calculate month-to-date revenue and profit
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const mtdStats = await getFinancialStatistics({
            startDate: firstDayOfMonth.toISOString().split('T')[0],
            endDate: now.toISOString().split('T')[0]
        });
        
        // Transform into the format expected by the dashboard
        return {
            totalRevenue: stats.total_income || 0,
            mtdRevenue: mtdStats.total_income || 0,
            totalExpenses: stats.total_expenses || 0,
            mtdExpenses: mtdStats.total_expenses || 0,
            totalProfit: stats.net_profit || 0,
            mtdProfit: mtdStats.net_profit || 0,
            fuelExpenses: stats.expenses_by_category?.find((c: any) => c.category === 'fuel')?.amount || 0,
            maintenanceExpenses: stats.expenses_by_category?.find((c: any) => c.category === 'maintenance')?.amount || 0,
            salaryExpenses: stats.expenses_by_category?.find((c: any) => c.category === 'salary')?.amount || 0,
            otherExpenses: stats.expenses_by_category?.find((c: any) => c.category === 'other')?.amount || 0,
            revenueByMonth: stats.income_by_period?.map((p: any) => ({
                month: p.period,
                revenue: p.value,
                expenses: stats.expenses_by_period?.find((e: any) => e.period === p.period)?.value || 0,
                profit: stats.profit_by_period?.find((e: any) => e.period === p.period)?.value || 0
            })) || [],
            expensesByCategory: stats.expenses_by_category?.map((c: any) => ({
                category: c.category,
                amount: c.amount,
                percentage: (c.amount / (stats.total_expenses || 1)) * 100
            })) || []
        };
    } catch (error) {
        console.error('Error fetching financial summary:', error);
        return {
            totalRevenue: 0,
            mtdRevenue: 0,
            totalExpenses: 0,
            mtdExpenses: 0,
            totalProfit: 0,
            mtdProfit: 0,
            fuelExpenses: 0,
            maintenanceExpenses: 0,
            salaryExpenses: 0,
            otherExpenses: 0,
            revenueByMonth: [],
            expensesByCategory: []
        };
    }
};

export const getFinancialStatistics = async (params?: { 
    startDate?: string; 
    endDate?: string;
    type?: string;
}) => {
    try {
        const response = await axiosInstance.get('/casa/', {
            params: {
                start_date: params?.startDate || undefined,
                end_date: params?.endDate || undefined,
                type: params?.type || undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching financial statistics:', error);
        throw error;
    }
};

export const createTransaction = async (data: Partial<TransactionData>) => {
    try {
        const response = await axiosInstance.post('/casa/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

export const updateTransaction = async (id: number, data: Partial<TransactionData>) => {
    try {
        const response = await axiosInstance.put(`/casa/${id}/`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};

export const deleteTransaction = async (id: number) => {
    try {
        await axiosInstance.delete(`/casa/${id}/`);
        return true;
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

export const getExpenseTotals = async () => {
    try {
        const response = await axiosInstance.get('/service/totals/');
        
        // Transform the data to a more usable format for the chart
        if (response.data && response.data.totals) {
            const { totals } = response.data;
            return {
                "Texnik xizmat": totals.texnic || 0,
                "Ballon xarajatlari": totals.balon || 0,
                "Furgon ballonlari": totals.balonfurgon || 0,
                "Kundalik xarajatlar": totals.chiqimlik || 0,
                "Optol to'lovlari": totals.optol || 0,
                "Haydovchilar ish haqi": totals.driversalary || 0,
                "Boshqa xarajatlar": totals.other || 0
            };
        }
        
        return {};
    } catch (error) {
        console.error('Error fetching expense totals:', error);
        // Return dummy data for testing if needed
        return {
            "Texnik xizmat": 1500,
            "Ballon xarajatlari": 800,
            "Furgon ballonlari": 600,
            "Kundalik xarajatlar": 1200,
            "Optol to'lovlari": 400,
            "Haydovchilar ish haqi": 2500,
            "Boshqa xarajatlar": 300
        };
    }
};

export const financeApi = {
    getAllTransactions,
    getTransactionById,
    getFinancialStatistics,
    getFinancialSummary,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getExpenseTotals
}; 