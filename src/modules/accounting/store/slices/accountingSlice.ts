import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountingState {
    drivers: number;
    clients: number;
    vehicles: number;
    trips: number;
    income: number;
    expenses: number;
}

const initialState: AccountingState = {
    drivers: 0,
    clients: 0,
    vehicles: 0,
    trips: 0,
    income: 0,
    expenses: 0,
};

const accountingSlice = createSlice({
    name: 'accounting',
    initialState,
    reducers: {
        setDrivers: (state, action: PayloadAction<number>) => {
            state.drivers = action.payload;
        },
        setClients: (state, action: PayloadAction<number>) => {
            state.clients = action.payload;
        },
        setVehicles: (state, action: PayloadAction<number>) => {
            state.vehicles = action.payload;
        },
        setTrips: (state, action: PayloadAction<number>) => {
            state.trips = action.payload;
        },
        setIncome: (state, action: PayloadAction<number>) => {
            state.income = action.payload;
        },
        setExpenses: (state, action: PayloadAction<number>) => {
            state.expenses = action.payload;
        },
    },
});

export const { setDrivers, setClients, setVehicles, setTrips, setIncome, setExpenses } = accountingSlice.actions;
export default accountingSlice.reducer; 