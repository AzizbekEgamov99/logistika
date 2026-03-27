import { KPI, ChartData, DriverPerformance, VehicleEfficiency } from '../types';
import { 
  LineChartOutlined, 
  DollarOutlined, 
  CarOutlined, 
  UserOutlined, 
  PercentageOutlined, 
  ClockCircleOutlined, 
  CheckOutlined
} from '@ant-design/icons';

export const calculateKPIs = (financialData: any): KPI[] => {
  const totalRevenue = financialData.total_revenue || 0;
  const totalExpenses = financialData.total_expenses || 0;
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  
  const revenueChange = financialData.revenue_change || 0;
  const expenseChange = financialData.expense_change || 0;
  const profitChange = financialData.profit_change || 0;
  const deliveryRateChange = financialData.delivery_rate_change || 0;
  
  return [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      changeType: revenueChange >= 0 ? 'success' : 'danger',
      changeText: 'vs. previous period',
      icon: 'DollarOutlined',
      iconBgColor: '#e6f7ff',
      iconColor: '#1890ff'
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      change: expenseChange,
      changeType: expenseChange <= 0 ? 'success' : 'danger', // For expenses, negative change is good
      changeText: 'vs. previous period',
      icon: 'LineChartOutlined',
      iconBgColor: '#fff7e6',
      iconColor: '#fa8c16'
    },
    {
      title: 'Net Profit',
      value: `$${profit.toLocaleString()}`,
      change: profitChange,
      changeType: profitChange >= 0 ? 'success' : 'danger',
      changeText: 'vs. previous period',
      icon: 'DollarOutlined',
      iconBgColor: '#f6ffed',
      iconColor: '#52c41a'
    },
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(2)}%`,
      change: financialData.margin_change || 0,
      changeType: (financialData.margin_change || 0) >= 0 ? 'success' : 'danger',
      changeText: 'vs. previous period',
      icon: 'PercentageOutlined',
      iconBgColor: '#e6fffb',
      iconColor: '#13c2c2'
    },
    {
      title: 'Active Vehicles',
      value: financialData.active_vehicles || 0,
      change: financialData.vehicles_change || 0,
      changeType: (financialData.vehicles_change || 0) >= 0 ? 'success' : 'danger',
      changeText: 'vs. previous period',
      icon: 'CarOutlined',
      iconBgColor: '#fcffe6',
      iconColor: '#7cb305'
    },
    {
      title: 'Delivery Success Rate',
      value: `${(financialData.delivery_success_rate || 0).toFixed(2)}%`,
      change: deliveryRateChange,
      changeType: deliveryRateChange >= 0 ? 'success' : 'danger',
      changeText: 'vs. previous period',
      icon: 'CheckOutlined',
      iconBgColor: '#f9f0ff',
      iconColor: '#722ed1'
    }
  ];
};

export const calculateFinancialMetrics = (financialData: any): ChartData[] => {
  if (!financialData || !financialData.timeline) {
    return [];
  }
  
  return financialData.timeline.map((item: any) => ({
    period: item.period,
    revenue: item.revenue,
    expenses: item.expenses,
    profit: item.revenue - item.expenses,
    deliveries: item.deliveries_completed
  }));
};

export const processDriverPerformance = (driver: any, performanceData: any): DriverPerformance => {
  return {
    id: performanceData.id || driver.id,
    driverId: driver.id,
    driverName: driver.fullname || 'Unknown Driver',
    deliveriesCompleted: performanceData.deliveries_completed || 0,
    onTimeDeliveryRate: performanceData.on_time_delivery_rate || 0,
    customerRating: performanceData.customer_rating || 0,
    revenue: performanceData.generated_revenue || 0,
    photo: driver.photo
  };
};

export const calculateVehicleEfficiency = (cars: any[], efficiencyData: any[]): VehicleEfficiency[] => {
  if (!cars || !efficiencyData) return [];
  
  const vehicleMap = new Map();
  
  // Create a map of vehicle ID to efficiency data
  efficiencyData.forEach((item: any) => {
    vehicleMap.set(item.vehicle_id, item);
  });
  
  return cars.map((car: any) => {
    const efficiency = vehicleMap.get(car.id) || {};
    
    return {
      id: car.id,
      vehicleId: car.id,
      vehicleName: car.name || `Vehicle ${car.id}`,
      fuelEfficiency: efficiency.fuel_efficiency || 0,
      maintenanceCost: efficiency.maintenance_cost || 0,
      distance: efficiency.distance_traveled || 0,
      utilizationRate: efficiency.utilization_rate || 0,
      status: car.status || 'active'
    };
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const getChangeType = (value: number): 'success' | 'danger' | 'secondary' => {
  if (value > 0) return 'success';
  if (value < 0) return 'danger';
  return 'secondary';
};

export const getIconForMetric = (metricName: string) => {
  const iconMap: Record<string, any> = {
    revenue: DollarOutlined,
    expense: LineChartOutlined,
    profit: DollarOutlined,
    margin: PercentageOutlined,
    vehicle: CarOutlined,
    driver: UserOutlined,
    delivery: CheckOutlined,
    time: ClockCircleOutlined
  };
  
  for (const key in iconMap) {
    if (metricName.toLowerCase().includes(key)) {
      return iconMap[key];
    }
  }
  
  return LineChartOutlined; // Default icon
}; 