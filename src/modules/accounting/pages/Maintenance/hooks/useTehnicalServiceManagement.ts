import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TehnicalService } from '@/modules/accounting/types/maintenance';
import {
  getTehnicalServices,
  createTehnicalService,
  updateTehnicalService,
  deleteTehnicalService,
} from '../api/tehnicalService';

export const useTehnicalServiceManagement = () => {
  const queryClient = useQueryClient();

  // Fetch all technical services
  const {
    data: tehnicalServices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tehnicalServices'],
    queryFn: getTehnicalServices,
  });

  // Create a new technical service
  const createMutation = useMutation({
    mutationFn: createTehnicalService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tehnicalServices'] });
    },
  });

  // Update a technical service
  const updateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: TehnicalService }) =>
      updateTehnicalService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tehnicalServices'] });
    },
  });

  // Delete a technical service
  const deleteMutation = useMutation({
    mutationFn: deleteTehnicalService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tehnicalServices'] });
    },
  });

  return {
    tehnicalServices,
    isLoading,
    isError,
    addTehnicalService: createMutation.mutate,
    updateTehnicalService: updateMutation.mutate,
    deleteTehnicalService: deleteMutation.mutate,
  };
}; 