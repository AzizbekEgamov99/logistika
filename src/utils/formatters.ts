import moment from 'moment';

export const formatCurrency = (amount: number, currency: string = 'UZS'): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return moment(dateString).format('DD.MM.YYYY HH:mm');
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(number);
}; 