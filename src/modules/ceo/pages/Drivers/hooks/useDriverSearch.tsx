import { useState, useCallback } from 'react';

interface DriverFilters {
  search?: string;
  status?: string;
  is_busy?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const useDriverSearch = (initialFilters: DriverFilters, onFiltersChange: (filters: DriverFilters) => void) => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<DriverFilters>(initialFilters);

  const handleSearch = useCallback((value: string) => {
    // Store the original search value for name/phone searches
    const originalSearchValue = value;
    const lowerCaseValue = value.toLowerCase();

    // First check if it's a known status keyword
    const isStatusSearch =
      lowerCaseValue === 'kutishda' ||
      lowerCaseValue === 'kutish' ||
      lowerCaseValue === "yo'lda" ||
      lowerCaseValue === 'yolda';

    // Extract name/phone part from combined searches
    // e.g., "asadbek yo'lda" -> name="asadbek", status="yo'lda"
    let nameSearch = '';
    let statusFilter = filters.status;
    let isBusyValue = undefined;

    if (
      lowerCaseValue.includes('kutishda') ||
      lowerCaseValue.includes('kutish')
    ) {
      // Extract name part before status keyword
      nameSearch = value.split(/(kutishda|kutish)/i)[0].trim();
      statusFilter = 'driver';
      isBusyValue = false;
    } else if (
      lowerCaseValue.includes("yo'lda") ||
      lowerCaseValue.includes('yolda')
    ) {
      // Extract name part before status keyword
      nameSearch = value.split(/(yo'lda|yolda)/i)[0].trim();
      statusFilter = 'driver';
      isBusyValue = true;
    }
    // If it's just a plain status keyword without a name
    else if (isStatusSearch) {
      if (lowerCaseValue === 'kutishda' || lowerCaseValue === 'kutish') {
        statusFilter = 'driver';
        isBusyValue = false;
      } else if (lowerCaseValue === "yo'lda" || lowerCaseValue === 'yolda') {
        statusFilter = 'driver';
        isBusyValue = true;
      }
    }
    // Regular name/phone search
    else {
      nameSearch = value;
    }

    // Update search text in UI
    setSearchText(value);

    // Set the filters with appropriate values
    const newFilters = {
      ...filters,
      search: nameSearch || originalSearchValue, // Use extracted name or original input
      status: statusFilter,
      is_busy: isBusyValue,
      page: 1, // Reset to first page on new search
    };
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const updateFilters = useCallback((newFilters: Partial<DriverFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  return {
    searchText,
    filters,
    handleSearch,
    updateFilters
  };
}; 