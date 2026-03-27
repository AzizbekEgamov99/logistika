export interface RaysResponseType {
  id: number;
  dp_currency_name: string;
  driver: {
    id: number;
    first_name: string;
    last_name: string;
    number: string;
    name?: string;
  };
  car: {
    id: number;
    model: string;
    number: string;
    name: string;
  };
  fourgon: {
    id: number;
    type: string;
    number: string;
    capacity: number;
    name: string;
  };
  created_at: string;
  price: number;
  dr_price: number;
  dp_price: number;
  kilometer: number;
  dp_information: string;
  count: number;
  country: number;
  status: string;
  from1: string;
  to_go: string;
  client_completed?: number[];
  is_completed: boolean;
}
