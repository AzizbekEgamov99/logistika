export enum CarStatus {
    ACTIVE = 'active',
    MAINTENANCE = 'maintenance',
    REPAIR = 'repair',
    WAITING = 'waiting',
    ON_ROUTE = 'onRoute'
}

export type CarType = 'truck' | 'van' | 'car' | 'special';
export type FuelType = 'gasoline' | 'diesel' | 'gas' | 'electric';

export interface CarMaintenance {
    id: string;
    type: 'regular' | 'repair' | 'inspection';
    date: string;
    description: string;
    cost: number;
    nextDate?: string;
    status: 'completed' | 'scheduled' | 'inProgress';
    documents?: string[];
}

export interface CarRoute {
    id: string;
    startLocation: string;
    endLocation: string;
    startDate: string;
    endDate?: string;
    distance: number;
    driver: {
        id: string;
        name: string;
        phone: string;
    };
    status: 'active' | 'completed' | 'cancelled';
    fuelConsumption: number;
}

export interface Car {
    id?: number;
    name: string;
    number: string;
    year: string;
    engine: string;
    transmission: string;
    power: string;
    capacity: string;
    fuel: string;
    mileage: string;
    holat: CarStatus;
    car_number: string;
    photo: string | File | null;
    user: number | null;
    driver:number
}

export interface CarDocument {
    id: string;
    carId: string;
    type: 'registration' | 'insurance' | 'technical_passport' | 'other';
    title: string;
    fileUrl: string;
    fileType: string;
    expiryDate?: string;
    uploadedAt: string;
}

export interface CarNote {
    id: string;
    carId: string;
    text: string;
    type: 'warning' | 'info' | 'general';
    createdBy: string;
    createdAt: string;
}

export interface CarFilter {
    search?: string;
    status?: CarStatus;
    page?: number;
    pageSize?: number;
}

export interface CarsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Car[];
}

export interface CarStats {
    totalCars: number;
    activeCars: number;
    maintenanceCars: number;
    repairCars: number;
    waitingCars: number;
    onRouteCars: number;
} 