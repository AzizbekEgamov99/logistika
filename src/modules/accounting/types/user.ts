export interface User {
    id: number;
    username: string;
    fullname: string;
    photo?: string;
    phone_number?: string;
    status: UserStatus;
    date: string;
    passport_series?: string;
    passport_number?: string;
    passport_issued_by?: string;
    passport_issued_date?: string;
    passport_birth_date?: string;
    passport_photo?: string;
    is_staff: boolean;
    is_active: boolean;
    groups: number[];
    user_permissions: number[];
}

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending' | 'deleted';

export interface UserFilter {
    search?: string;
    status?: UserStatus;
    date_from?: string;
    date_to?: string;
    is_active?: boolean;
    page?: number;
    pageSize?: number;
}

export interface UserResponse {
    data: User[];
    total: number;
    page: number;
    pageSize: number;
}

export interface CreateUserDto {
    username: string;
    password: string;
    fullname: string;
    phone_number?: string;
    status?: UserStatus;
    passport_series?: string;
    passport_number?: string;
    passport_issued_by?: string;
    passport_issued_date?: string;
    passport_birth_date?: string;
    is_staff?: boolean;
    is_active?: boolean;
    groups?: number[];
    user_permissions?: number[];
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
    password?: string;
} 