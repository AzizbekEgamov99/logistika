export interface CashTransaction {
  id: number;
  client: number;
  client_name: string;
  rays?: number;
  rays_id?: number;
  product?: number;
  product_name?: string;
  driver?: number;
  driver_name?: string;
  amount: number;
  currency: 'UZS' | 'USD' | 'RUB' | 'EUR';
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_way?: number;
  payment_way_name?: string;
  is_confirmed_by_cashier: boolean;
  cashier?: number;
  cashier_name?: string;
  comment?: string;
  is_debt: boolean;
  is_via_driver: boolean;
  is_delivered_to_cashier: boolean;
  total_expected_amount?: number;
  paid_amount?: number;
  remaining_debt?: number;
  created_at: string;
}

export interface CashTransactionCreate {
  client: number;
  rays?: number;
  product?: number;
  driver?: number;
  amount: number;
  currency: 'UZS' | 'USD' | 'RUB' | 'EUR';
  payment_way?: number;
  comment?: string;
  is_debt: boolean;
  is_via_driver: boolean;
  is_delivered_to_cashier: boolean;
  total_expected_amount?: number;
  paid_amount?: number;
}

export interface CashTransactionFilter {
  client?: number;
  rays?: number;
  product?: number;
  driver?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  payment_way?: number;
  is_debt?: boolean;
  is_via_driver?: boolean;
  is_delivered_to_cashier?: boolean;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface RaysClientsMap {
  rays_id: number;
  clients: {
    id: number;
    first_name: string;
  }[];
} 