export interface VehicleData {
    id: number;
    name: string;
    plate_number: string;
    model: string;
    type: 'truck' | 'van' | 'car' | 'other';
    status: 'active' | 'maintenance' | 'inactive';
    year: number;
    capacity: number;
    color?: string;
    vin?: string;
    insurance_expiry?: string;
    driver_id?: number;
    driver_name?: string;
    created_at: string;
    updated_at: string;
}

export interface VehicleFilter {
    search?: string;
    page?: number;
    pageSize?: number;
    status?: 'active' | 'maintenance' | 'inactive';
    type?: 'truck' | 'van' | 'car' | 'other';
}

export interface VehicleStatistics {
    total_trips: number;
    total_distance: number;
    fuel_consumption: number;
    maintenance_cost: number;
    utilization_rate: number;
    recent_trips: {
        id: number;
        date: string;
        distance: number;
        driver_name: string;
    }[];
    maintenance_history: {
        id: number;
        date: string;
        description: string;
        cost: number;
    }[];
} 