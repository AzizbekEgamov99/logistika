import dayjs from 'dayjs';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (date: string | null): string => {
    if (!date) return '-';
    return dayjs(date).format('DD.MM.YYYY');
};

export const formatNumber = (number: number) => {
    return new Intl.NumberFormat('uz-UZ').format(number);
};

export const formatDistance = (km: number) => {
    return `${formatNumber(km)} km`;
};

export const formatFuel = (liters: number) => {
    return `${formatNumber(liters)} l`;
}; 