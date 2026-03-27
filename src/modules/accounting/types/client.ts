export type ClientStatus = 'active' | 'inactive' | 'blocked';
export type ClientType = 'individual' | 'company' | 'government';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface ClientContact {
    name: string;
    position: string;
    phone: string;
    email: string;
    isMain: boolean;
}

export interface ClientPayment {
    id: string;
    amount: number;
    date: string;
    status: PaymentStatus;
    method: string;
    description?: string;
}

export interface ClientContract {
    id: string;
    number: string;
    startDate: string;
    endDate: string;
    amount: number;
    status: 'active' | 'completed' | 'terminated';
    file?: string;
}

export interface Client {
    id?: number;
    first_name: string;
    last_name: string;
    city: string;
    number: string;
    driver: boolean | null;
    created_at?: string;
    updated_at?: string;
    company?: string;
}

export interface ClientFilter {
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface ClientsResponse {
    data: Client[];
    total: number;
}   