export interface OptolType {
  id?: number
  price: number
  kilometr: number | null
  car: number | null
  type: string | null
  count: number | null
  currency: number | null
  custom_rate_to_uzs: string | null
  created_at?: string
}

export interface BalonType {
  id?: number
  car_name?: string
  type: string | null
  price: number | null
  kilometr: number | null
  count: number | null
  car: number | null
  currency: number | null
  custom_rate_to_uzs: string | null
  created_at?: string
  completed?: boolean
}

export interface BalonFurgonType {
  id?: number
  type: string | null
  price: number | null
  kilometr: number | null
  count: number | null
  furgon: number | null
  currency: number | null
  custom_rate_to_uzs: string | null
  created_at?: string
  completed?: boolean
}

export interface FurgonType {
  type: string | null
  price: number
  kilometr: number
  count: number
  furgon: number
  currency: number | null
}

export interface ServiceType {
  id?: number
  name: string
  description?: string
  price: number
  currency: number | null
  created_at?: string
}

export interface TehnicalServiceType {
  id?: number
  service: number
  car: number
  price: number
  currency: number | null
  description?: string
  created_at?: string
}
