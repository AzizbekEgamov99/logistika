import { useState, useEffect } from 'react';
import { TripData } from '../types';

export const useTripsFilters = (
  trips: TripData[],
  filteredTrips: TripData[],
  updateDisplayTrips: (trips: TripData[], page: number, size: number) => void
) => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle pagination change
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    const newSize = size || pageSize;
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    updateDisplayTrips(filteredTrips, page, newSize);
  };

  // Filter trips based on search text, date range, and status
  useEffect(() => {
    if (!trips || trips.length === 0) return;
    
    let filtered = [...trips];

    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          (trip.driverName && trip.driverName.toLowerCase().includes(lowerSearchText)) ||
          (trip.clientName && trip.clientName.toLowerCase().includes(lowerSearchText)) ||
          (trip.vehicleNumber && trip.vehicleNumber.toLowerCase().includes(lowerSearchText)) ||
          (trip.startLocation && trip.startLocation.toLowerCase().includes(lowerSearchText)) ||
          (trip.endLocation && trip.endLocation.toLowerCase().includes(lowerSearchText)) ||
          (trip.country && trip.country.toLowerCase().includes(lowerSearchText)) ||
          String(trip.id).includes(lowerSearchText)
      );
    }

    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter((trip) => {
        const tripDate = new Date(trip.startDate);
        return tripDate >= start && tripDate <= end;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((trip) => trip.status === statusFilter);
    }

    if (vehicleFilter !== 'all') {
      filtered = filtered.filter((trip) => trip.vehicleType === vehicleFilter);
    }

    // Return the filtered results to the parent component
    updateDisplayTrips(filtered, 1, pageSize);
    
    // Reset to first page on filter change
    setCurrentPage(1);
  }, [trips, searchText, dateRange, statusFilter, vehicleFilter, pageSize, updateDisplayTrips]);

  return {
    searchText,
    dateRange,
    statusFilter,
    vehicleFilter,
    currentPage,
    pageSize,
    setSearchText,
    setDateRange,
    setStatusFilter,
    setVehicleFilter,
    setCurrentPage,
    setPageSize,
    handlePaginationChange
  };
}; 