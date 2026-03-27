import { useTrips, useCompleteTrip, TripData } from './useTrips';
import { useHistoryTrips, useReactivateTrip } from './useHistoryTrips';

// Main hook to handle all rays/trips functionality
export const useRays = () => {
  // Get active trips
  const { 
    data: activeTrips = [], 
    isLoading: isLoadingActive, 
    error: activeError
  } = useTrips();
  
  // Get history trips
  const { 
    data: historyTrips = [], 
    isLoading: isLoadingHistory, 
    error: historyError
  } = useHistoryTrips();
  
  // Get trip actions
  const completeTrip = useCompleteTrip();
  const reactivateTrip = useReactivateTrip();
  
  // Total count calculations
  const totalTrips = activeTrips.length + historyTrips.length;
  const activeTripsCount = activeTrips.length;
  const historyTripsCount = historyTrips.length;
  
  // All trips combined
  const allTrips = [...activeTrips, ...historyTrips];
  
  // Check if loading
  const isLoading = isLoadingActive || isLoadingHistory;
  
  return {
    // Trips data
    activeTrips,
    historyTrips,
    allTrips,
    totalTrips,
    activeTripsCount,
    historyTripsCount,
    
    // Loading and error states
    isLoading,
    error: activeError || historyError,
    
    // Actions
    completeTrip: completeTrip.mutate,
    isCompletingTrip: completeTrip.isPending,
    reactivateTrip: reactivateTrip.mutate,
    isReactivatingTrip: reactivateTrip.isPending,
  };
}; 