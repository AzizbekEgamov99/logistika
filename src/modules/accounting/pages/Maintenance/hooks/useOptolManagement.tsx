import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OptolType } from '@/modules/accounting/pages/Maintenance/types/maintenance';
import { 
  getOptolServices, 
  createOptolService, 
  updateOptolService,
  deleteOptolService,
  partialUpdateOptolService
} from '../api/optolService';

export const useOptolManagement = () => {
  const queryClient = useQueryClient();

  const {
    data: optolServices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['optol'],
    queryFn: getOptolServices,
  });

  // Create a new optol service
  const createMutation = useMutation({
    mutationFn: createOptolService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optol'] });
    },
  });

  // Update an optol service
  const updateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: OptolType }) =>
      updateOptolService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optol'] });
    },
  });

  // Partially update an optol service
  const partialUpdateMutation = useMutation({
    mutationFn: ({ id, service }: { id: number; service: Partial<OptolType> }) =>
      partialUpdateOptolService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optol'] });
    },
  });

  // Delete an optol service
  const deleteMutation = useMutation({
    mutationFn: deleteOptolService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optol'] });
    },
  });

  // Complete an optol service
  const completeMutation = useMutation({
    mutationFn: (id: number) => 
      partialUpdateOptolService(id, { completed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optol'] });
    },
  });

  return {
    optolServices,
    isLoading,
    isError,
    addOptolService: createMutation.mutate,
    updateOptolService: updateMutation.mutate,
    partialUpdateOptolService: partialUpdateMutation.mutate,
    deleteOptolService: deleteMutation.mutate,
    completeOptolService: completeMutation.mutate,
  };
};
