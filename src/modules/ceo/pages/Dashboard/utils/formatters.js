// Currency formatting helper
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + ' B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + ' M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + ' K';
  }
  return value.toLocaleString();
};

// Format percentage
export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

// Format date to local string
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('uz-UZ');
}; 