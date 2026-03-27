/**
 * Formats currency values based on the currency type
 * @param amount - The amount to format
 * @param currencyType - The currency type (USD, UZS, or any other code)
 * @param showSymbol - Whether to show the currency symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount?: number | null,
  currencyType: string = 'USD',
  showSymbol: boolean = true
): string => {
  if (amount === undefined || amount === null) return "0";
  
  // Format based on currency type
  switch (currencyType.toUpperCase()) {
    case 'USD':
      return `${showSymbol ? '$' : ''}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`;
    
    case 'UZS':
      return `${amount.toLocaleString('uz-UZ')}${showSymbol ? ' so\'m' : ''}`;
    
    default:
      // For any other currency, use the passed currency type as suffix
      return `${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}${showSymbol ? ` ${currencyType}` : ''}`;
  }
};

/**
 * Determines if a price is in USD based on the field name or currency indicator
 * @param fieldName - The field name to check
 * @param currencyIndicator - Optional currency indicator from API
 * @returns Boolean indicating if price is in USD
 */
export const isUsdPrice = (
  fieldName: string,
  currencyIndicator?: string | null
): boolean => {
  // If currency indicator is provided, use that
  if (currencyIndicator) {
    return currencyIndicator.toUpperCase() === 'USD';
  }
  
  // Otherwise, infer from field name
  const usdFields = ['price', 'dr_price', 'expected_usd', 'paid_usd', 'remaining_usd', 'total_usd'];
  
  // Check if field name is in USD fields list or has 'usd' in the name
  return usdFields.includes(fieldName.toLowerCase()) || 
         fieldName.toLowerCase().includes('usd');
};

/**
 * Format price with appropriate currency formatting based on field name or specified currency
 * @param amount - The amount to format
 * @param fieldName - Field name to infer currency type if not specified
 * @param currencyType - Optional explicit currency type
 * @returns Formatted price string
 */
export const formatPrice = (
  amount?: number | null,
  fieldName: string = '',
  currencyType?: string | null
): string => {
  if (amount === undefined || amount === null) return "0";
  
  // Determine currency type
  let currency = currencyType || (isUsdPrice(fieldName) ? 'USD' : 'UZS');
  
  return formatCurrency(amount, currency);
};

export default formatCurrency; 