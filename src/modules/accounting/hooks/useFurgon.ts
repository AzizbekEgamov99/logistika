import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFurgons,
  getFurgon,
  createFurgon,
  updateFurgon,
  patchFurgon,
  deleteFurgon,
  getFurgonStatusSummary,
} from '../api/furgon/furgonapi'
import { message } from 'antd'

export const useFurgonStatus = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['furgons', 'status-summary'],
    queryFn: getFurgonStatusSummary,
  })

  return {
    statusData: data,
    isLoading,
    error,
    inRaysFurgons: data?.in_rays?.items || [],
    inRaysCount: data?.in_rays?.count || 0,
    availableFurgons: data?.available?.items || [],
    availableCount: data?.available?.count || 0,
  }
}

export const useFurgons = () => {
  const queryClient = useQueryClient()
  const {
    data: furgons = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['furgons'],
    queryFn: getFurgons,
  })

  const getFurgonById = (id: number) => {
    return useQuery({
      queryKey: ['furgon', id],
      queryFn: () => getFurgon(id),
      enabled: !!id,
    })
  }

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        console.log('FormData contents before sending:');
        for (const pair of formData.entries()) {
          if (pair[1] instanceof File) {
            console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
          } else {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
        }

        const hasPhoto = formData.has('photo');
        if (hasPhoto) {
          const photo = formData.get('photo');
          if (photo instanceof File) {
            console.log(`Photo file details: Name: ${photo.name}, Size: ${photo.size} bytes, Type: ${photo.type}`);
          } else {
            console.log('Photo is present but not a File object:', photo);
          }
        } else {
          console.log('No photo field in FormData');
        }

        // Required fields for furgons
        const requiredFields = ['name', 'number'];

        for (const field of requiredFields) {
          if (!formData.has(field) || formData.get(field) === '') {
            throw new Error(`${field} is required and cannot be empty`);
          }
        }

        // Ensure we have a clean FormData object
        const cleanFormData = new FormData();
        for (const [key, value] of formData.entries()) {
          if (key === 'photo' && value instanceof File) {
            cleanFormData.append('photo', value, value.name);
          } else {
            cleanFormData.append(key, value);
          }
        }

        return await createFurgon(cleanFormData);
      } catch (error) {
        console.error('Create furgon error:', error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furgons'] })
      queryClient.invalidateQueries({ queryKey: ['furgons', 'status-summary'] })
      message.success("Furgon muvaffaqiyatli qo'shildi")
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      let errorMsg = 'Xatolik yuz berdi';
      if (error.response?.data) {
          if (typeof error.response.data === 'object') {
              const firstKey = Object.keys(error.response.data)[0];
              if (firstKey) {
                  const val = error.response.data[firstKey];
                  errorMsg = `${firstKey}: ${Array.isArray(val) ? val[0] : val}`;
              }
          } else if (error.response.data.message) {
              errorMsg = error.response.data.message;
          }
      } else if (error.message) {
          errorMsg = error.message;
      }
      message.error(errorMsg);
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (params: number | FormData | { id: number; furgon: FormData }) => {
      try {
        // Handle different types of inputs for backward compatibility
        let id: number;
        let formData: FormData;

        if (typeof params === 'number') {
          // Called as updateFurgon(id, formData) - the old function signature
          id = params;
          // formData should be the second argument, which we can't access here
          // This case should not occur with the current implementation
          throw new Error('Missing formData parameter');
        } else if (params instanceof FormData) {
          // Called directly with FormData
          if (!params.has('id')) {
            throw new Error('FormData must contain an id field');
          }
          id = Number(params.get('id'));
          formData = params;
        } else {
          // Called with {id, furgon} object
          id = params.id;
          formData = params.furgon;
        }

        console.log(`Updating furgon with ID ${id}`);

        // Create a clean FormData to ensure proper data format
        const cleanFormData = new FormData();
        
        // Always add a keep_photo field when no new photo is provided
        // This signals to the backend that we want to keep the existing photo
        let hasPhotoFile = false;
        for (const [key, value] of formData.entries()) {
          if (key === 'photo' && value instanceof File) {
            hasPhotoFile = true;
            cleanFormData.append('photo', value, value.name);
          } else if (key !== 'id') { // Don't include id in form data
            cleanFormData.append(key, value);
          }
        }
        
        // If no new photo is being uploaded, add a special field to keep existing photo
        if (!hasPhotoFile) {
          cleanFormData.append('keep_existing_photo', 'true');
        }

        // Log formData contents for debugging
        for (const pair of cleanFormData.entries()) {
          if (pair[1] instanceof File) {
            console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
          } else {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
        }

        // Use patchFurgon instead of updateFurgon to only update changed fields
        return await patchFurgon(id, cleanFormData);
      } catch (error) {
        console.error('Error updating furgon:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furgons'] })
      queryClient.invalidateQueries({ queryKey: ['furgons', 'status-summary'] })
      message.success('Furgon muvaffaqiyatli yangilandi')
    },
    onError: (error: any) => {
      console.error('Update error:', error)
      message.error(error.response?.data?.message || 'Xatolik yuz berdi')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFurgon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furgons'] })
      queryClient.invalidateQueries({ queryKey: ['furgons', 'status-summary'] })
      message.success("Furgon muvaffaqiyatli o'chirildi")
    },
    onError: (error: any) => {
      console.error('Delete error:', error)
      message.error(error.response?.data?.message || 'Xatolik yuz berdi')
    },
  })

  return {
    furgons,
    isLoading,
    isError,
    getFurgonById,
    createFurgon: createMutation.mutateAsync,
    updateFurgon: updateMutation.mutateAsync,
    deleteFurgon: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
