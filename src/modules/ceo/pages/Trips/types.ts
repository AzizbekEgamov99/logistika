export interface TripData {
  id: number;
  driverName: string;
  driverId: number;
  clientName: string;
  clientId: number;
  vehicleId: number;
  vehicleNumber: string;
  vehicleType: 'Truck' | 'Furgon';
  startLocation: string;
  endLocation: string;
  startDate: Date;
  endDate: Date | null;
  distance: number;
  price: number;
  expense: number;
  profit: number;
  status: 'completed' | 'in_progress' | 'scheduled' | 'cancelled';
  cargo: string;
  cargoWeight: number;
  notes: string | null;
  country?: string;
  rawData?: any; // Original API data
}

export interface DeliverySuccessData {
  months: string[];
  delivered: number[];
  failed: number[];
}

export interface TripStatisticsData {
  totalTrips: number;
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
  avgDistance: number;
} 