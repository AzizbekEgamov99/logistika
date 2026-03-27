import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carsApi } from '../api/cars/carsApi';
import {  CarResponse, CarStatusSummary } from '../types/car.types';
import { message } from 'antd';
import axiosInstance from '@/api/axiosInstance';
import { useMemo } from 'react';

export const useCarStatus = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cars', 'status-summary'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/cars/status-summary/');
        return response.data as CarStatusSummary;
      } catch (error) {
        console.error('Error fetching cars status summary:', error);
        throw error;
      }
    }
  });

  const inRaysCars = useMemo(() => {
    return data?.in_rays?.items || [];
  }, [data]);
  
  const availableCars = useMemo(() => {
    return data?.available?.items || [];
  }, [data]);
  
  const maintenanceCars = useMemo(() => {
    return data?.maintenance?.items || [];
  }, [data]);
  
  const statusData = useMemo(() => {
    const statusData = {
      inRaysCount: data?.in_rays?.count || 0,
      availableCount: data?.available?.count || 0,
      maintenanceCount: data?.maintenance?.count || 0,
      totalCount: data?.total_count || 0
    };
    return statusData;
  }, [data]);

  return {
    statusData,
    isLoading,
    error,
    inRaysCars,
    inRaysCount: statusData.inRaysCount,
    availableCars,
    availableCount: statusData.availableCount,
    maintenanceCars,
    maintenanceCount: statusData.maintenanceCount
  };
};

export const useCars = () => {
    const queryClient = useQueryClient();

    const { data: cars = [], isLoading } = useQuery<CarResponse[]>({
        queryKey: ['cars'],
        queryFn: carsApi.getAllCars,
    });

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
                
                const requiredFields = ['name', 'number', 'year', 'engine', 'transmission', 
                                       'power', 'capacity', 'fuel', 'mileage', 'car_number'];
                
                for (const field of requiredFields) {
                    if (!formData.has(field) || formData.get(field) === '') {
                        throw new Error(`${field} is required and cannot be empty`);
                    }
                }
                
                const cleanFormData = new FormData();
                for (const [key, value] of formData.entries()) {
                    if (key === 'photo' && value instanceof File) {
                        cleanFormData.append('photo', value, value.name);
                    } else {
                        cleanFormData.append(key, value);
                    }
                }
                
                const response = await axiosInstance.post('/cars/', cleanFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                return response.data;
            } catch (error) {
                console.error('Create car error:', error.response?.data);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            queryClient.invalidateQueries({ queryKey: ['cars', 'status-summary'] });
            message.success("Avtomobil muvaffaqiyatli qo'shildi");
        },
        onError: (error: any) => {
            let errorMsg = "Barcha majburiy maydonlarni to'ldiring";
            if (error.response?.data) {
                if (typeof error.response.data === 'object') {
                    // Extract first error from object
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
            message.error(`Avtomobilni yaratishda xatolik: ${errorMsg}`);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            try {
                const { id, ...updateData } = data;
                if (!id) {
                    throw new Error('Car ID is required for update');
                }
                
                // Check if the update data is a FormData object
                if (data instanceof FormData) {
                    console.log('Updating car with FormData');
                    
                    // Debug FormData contents
                    for (const pair of data.entries()) {
                        if (pair[1] instanceof File) {
                            console.log(`Update ${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
                        } else {
                            console.log(`Update ${pair[0]}: ${pair[1]}`);
                        }
                    }
                    
                    // Create a new clean FormData
                    const cleanFormData = new FormData();
                    for (const [key, value] of data.entries()) {
                        if (key === 'photo' && value instanceof File) {
                            cleanFormData.append('photo', value, value.name);
                        } else if (key !== 'id') { // Don't include id in the form data
                            cleanFormData.append(key, value);
                        }
                    }
                    
                    const response = await axiosInstance.patch(`/cars/${id}/`, cleanFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    return response.data;
                }
                
                // Handle standard object update
                return carsApi.updateCar(id, {
                    ...updateData,
                    holat: updateData.holat as 'foal' | 'tamirda' | 'kutmoqda'
                });
            } catch (error) {
                console.error('Update car error:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            queryClient.invalidateQueries({ queryKey: ['cars', 'status-summary'] });
            message.success("Avtomobil muvaffaqiyatli yangilandi");
        },
        onError: (error: any) => {
            console.error('Update error:', error);
            message.error(error.response?.data?.message || "Xatolik yuz berdi");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => carsApi.deleteCar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            queryClient.invalidateQueries({ queryKey: ['cars', 'status-summary'] });
            message.success("Avtomobil muvaffaqiyatli o'chirildi");
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            console.error('Delete error:', error);
            message.error(error.response?.data?.message || "Xatolik yuz berdi");
        },
    });

    return {
        cars,
        isLoading,
        createCar: createMutation.mutateAsync,
        updateCar: updateMutation.mutateAsync,
        deleteCar: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await axiosInstance.post('/car/create/', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    }
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.put(`/car/update/${data.id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    }
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/car/delete/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    }
  });
}; 