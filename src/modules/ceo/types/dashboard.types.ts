export interface DashboardDataType {
  kpiData: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    revenueTrend?: number;
    expensesTrend?: number;
    profitTrend?: number;
    fleetUtilization: number;
    fleetUtilizationTrend?: number;
  };
  financialData: FinancialData[];
  expenses: {
    service: number;
    salary: number;
    other: number;
  };
  topClients: ClientData[];
  driverStats: DriverData[];
  popularRoutes: RouteData[];
}

export interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ClientData {
  id: number;
  name: string;
  totalOrders: number;
  totalSpent: number;
}

export interface DriverData {
  id: number;
  name: string;
  photo?: string;
  trips: number;
  revenue: number;
  rating: number;
}

export interface RouteData {
  from: string;
  to: string;
  trips: number;
  count: number;
  revenue: number;
}

export interface DeliverySuccessData {
  months: string[];
  delivered: number[];
  failed: number[];
}
