export interface DriverData {
  fullname: string;
  phone_number: string;
}

export interface VehicleData {
  name: string;
  number: string;
}

export interface RaysCreate {
  driver?: number;
  car?: number;
  fourgon?: number;
  client: number | number[];
  client_completed?: number[];
  driver_data?: DriverData;
  car_data?: VehicleData;
  fourgon_data?: VehicleData;
  price?: number;
  dr_price?: number;
  dp_price?: number;
  dp_currency?: 'USD' | 'UZS' | 'RUB' | 'EUR' | 'KZT';
  dp_information?: string;
  kilometer?: number;
  count?: number;
  is_completed?: boolean;
  country?: number;
}

export interface ProductCreate {
  name: string;
  price: number;
  currency: number;
  count: number;
  description?: string;
  is_busy?: boolean;
  is_delivered?: boolean;
  client?: number;
  from_location?: number;
  to_location?: number;
  is_total_price?: boolean;
  custom_rate_to_uzs?: number | null;
}

export interface Location {
  id: number;
  name: string;
}

export interface FromLocation extends Location {}
export interface ToLocation extends Location {}

export interface FreightDelivery {
  id: number;
  rays: number;
  product: number;
  from_location: Location;
  to_location: Location;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface FreightDeliveryCreate {
  rays: number;
  product: number;
  from_location: number;
  to_location: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
} 