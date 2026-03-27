export interface Vehicle {
  id: number;
  key?: string;
  name?: string;
  car_number?: string;
  number?: string;
  year?: number;
  engine?: string;
  transmission?: string;
  power?: string;
  capacity?: string;
  fuel?: string;
  kilometer?: number;
  mileage?: number;
  holat?: string;
  is_busy?: boolean;
  photo?: string;
  description?: string;
}

export interface VehicleFormValues {
  name: string;
  number: string;
  year: number;
  engine?: string;
  transmission?: string;
  power?: string;
  capacity?: string;
  fuel?: string;
  mileage?: number;
  kilometer?: number;
  holat?: string;
  photo?: File;
}

export interface CarFormValues extends VehicleFormValues {
  car_number: string;
}

export interface FurgonFormValues extends VehicleFormValues {
  // Any furgon-specific fields here
}

export interface VehicleStatusSummary {
  totalVehicles: number;
  cars: Vehicle[];
  furgons: Vehicle[];
  activeCars: number;
  activeFurgons: number;
  availableCars: number;
  availableFurgons: number;
  activePercent: number;
  availablePercent: number;
}

export interface FilterValues {
  search?: string;
  status?: string;
  vehicleType?: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface VehicleTypeOption {
  value: string;
  label: string;
}

export interface VehicleType {
  id: number;
  nomi: string;
  davlat_raqami: string;
  model?: string;
  haydovchi?: number | null;
  kilometer?: number;
  ishlab_chiqarilgan_yil?: string;
  holat?: string;
  type: 'car' | 'furgon';
  status: 'active' | 'available' | 'maintenance';
  driverName: string;
  tripCount: number;
  totalRevenue: number;
  history: Array<{
    date: Date;
    type: string;
    description: string;
    isCompleted?: boolean;
    details: {
      distance?: number;
      revenue?: number;
      client?: string;
      cost?: number;
      parts?: string;
    };
  }>;
  performanceScore: number;
} 