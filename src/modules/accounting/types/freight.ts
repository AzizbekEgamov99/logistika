export interface Car {
  id: string
  model: string
  number: string
}

export interface Furgon {
  id: string
  type: string
  number: string
  capacity: number
}

export interface DriverType {
  id: string
  name: string
  phone: string
  licenseNumber: string
}

export interface Client {
  id: string
  name: string
  phone: string
  company?: string
}

export interface ClientCompletedType {
  first_name: string;
  number: string;
}

export interface CarInfo {
  name: string;
  number: string;
}

export interface FourgonInfo {
  name: string;
  number: string;
}

export interface ClientChoice {
  id: string | number;
  price: string | number;
  address: string;
}

export interface raysType {
  driver: string | number;
  car: string | number;
  fourgon: string | number;
  client: ClientChoice[];
  price: string | number;
  dr_price: string | number;
  dp_price: string | number;
  from1: string;
  to_go: string;
  kilometer: string | number;
  dp_information: string;
  is_completed: boolean;
  count: string | number;
  country?: string | number;
  client_completed: (string | number)[];
}

export interface RaysResponseType {
  id: number;
  driver: {
    id: number;
    fullname: string;
    phone: string;
  };
  car: {
    name: string;
    id: number;
    model: string;
    number: string;
  };
  fourgon: {
    name: string;
    id: number;
    type: string;
    number: string;
    capacity: number;
  };
  client: {
    id: number;
    name: string;
    company: string;
    phone: string;
    price: number;
    address: string;
    is_completed: boolean;
    first_name?: string;
    number?: string;
  }[];
  created_at: string;
  updated_at: string;
  is_completed: boolean;
  total_price: number;
  completion_percentage: number;
  dp_information: string;
  count: number;
  country: number;
  price: number;
  dr_price: number;
  dp_price: number;
  dp_currency?: string;
  kilometer: number;
  from1: string;
  to_go: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TripFormValues {
  id: number;
  driver: {
    id: number;
    name: string;
    phone: string;
  };
  car: {
    id: number;
    model: string;
    number: string;
  };
  fourgon: {
    id: number;
    type: string;
    number: string;
    capacity: number;
  };
  client: {
    id: number;
    name: string;
    company: string;
    phone: string;
    price: number;
    address: string;
    is_completed: boolean;
  }[];
  created_at: string;
  updated_at: string;
  is_completed: boolean;
  total_price: number;
  completion_date?: string;
}

// Status info for statistics
export interface TripStatusInfo {
  active: number;  // Active trips count
  completed: number; // Completed trips count
  total: number;   // Total trips count
  completionRate: number; // Percentage of completed trips
}

// For filtering trips
export interface TripFilters {
  status?: 'active' | 'completed' | 'all';
  startDate?: string;
  endDate?: string;
  driverId?: number;
  carId?: number;
  fourgonId?: number;
  clientId?: number;
}

// Destination info
export interface Destination {
  address: string;
  clientName: string;
  clientId: number;
  price: number;
  isCompleted: boolean;
}