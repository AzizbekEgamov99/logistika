import { useTopDrivers } from '../../accounting/hooks/useTopDrivers';
import { useTrips } from '../../accounting/hooks/useTrips';
import { useCars } from '../../accounting/hooks/useCars';
import { useFurgons } from '../../accounting/hooks/useFurgon';
import { useClients } from '../../accounting/hooks/useClients';
import { DateRange } from '../types';
import { DashboardDataType, DriverData, RouteData, FinancialData } from '../types/dashboard.types';
import { RaysResponseType } from '../../accounting/types/rays.types';

// Return type that includes trips, cars, and furgons
interface DashboardMetricsResult {
  data: DashboardDataType;
  isLoading: boolean;
  trips: RaysResponseType[];
  cars: any[];
  furgons: any[];
}

// Dashboard uchun ma'lumotlarni tahlil qilish va qayta ishlash
export const useCEODashboardMetrics = (dateRange: DateRange): DashboardMetricsResult => {
  const { data: tripsData = [] } = useTrips();
  const { cars = [] } = useCars();
  const { furgons = [] } = useFurgons();

  const calculateFinancialData = (): FinancialData[] => {
    // Oylar bo'yicha moliyaviy ma'lumotlarni tayyorlash
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun'];
    
    return months.map((month, index) => ({
      period: month,
      revenue: 5000000 + Math.random() * 3000000,
      expenses: 3000000 + Math.random() * 2000000,
      profit: 1500000 + Math.random() * 1500000
    }));
  };

  const calculatePopularRoutes = (): RouteData[] => {
    // Mashhur yo'nalishlarni tayyorlash
    return [
      { from: 'Toshkent', to: 'Samarqand', trips: 15, count: 15, revenue: 25000000 },
      { from: 'Toshkent', to: 'Buxoro', trips: 12, count: 12, revenue: 20000000 },
      { from: 'Toshkent', to: 'Namangan', trips: 10, count: 10, revenue: 15000000 },
      { from: 'Farg\'ona', to: 'Toshkent', trips: 8, count: 8, revenue: 12000000 },
      { from: 'Toshkent', to: 'Nukus', trips: 5, count: 5, revenue: 10000000 }
    ];
  };

  const calculateDriverStats = (): DriverData[] => {
    // Haydovchilar statistikasini tayyorlash
    return [
      { id: 1, name: 'Abdullaev Abror', photo: '', trips: 25, revenue: 45000000, rating: 4.9 },
      { id: 2, name: 'Karimov Jasur', photo: '', trips: 22, revenue: 40000000, rating: 4.8 },
      { id: 3, name: 'Mahmudov Sanjar', photo: '', trips: 20, revenue: 38000000, rating: 4.7 },
      { id: 4, name: 'Toshmatov Javohir', photo: '', trips: 18, revenue: 35000000, rating: 4.6 },
      { id: 5, name: 'Umarov Umid', photo: '', trips: 15, revenue: 30000000, rating: 4.5 }
    ];
  };

  // Mock ma'lumotlardan dashboard ma'lumotlarini tayyorlash
  const calculateDashboardData = (): DashboardDataType => {
    return {
      kpiData: {
        totalRevenue: 150000000,
        totalExpenses: 90000000,
        netProfit: 60000000,
        fleetUtilization: 75,
        revenueTrend: 15,
        expensesTrend: 8,
        profitTrend: 22,
        fleetUtilizationTrend: 5
      },
      financialData: calculateFinancialData(),
      expenses: {
        service: 30000000,
        salary: 45000000,
        other: 15000000
      },
      topClients: [
        { id: 1, name: 'MaxArt Group', totalOrders: 35, totalSpent: 60000000 },
        { id: 2, name: 'Artel Electronics', totalOrders: 30, totalSpent: 55000000 },
        { id: 3, name: 'Uz Auto Motors', totalOrders: 25, totalSpent: 50000000 },
        { id: 4, name: 'Korzinka Supermarket', totalOrders: 20, totalSpent: 40000000 }
      ],
      driverStats: calculateDriverStats(),
      popularRoutes: calculatePopularRoutes()
    };
  };

  return {
    data: calculateDashboardData(),
    isLoading: false,
    trips: tripsData,
    cars,
    furgons
  };
};

const getVehicleEfficiency = (trips: any[], cars: any[], furgons: any[]) => {
  // Avtomobillar samaradorligi
  const carEfficiency = cars.map(car => {
    const carTrips = trips.filter(trip => trip.car.number === car.number);
    const totalKilometers = carTrips.reduce((sum, trip) => sum + trip.kilometer, 0);
    const tripCount = carTrips.length;
    
    // Service xarajatlari (taxmin)
    const serviceCost = totalKilometers * 0.15; // Har 100 km uchun service xarajati (taxmin)
    
    return {
      id: car.id,
      name: car.name || car.model,
      number: car.number,
      totalKilometers,
      tripCount,
      serviceCost,
      efficiency: tripCount > 0 ? totalKilometers / tripCount : 0
    };
  });
  
  // Furgonlar samaradorligi
  const furgonEfficiency = furgons.map(furgon => {
    const furgonTrips = trips.filter(trip => trip.fourgon.number === furgon.number);
    const totalKilometers = furgonTrips.reduce((sum, trip) => sum + trip.kilometer, 0);
    const tripCount = furgonTrips.length;
    
    // Service xarajatlari (taxmin)
    const serviceCost = totalKilometers * 0.2; // Har 100 km uchun service xarajati (taxmin)
    
    return {
      id: furgon.id,
      name: furgon.name || furgon.type,
      number: furgon.number,
      totalKilometers,
      tripCount,
      serviceCost,
      efficiency: tripCount > 0 ? totalKilometers / tripCount : 0
    };
  });
  
  return {
    cars: carEfficiency,
    furgons: furgonEfficiency
  };
};

// Haydovchilar samaradorligini hisoblash
const getDriverPerformance = (trips: any[], drivers: any[]) => {
  return drivers.map(driver => {
    const driverTrips = trips.filter(trip => trip.driver === driver.id);
    const completedTrips = driverTrips.filter(trip => trip.is_completed);
    const totalRevenue = driverTrips.reduce((sum, trip) => sum + trip.price, 0);
    const totalKilometers = driverTrips.reduce((sum, trip) => sum + trip.kilometer, 0);
    
    return {
      id: driver.id,
      driverId: driver.id,
      driverName: driver.fullname,
      photo: driver.photo,
      completedTrips: completedTrips.length,
      totalTrips: driverTrips.length,
      totalRevenue,
      totalKilometers,
      successRate: driverTrips.length > 0 ? (completedTrips.length / driverTrips.length) * 100 : 0,
      // Keyinchalik qo'shimcha ma'lumotlar qo'shish mumkin
      revenuePerTrip: driverTrips.length > 0 ? totalRevenue / driverTrips.length : 0,
      kilometersPerTrip: driverTrips.length > 0 ? totalKilometers / driverTrips.length : 0
    };
  });
};

// Driver va Client o'rtasidagi statistikani olish (Yetkazib berish samaradorligi o'rniga)
const getDriverClientStats = (trips: any[], drivers: any[], clients: any[]) => {
  // Oxirgi 6 oyni olish
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(now.getMonth() - i);
    const monthName = d.toLocaleString('uz-UZ', { month: 'short' });
    months.push({ 
      month: monthName,
      year: d.getFullYear(),
      monthIndex: d.getMonth()
    });
  }
  
  // Driver va Client statistikasini hisoblash
  const driverTrips = drivers.slice(0, 3).map(driver => {
    return months.map(m => {
      return trips.filter(trip => {
        const tripDate = new Date(trip.created_at);
        return tripDate.getMonth() === m.monthIndex && 
               tripDate.getFullYear() === m.year && 
               trip.driver === driver.id;
      }).length;
    });
  });
  
  const clientTrips = (clients || []).slice(0, 3).map(client => {
    return months.map(m => {
      return trips.filter(trip => {
        const tripDate = new Date(trip.created_at);
        return tripDate.getMonth() === m.monthIndex && 
               tripDate.getFullYear() === m.year && 
               trip.client === client.id;
      }).length;
    });
  });
  
  return {
    months: months.map(m => m.month),
    driverStats: driverTrips,
    clientStats: clientTrips,
    driverNames: drivers.slice(0, 3).map(d => d.fullname || `Driver #${d.id}`),
    clientNames: (clients || []).slice(0, 3).map(c => c.fullname || `Client #${c.id}`)
  };
};

// Driver va Client o'rtasidagi samaradorlikni olish (Yetkazib berish ko'rsatkichlari o'rniga)
const getDriverClientPerformance = (trips: any[], drivers: any[], clients: any[]) => {
  // Top 5 driver va client uchun ma'lumotlar
  const driverPerformance = drivers.slice(0, 5).map(driver => {
    const driverTrips = trips.filter(trip => trip.driver === driver.id);
    const completedTrips = driverTrips.filter(t => t.is_completed).length;
    const pendingTrips = driverTrips.filter(t => !t.is_completed).length;
    const totalRevenue = driverTrips.reduce((sum, t) => sum + t.price, 0);
    
    return {
      driverId: driver.id,
      driverName: driver.fullname || `Driver #${driver.id}`,
      completedTrips,
      pendingTrips,
      totalTrips: driverTrips.length,
      totalRevenue
    };
  });
  
  const clientPerformance = (clients || []).slice(0, 5).map(client => {
    const clientTrips = trips.filter(trip => trip.client === client.id);
    const completedTrips = clientTrips.filter(t => t.is_completed).length;
    const pendingTrips = clientTrips.filter(t => !t.is_completed).length;
    const totalSpent = clientTrips.reduce((sum, t) => sum + t.price, 0);
    
    return {
      clientId: client.id,
      clientName: client.fullname || `Client #${client.id}`,
      completedTrips,
      pendingTrips,
      totalTrips: clientTrips.length,
      totalSpent
    };
  });
  
  return {
    driverPerformance,
    clientPerformance
  };
}; 