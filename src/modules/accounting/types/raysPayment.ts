export interface RaysPaymentCreate {
    rays: number;
    amount: number;
    currency?: string;
    custom_rate_to_uzs?: number;
    payment_way?: number;
    comment?: string;
    is_debt?: boolean;
} 