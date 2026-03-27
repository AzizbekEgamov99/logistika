import { useQuery } from '@tanstack/react-query';
import { KPI, ChartData, DateRange, DriverPerformance, VehicleEfficiency } from '../types';
import { useTrips } from '../../accounting/hooks/useTrips';
import { useTopDrivers } from '../../accounting/hooks/useTopDrivers';
import { useCars } from '../../accounting/hooks/useCars';

// Demo data for development purposes
const generateDemoData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate KPIs
  const kpis: KPI[] = [
    {
      title: 'Total Revenue',
      value: '$482,580',
      change: 12.5,
      changeType: 'success',
      changeText: 'vs. previous period',
      icon: 'DollarOutlined',
      iconBgColor: '#e6f7ff',
      iconColor: '#1890ff'
    },
    {
      title: 'Total Expenses',
      value: '$285,320',
      change: -3.8,
      changeType: 'success',
      changeText: 'vs. previous period',
      icon: 'LineChartOutlined',
      iconBgColor: '#fff7e6',
      iconColor: '#fa8c16'
    },
    {
      title: 'Net Profit',
      value: '$197,260',
      change: 24.6,
      changeType: 'success',
      changeText: 'vs. previous period',
      icon: 'DollarOutlined',
      iconBgColor: '#f6ffed',
      iconColor: '#52c41a'
    },
    {
      title: 'Profit Margin',
      value: '40.88%',
      change: 8.2,
      changeType: 'success',
      changeText: 'vs. previous period',
      icon: 'PercentageOutlined',
      iconBgColor: '#e6fffb',
      iconColor: '#13c2c2'
    },
    {
      title: 'Active Vehicles',
      value: '42',
      change: 4.8,
      changeType: 'success',
      changeText: 'vs. previous period',
      icon: 'CarOutlined',
      iconBgColor: '#fcffe6',
      iconColor: '#7cb305'
    },
    {
      title: 'Delivery Success Rate',
      value: '98.2%',
      change: 1.5,
      changeType: 'success',
      changeText: 'vs. previous period',
      icon: 'CheckOutlined',
      iconBgColor: '#f9f0ff',
      iconColor: '#722ed1'
    }
  ];
  
  // Generate time series data
  const timeSeriesData: ChartData[] = [];
  const periodsCount = 12;
  
  for (let i = 0; i < periodsCount; i++) {
    const monthIndex = (currentMonth - periodsCount + i + 12) % 12;
    timeSeriesData.push({
      period: months[monthIndex],
      revenue: 30000 + Math.random() * 25000 + (i * 3000),
      expenses: 15000 + Math.random() * 15000 + (i * 1500),
      profit: 10000 + Math.random() * 10000 + (i * 1500),
      deliveries: 80 + Math.floor(Math.random() * 100),
    });
  }
  
  return {
    kpis,
    timeSeriesData
  };
};

const generateDemoDrivers = (): DriverPerformance[] => {
  const names = ['John Davis', 'Michael Smith', 'Robert Johnson', 'David Miller', 'James Wilson', 'Thomas Taylor', 'Daniel Anderson', 'Paul Martinez', 'Mark Robinson', 'Steven Clark'];
  
  return names.map((name, index) => {
    const deliveriesCompleted = 50 + Math.floor(Math.random() * 200);
    const onTimeRate = 75 + Math.random() * 25;
    const rating = 3.5 + Math.random() * 1.5;
    return {
      id: index + 1,
      driverId: index + 1,
      driverName: name,
      deliveriesCompleted,
      onTimeDeliveryRate: onTimeRate,
      customerRating: rating,
      revenue: deliveriesCompleted * (500 + Math.random() * 500),
      photo: null
    };
  });
};

const generateDemoVehicles = (): VehicleEfficiency[] => {
  const vehicles = ['Truck #1', 'Truck #2', 'Truck #3', 'Truck #4', 'Truck #5', 'Van #1', 'Van #2', 'Truck #6', 'Truck #7', 'Van #3', 'Truck #8', 'Truck #9'];
  
  return vehicles.map((name, index) => {
    return {
      id: index + 1,
      vehicleId: index + 1,
      vehicleName: name,
      fuelEfficiency: 6 + Math.random() * 6,
      maintenanceCost: 1200 + Math.random() * 4000,
      distance: 5000 + Math.random() * 20000,
      utilizationRate: 60 + Math.random() * 35,
      status: Math.random() > 0.8 ? 'maintenance' : Math.random() > 0.9 ? 'retired' : 'active'
    };
  });
};

const generateDemoDeliveries = (): ChartData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const data: ChartData[] = [];
  
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - 6 + i + 12) % 12;
    const completed = 80 + Math.floor(Math.random() * 100);
    const pending = 5 + Math.floor(Math.random() * 20);
    const late = 1 + Math.floor(Math.random() * 10);
    const total = completed + pending + late;
    
    data.push({
      period: months[monthIndex],
      completed,
      pending,
      late,
      successRate: (completed / total) * 100
    });
  }
  
  return data;
};

export const useDashboardMetrics = (dateRange: DateRange) => {
  return useQuery<{
    kpis: KPI[];
    timeSeriesData: ChartData[];
  }>({
    queryKey: ['dashboardMetrics', dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      try {
        // In a real app, this would make an API call
        // For demo, we're using mock data
        return generateDemoData(dateRange);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTopPerformingDrivers = () => {
  const { data: topDrivers } = useTopDrivers();
  const { data: trips } = useTrips();
  
  return useQuery<DriverPerformance[]>({
    queryKey: ['topPerformingDrivers'],
    queryFn: async () => {
      try {
        // In a real app, this would integrate with the real data
        // For demo purposes, we'll use mock data
        return generateDemoDrivers();
      } catch (error) {
        console.error('Error fetching top drivers:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useVehicleEfficiencyMetrics = () => {
  
  return useQuery<VehicleEfficiency[]>({
    queryKey: ['vehicleEfficiency'],
    queryFn: async () => {
      try {
        // In a real app, this would integrate with the real data
        // For demo purposes, we'll use mock data
        return generateDemoVehicles();
      } catch (error) {
        console.error('Error fetching vehicle efficiency:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useDeliverySuccessRates = (dateRange: DateRange) => {
  return useQuery<ChartData[]>({
    queryKey: ['deliverySuccessRates', dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      try {
        // In a real app, this would integrate with the real data
        // For demo purposes, we'll use mock data
        return generateDemoDeliveries();
      } catch (error) {
        console.error('Error fetching delivery success rates:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}; 