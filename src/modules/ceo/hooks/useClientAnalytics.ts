import { useMemo } from 'react';
import { useClients } from '../../accounting/hooks/useClients';
import { useTrips } from '../../accounting/hooks/useTrips';
import { Client } from '../../accounting/types/client';

interface ClientAnalytics {
  topClients: any[];
  clientsByRevenue: any[];
  clientsByActivity: any[];
  clientsByCity: any[];
  yearlyTrend: any[];
  monthlyTrend: any[];
  totalRevenue: number;
  activeClientCount: number;
  inactiveClientCount: number;
  totalClients: number;
  activeTripsCount: number;
  completedTripsCount: number;
  averageRevenuePerClient: number;
}

export const useClientAnalytics = (filters?: any): { data: ClientAnalytics; isLoading: boolean } => {
  const { data: clientsData, isLoading: isClientsLoading } = useClients();
  const { data: tripsData = [], isLoading: isTripsLoading } = useTrips();

  const analytics = useMemo(() => {
    if (!clientsData?.data || !tripsData || isClientsLoading || isTripsLoading) {
      return {
        topClients: [],
        clientsByRevenue: [],
        clientsByActivity: [],
        clientsByCity: [],
        yearlyTrend: [],
        monthlyTrend: [],
        totalRevenue: 0,
        activeClientCount: 0,
        inactiveClientCount: 0,
        totalClients: 0,
        activeTripsCount: 0,
        completedTripsCount: 0,
        averageRevenuePerClient: 0
      };
    }

    const clients = clientsData.data || [];
    const trips = tripsData || [];

    // Client revenue mapping
    const clientRevenue: Record<number, number> = {};
    const clientTrips: Record<number, any[]> = {};
    const clientActivity: Record<number, Date | null> = {};
    const cityCounts: Record<string, number> = {};

    // Calculate metrics for each client
    clients.forEach(client => {
      const id = client.id || 0;
      clientRevenue[id] = 0;
      clientTrips[id] = [];
      clientActivity[id] = null;
      
      // Track cities for distribution
      const city = client.city;
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    // Process trips
    trips.forEach(trip => {
      if (trip.client && trip.price) {
        const clientId = trip.client;
        
        // Add to client revenue
        clientRevenue[clientId] = (clientRevenue[clientId] || 0) + trip.price;
        
        // Add to client trips
        if (!clientTrips[clientId]) {
          clientTrips[clientId] = [];
        }
        clientTrips[clientId].push(trip);
        
        // Update last activity
        const tripDate = new Date(trip.created_at);
        if (!clientActivity[clientId] || tripDate > clientActivity[clientId]) {
          clientActivity[clientId] = tripDate;
        }
      }
    });

    // Monthly trend data
    const monthlyData: Record<string, number> = {};
    const currentDate = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(currentDate);
      d.setMonth(currentDate.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlyData[monthKey] = 0;
    }

    // Fill monthly data
    trips.forEach(trip => {
      const tripDate = new Date(trip.created_at);
      if (tripDate) {
        const monthKey = `${tripDate.getFullYear()}-${tripDate.getMonth() + 1}`;
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey] += trip.price || 0;
        }
      }
    });

    // Convert to array format for charts
    const monthlyTrend = Object.entries(monthlyData).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: new Date(year, month - 1).toLocaleString('uz-UZ', { month: 'short' }),
        revenue: value,
        year
      };
    });

    // Yearly trend
    const yearlyData: Record<number, number> = {};
    trips.forEach(trip => {
      const tripDate = new Date(trip.created_at);
      if (tripDate) {
        const year = tripDate.getFullYear();
        yearlyData[year] = (yearlyData[year] || 0) + (trip.price || 0);
      }
    });

    const yearlyTrend = Object.entries(yearlyData)
      .map(([year, revenue]) => ({ year: Number(year), revenue }))
      .sort((a, b) => a.year - b.year);

    // Get top clients by revenue
    const topClients = clients
      .map(client => {
        const id = client.id || 0;
        return {
          ...client,
          revenue: clientRevenue[id] || 0,
          tripCount: clientTrips[id]?.length || 0,
          lastActivity: clientActivity[id]
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Clients by revenue (for distribution chart)
    const clientsByRevenue = clients
      .map(client => {
        const id = client.id || 0;
        return {
          id,
          name: `${client.first_name} ${client.last_name}`,
          revenue: clientRevenue[id] || 0
        };
      })
      .filter(client => client.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Clients by activity (recent activity)
    const clientsByActivity = clients
      .map(client => {
        const id = client.id || 0;
        return {
          ...client,
          tripCount: clientTrips[id]?.length || 0,
          lastActivity: clientActivity[id]
        };
      })
      .filter(client => client.lastActivity !== null)
      .sort((a, b) => {
        if (!a.lastActivity) return 1;
        if (!b.lastActivity) return -1;
        return (b.lastActivity as Date).getTime() - (a.lastActivity as Date).getTime();
      })
      .slice(0, 10);
    
    // Clients by city
    const clientsByCity = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
    
    // Overall metrics
    const totalRevenue = Object.values(clientRevenue).reduce((sum, rev) => sum + rev, 0);
    
    const activeClientCount = clients.filter(client => {
      const id = client.id || 0;
      return clientTrips[id]?.some(trip => !trip.is_completed) || false;
    }).length;
    
    const inactiveClientCount = clients.length - activeClientCount;
    const totalClients = clients.length;
    
    const activeTripsCount = trips.filter(trip => !trip.is_completed).length;
    const completedTripsCount = trips.filter(trip => trip.is_completed).length;
    
    const averageRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0;
    
    return {
      topClients,
      clientsByRevenue,
      clientsByActivity,
      clientsByCity,
      yearlyTrend,
      monthlyTrend,
      totalRevenue,
      activeClientCount,
      inactiveClientCount,
      totalClients,
      activeTripsCount,
      completedTripsCount,
      averageRevenuePerClient
    };
  }, [clientsData, tripsData, isClientsLoading, isTripsLoading]);

  return {
    data: analytics,
    isLoading: isClientsLoading || isTripsLoading
  };
}; 