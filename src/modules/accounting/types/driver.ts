export type DriverStatus = 'driver' | 'Owner' | 'CEO' | 'Bugalter' | 'Zaphos' | 'active' | 'inactive' | 'on_trip' | 'suspended';

export interface DriverType {
    total_rays_usd: number;
    id: number;
    password?: string;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    fullname: string;
    first_name?: string;
    last_name?: string;
    photo: string | null;
    phone_number: string;
    status: DriverStatus;
    date: string;
    passport?: string;
    passport_series: string | null;
    passport_number: string | null;
    passport_issued_by: string | null;
    passport_issued_date: string | null;
    passport_birth_date: string | null;
    passport_photo: string | null;
    license_number?: string;
    license_expiry?: string;
    address?: string;
    is_staff: boolean;
    is_active: boolean;
    is_busy?: boolean;
    groups: any[];
    user_permissions: any[];
    rays_count?: number;
    balance?: number;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    salary?: {
        amount: number;
        currency: string;
        paymentType: string;
    };
    status_updated_at?: string;
}

export interface DriverFilter {
    search?: string;
    status?: string | string[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'ascend' | 'descend' | undefined;
    is_busy?: boolean;
}

export interface DriversResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: DriverType[];
}

export interface Driver {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    birthDate: string;
    joinDate: string;
    status: string;
    avatar: string;
    rating: number;
    completedTrips: number;
    totalRevenue: number;
    documents: {
        id: number;
        type: string;
        number: string;
        issueDate: string;
        expiryDate: string;
        fileUrl?: string;
    }[];
    vehicle?: {
        model: string;
        number: string;
        type: string;
        status: string;
    };
}