export interface DriverData {
    id: number;
    username?: string;
    password?: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    phone: string;
    phone_number?: string;
    email?: string;
    photo?: string | null;
    license_number: string;
    license_expiry: string;
    status: 'active' | 'inactive' | 'on_trip';
    address?: string;
    city?: string;
    joining_date: string;
    vehicle_id?: number;
    vehicle_name?: string;
    rating?: number;
    created_at: string;
    updated_at: string;
}

export interface DriverFilter {
    search?: string;
    page?: number;
    pageSize?: number;
    status?: 'active' | 'inactive' | 'on_trip';
}

export interface DriverStatistics {
    total_trips: number;
    completed_trips: number;
    canceled_trips: number;
    total_distance: number;
    total_earnings: number;
    recent_trips: {
        id: number;
        date: string;
        amount: number;
        status: string;
        distance: number;
    }[];
} 