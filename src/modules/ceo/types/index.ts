export interface RevenueMetric {
  id: number;
  period: string;
  amount: number;
  change: number;
  changePercentage: number;
}

export interface ExpenseMetric {
  id: number;
  period: string;
  amount: number;
  change: number;
  changePercentage: number;
}

export interface ProfitMetric {
  id: number;
  period: string;
  amount: number;
  change: number;
  changePercentage: number;
  margin: number;
}

export interface DriverPerformance {
  id: number;
  driverId: number;
  driverName: string;
  deliveriesCompleted: number;
  onTimeDeliveryRate: number;
  customerRating: number;
  revenue: number;
  photo?: string | null;
}

export interface VehicleEfficiency {
  id: number;
  vehicleId: number;
  vehicleName: string;
  fuelEfficiency: number;
  maintenanceCost: number;
  distance: number;
  utilizationRate: number;
  status: 'active' | 'maintenance' | 'retired';
}

export interface DeliveryMetrics {
  period: string;
  completed: number;
  pending: number;
  late: number;
  successRate: number;
}

export interface KPI {
  title: string;
  value: number | string;
  change: number;
  changeType: 'success' | 'danger' | 'secondary';
  changeText?: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export interface ChartData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export type DateRangeType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
  type: DateRangeType;
}

export interface DashboardFilters {
  dateRange: DateRange;
  showInactive?: boolean;
  regions?: string[];
  vehicleTypes?: string[];
}

export interface DeliverySummaryData {
  months: string[];
  completed: number[];
  pending: number[];
}

export interface DeliverySuccessData {
  months: string[];
  delivered: number[];
  failed: number[];
}

export interface ExpenseItem {
  name: string;
  value: number;
  percentage?: number;
}

export interface VehicleData {
  id: number;
  name: string;
  number: string;
  totalKilometers: number;
  tripCount: number;
  efficiency: number;
  serviceCost: number;
} 