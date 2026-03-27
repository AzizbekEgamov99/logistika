export type ClientStatus = 'active' | 'inactive' | 'blocked';
export type ClientType = 'individual' | 'company' | 'government';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface ClientContact {
    first_name: string;
    last_name: string;
    city: string;
    number: string;
    driver: null;
    
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
    id: string;
    name: string;
    type: ClientType;
    status: ClientStatus;
    registrationDate: string;
    logo?: string;
    contacts: ClientContact[];
    address: {
        street: string;
        city: string;
        region: string;
        zipCode?: string;
    };
    documents: {
        type: string;
        number: string;
        file?: string;
    }[];
    contracts: ClientContract[];
    payments: ClientPayment[];
    totalRevenue: number;
    rating: number;
    notes?: string;
    company?: string;
}

export interface ClientFilter {
    search?: string;
    status?: ClientStatus;
    type?: ClientType;
    dateRange?: [string, string];
    sortBy?: string;
    sortOrder?: 'ascend' | 'descend';
    page?: number;
    pageSize?: number;
}

export interface ClientListResponse {
    data: Client[];
    total: number;
    page: number;
    pageSize: number;
}