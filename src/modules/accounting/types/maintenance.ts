export interface oilService {
  id?: number
  kilometr: string
  car: number | null
  service: number | null
}
export interface ServiceType {
  id?: number
  name: string
  carModel?: string
  carNumber?: string
  serviceType?: string
  details?: string
  price?: number
  date?: string
  completed?: boolean
  mileage?: number
  carId?: number
}

export interface TehnicalService {
  id?: number;
  price: number | null;
  kilometer: number | null;
  car: number | null;
  service: number | null;
  currency: number | null;
  custom_rate_to_uzs?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface BalonFurgonType {
  // ... your other fields ...
  custom_rate_to_uzs?: number | null;
}