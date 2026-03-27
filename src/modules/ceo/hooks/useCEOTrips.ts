import { useRays, useCreateRays, useCompleteRace, useReturnTripFromHistory } from '../../accounting/hooks/useRays';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useCEOTrips = () => {
  const queryClient = useQueryClient();
  const { data: trips = [], isLoading, error } = useRays();
  const createRaysMutation = useCreateRays();
  const completeRaceMutation = useCompleteRace();
  const returnTripMutation = useReturnTripFromHistory();
  
  // Get active trips count
  const activeTrips = trips.filter(trip => !trip.is_completed);
  const activeTripsCount = activeTrips.length;
  
  // Get completed trips count
  const completedTrips = trips.filter(trip => trip.is_completed);
  const completedTripsCount = completedTrips.length;
  
  // Get pending trips count (trips with partial completion)
  const pendingTrips = trips.filter(trip => {
    return !trip.is_completed && 
           trip.client?.some(client => client.is_completed) && 
           trip.client?.some(client => !client.is_completed);
  });
  const pendingTripsCount = pendingTrips.length;

  const updateTripStatus = useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      return completeRaceMutation.mutateAsync(id);
    },
    onSuccess: () => {
      message.success("Reys ma'lumotlari yangilandi");
      queryClient.invalidateQueries({ queryKey: ['rays'] });
    }
  });

  // Calculate completion rate
  const tripCompletionRate = trips.length > 0 ? (completedTripsCount / trips.length) * 100 : 0;

  return {
    trips,
    total: trips.length,
    loading: isLoading,
    error,
    activeTrips,
    activeTripsCount,
    completedTrips,
    completedTripsCount,
    pendingTrips,
    pendingTripsCount,
    tripCompletionRate,
    createTrip: createRaysMutation.mutateAsync,
    updateTrip: updateTripStatus.mutate,
    completeTrip: completeRaceMutation.mutateAsync,
    returnTrip: returnTripMutation.mutateAsync
  };
};

// Export the individual hooks directly
export const useCEOTrip = (id: number) => {
  const { data: trips = [] } = useRays();
  const trip = trips.find(trip => trip.id === id);
  return { trip, isLoading: !trip };
}; 