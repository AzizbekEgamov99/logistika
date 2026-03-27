export interface TransactionData {
    id: number;
    date: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    payment_method: 'cash' | 'card' | 'transfer' | 'other';
    status: 'completed' | 'pending' | 'failed';
    reference_number?: string;
    driver_id?: number;
    driver_name?: string;
    vehicle_id?: number;
    vehicle_name?: string;
    client_id?: number;
    client_name?: string;
    trip_id?: number;
    created_at: string;
    updated_at: string;
}

export interface TransactionFilter {
    search?: string;
    page?: number;
    pageSize?: number;
    type?: 'income' | 'expense';
    startDate?: string;
    endDate?: string;
    driverId?: number;
    vehicleId?: number;
    clientId?: number;
}

export interface FinancialStatistics {
    total_income: number;
    total_expenses: number;
    net_profit: number;
    income_by_category: {
        category: string;
        amount: number;
    }[];
    expenses_by_category: {
        category: string;
        amount: number;
    }[];
    income_by_period: {
        period: string;
        value: number;
    }[];
    expenses_by_period: {
        period: string;
        value: number;
    }[];
    profit_by_period: {
        period: string;
        value: number;
    }[];
}

export interface FinancialSummary {
    totalRevenue: number;
    mtdRevenue: number;
    totalExpenses: number;
    mtdExpenses: number;
    totalProfit: number;
    mtdProfit: number;
    fuelExpenses: number;
    maintenanceExpenses: number;
    salaryExpenses: number;
    otherExpenses: number;
    revenueByMonth: {
        month: string;
        revenue: number;
        expenses: number;
        profit: number;
    }[];
    expensesByCategory: {
        category: string;
        amount: number;
        percentage: number;
    }[];
} 