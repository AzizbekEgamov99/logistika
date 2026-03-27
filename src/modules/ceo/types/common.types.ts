export interface Driver {
  id: number;
  fullname: string;
  phone_number: string;
  phone?: string; // Backward compatibility
  photo: string;
  is_busy: boolean;
  rays_count: number;
  status: string | 'active' | 'inactive' | 'onRoute' | 'onVacation' | 'driver';
  lastActive: Date;
}

export type DriverStatus = 'active' | 'inactive' | 'onRoute' | 'onVacation' | 'driver';

export interface Vehicle {
  id: number;
  type: 'car' | 'furgon';
  name: string;
  number: string;
  status?: string;
  holat?: string;
  photo?: string;
  kilometer?: number;
  description?: string;
  is_busy: boolean;
  driver?: Driver;
}
