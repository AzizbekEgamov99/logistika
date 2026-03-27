export interface RevenueData {
    month: string;
    value: number;
}

export interface DeliveryData {
    month: string;
    completed: number;
    pending: number;
}

export interface DriverData {
    name: string;
    trips: number;
    revenue: string;
    avatar?: string;
}

export interface DeliveryItem {
    id: string;
    from: string;
    to: string;
    status: 'Completed' | 'In Progress' | 'Delayed';
    driver: string;
}

export interface MaintenanceItem {
    truck: string;
    plate: string;
    date: string;
    type: string;
    status: 'Scheduled' | 'Completed' | 'Pending Parts';
}