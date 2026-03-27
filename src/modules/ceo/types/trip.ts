export interface TripData {
    id: number;
    start_date: string;
    end_date: string | null;
    pickup_location: string;
    delivery_location: string;
    distance: number;
    status: 'pending' | 'in_progress' | 'completed' | 'canceled';
    cost: number;
    payment_status: 'paid' | 'unpaid' | 'partial';
    driver_id: number;
    driver_name: string;
    vehicle_id: number;
    vehicle_name: string;
    client_id: number;
    client_name: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface TripFilter {
    search?: string;
    page?: number;
    pageSize?: number;
    status?: 'pending' | 'in_progress' | 'completed' | 'canceled';
    startDate?: string;
    endDate?: string;
    driverId?: number;
    vehicleId?: number;
    clientId?: number;
}

export interface TripStatistics {
    total_trips: number;
    completed_trips: number;
    canceled_trips: number;
    in_progress_trips: number;
    pending_trips: number;
    total_revenue: number;
    total_distance: number;
    avg_trip_distance: number;
    avg_trip_cost: number;
    revenue_by_period: {
        period: string;
        value: number;
    }[];
    trips_by_status: {
        status: string;
        count: number;
    }[];
}

export interface TripStats {
    totalTrips: number;
    completedTrips: number;
    activeTrips: number;
    cancelledTrips: number;
    totalDistance: number;
    totalRevenue: number;
    averageDistance: number;
    mostCommonRoutes: {
        origin: string;
        destination: string;
        count: number;
        revenue: number;
    }[];
} 