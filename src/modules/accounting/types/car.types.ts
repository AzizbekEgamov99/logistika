export interface Car {
    id?: number;
    name: string;
    number: string;
    year: string;
    engine: string;
    transmission: 'manual' | 'automatic';
    power: string;
    capacity: string;
    fuel: 'benzin' | 'diesel' | 'gas';
    mileage: string;
    holat: 'foal' | 'tamirda' | 'kutmoqda';
    car_number: string;
    photo?: File | string | null;
    driver: number;
    kilometer?: number;
    is_busy?: boolean;
}

export interface CarResponse {
    id: number;
    name: string;
    number: string;
    year: string;
    engine: string;
    transmission: string;
    power: string;
    capacity: string;
    fuel: string;
    mileage: string;
    holat: string;
    car_number: string;
    photo: string | null;
    driver: number;
    kilometer?: number;
    is_busy: boolean;
}

export interface CarStatusSummary {
    in_rays: {
        count: number;
        items: CarResponse[];
    };
    available: {
        count: number;
        items: CarResponse[];
    };
    maintenance?: {
        count: number;
        items: CarResponse[];
    };
    total_count?: number;
}