export interface DriverSalary {
    id: number;
    driver: number;
    driver_name?: string;
    amount: string | number;
    currency?: string;
    currency_name?: string;
    custom_rate_to_uzs?: number | null;
    paid_at?: string;
    title?: string;
    comment?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DriverSalaryCreate {
    driver: number;
    amount: number;
    currency?: string;
    custom_rate_to_uzs?: number;
    title?: string;
    comment?: string;
}

export interface DriverSalaryFilter {
    driver?: number;
    start_date?: string;
    end_date?: string;
    page?: number;
    pageSize?: number;
    search?: string;
} 