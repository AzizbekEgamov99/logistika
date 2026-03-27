import { DriverFilter } from '../types/driver';

export const INITIAL_FILTER: DriverFilter = {
    page: 1,
    pageSize: 10,
    search: '',
    status: undefined,
    sortBy: undefined,
    sortOrder: undefined,
};

export const DRIVER_STATUS_OPTIONS = [
    { label: 'Barchasi', value: 'all' },
    { label: 'Faol', value: 'active' },
    { label: 'Faol emas', value: 'inactive' },
    { label: 'Yo`lda', value: 'onRoute' },
    { label: 'Ta`tilda', value: 'onVacation' },
];

export const DRIVER_DOCUMENT_TYPES = [
    { label: 'Haydovchilik guvohnomasi', value: 'license' },
    { label: 'Passport', value: 'passport' },
    { label: 'Tibbiy ma`lumotnoma', value: 'medical' },
    { label: 'Boshqa', value: 'other' },
]; 