export interface Cash {
    id: number;
    client: number;
    client_name: string;
    rays: number;
    rays_id: number;
    product?: number;
    product_name?: string;
    driver: number;
    driver_name: string;
    amount: number;
    currency: string;
    status: CashStatus;
    payment_way: number;
    payment_way_name: string;
    is_confirmed_by_cashier: boolean;
    cashier?: number;
    cashier_name?: string;
    comment?: string;
    is_debt: boolean;
    is_via_driver: boolean;
    is_delivered_to_cashier: boolean;
    total_expected_amount: number;
    paid_amount: number;
    remaining_debt: number;
    custom_rate_to_uzs?: number | string;
    created_at: string;
    updated_at: string;
}

export interface CashCreate {
    id?: number;
    client: number;
    rays: number;
    product?: number;
    driver?: number;
    amount: number;
    currency: number;
    payment_way: number;
    comment?: string;
    is_debt?: boolean;
    is_via_driver?: boolean;
    is_delivered_to_cashier?: boolean;
    total_expected_amount: number;
    paid_amount: number;
    date: string;
    move_type: string;
    payment_type?: string;
    employee?: number;
    custom_rate_to_uzs?: number | string;
    created_at?: string;
}

export interface ClientDebt {
    client__id: number;
    client__first_name: string;
    total_debt: number;
}

export interface ClientDebtDetail {
    client_id: number;
    first_name: string;
    expected_usd: number;
    paid: {
        USD: number;
    };
    total_usd: number;
    remaining_debt_usd: number;
}

export interface CashOverview {
    cashbox: {
        USD: number;
        RUB: number;
        EUR: number;
        UZS: number;
        KZT: number;
        total_in_usd: number;
    };
    expenses: {
        dp_price_usd: number;
        salaries_usd: number;
        total_expenses_usd: number;
    };
    final_balance_usd: number;
}

export interface RaysClient {
    id: number;
    first_name: string;
}

export interface RaysClientsMap {
    rays_id: number;
    clients: RaysClient[];
}

export interface CashCategory {
    id: number;
    name: string;
}

export interface CashHistory {
    currency_name: string;
    id: number;
    amount: number;
    currency: string;
    status: CashStatus;
    custom_rate_to_uzs: number;
    comment: string;
    is_via_driver: boolean;
    is_confirmed_by_cashier: boolean;
    is_delivered_to_cashier: boolean;
    total_expected_amount: number;
    paid_amount: number;
    remaining_debt: number;
    is_debt: boolean;
    created_at: string;
    moved_at: string;
    client: number;
    client_name?: string;
    rays: number | null;
    rays_history: number | null;
    product: number;
    driver: number;
    driver_name?: string;
    payment_way?: any;
    payment_name?: string;
    payment_way_name?: string;
    cashier: number;
}

export interface Currency {
    id: number;
    currency: string;
    rate_to_uzs: string;
    updated_at: string;
}

export type CashStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CashFilter {
    status?: CashStatus;
    client?: number;
    driver?: number;
    rays?: number;
    payment_way?: number;
    is_debt?: boolean;
    is_via_driver?: boolean;
    is_confirmed_by_cashier?: boolean;
    is_delivered_to_cashier?: boolean;
    date_from?: string;
    date_to?: string;
}

export interface CashSummary {
    total_amount: number;
    completed_count: number;
    pending_count: number;
    cancelled_count: number;
    total_count: number;
}

export interface ServiceTotals {
    all_expenses: ServiceRecord[];
    totals_usd: {
        texnic: number;
        balon: number;
        balon_furgon: number;
        chiqimlik: number;
        optol: number;
        total: number;
    };
}

export interface ServiceRecord {
    type: string;
    price: number;
    currency: string;
    usd_value: number;
    car: number;
    car_name: string;
    kilometer: number;
    created_at: string;
} 