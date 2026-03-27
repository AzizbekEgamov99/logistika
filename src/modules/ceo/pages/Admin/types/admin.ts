export type AdminStatus = 'CEO' | 'Bugalter';

export interface Admin {
  id: number;
  username: string;
  fullname: string;
  phone_number: string;
  status: AdminStatus;
  created_at?: string;
}

export interface AdminFormValues {
  username: string;
  password: string;
  fullname: string;
  phone_number: string;
  status: AdminStatus;
} 