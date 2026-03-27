export const formatMoney = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) {
    return '0.00';
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}; 