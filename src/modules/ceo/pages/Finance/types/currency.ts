export interface Currency {
  id: number;
  currency: string;
  rate_to_uzs: string;
  updated_at: string;
}

export interface CurrencyFormValues {
  currency: string;
  rate_to_uzs: string;
} 