/**
 * Format currency amount to Uzbek format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
    .replace('UZS', 'so\'m');
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(num);
};

/**
 * Format date string to display format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Mavjud emas';
  
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch (e) {
    return dateString;
  }
};

/**
 * Get transmission text
 */
export const getTransmissionText = (transmission?: string): string => {
  if (!transmission) return '';
  
  switch(transmission?.toLowerCase()) {
    case 'manual': return 'Mexanika';
    case 'automatic': return 'Avtomat';
    default: return transmission;
  }
};

/**
 * Get fuel type text
 */
export const getFuelText = (fuel?: string): string => {
  if (!fuel) return '';
  
  switch(fuel?.toLowerCase()) {
    case 'benzin': return 'Benzin';
    case 'diesel': return 'Dizel';
    case 'gas': return 'Gaz';
    default: return fuel;
  }
}; 