export interface LoginCredentials {
    username: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    fullname: string;
    phone_number: string;
    status: 'ceo' | 'Bugalter' | 'driver' | string;
    date: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
}