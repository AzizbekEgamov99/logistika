export interface ClientData {
    id: number;
    first_name: string;
    last_name: string;
    company: string | null;
    city: string;
    number: string;
    email?: string;
    driver: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClientFilter {
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface ClientAnalytics {
    total_trips: number;
    completed_trips: number;
    canceled_trips: number;
    revenue: number;
    recent_trips: {
        id: number;
        date: string;
        amount: number;
        status: string;
    }[];
} 