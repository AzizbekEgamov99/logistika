import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { getAllDrivers, getDriver, createDriver, updateDriver, deleteDriver, createDriverWithPhoto, updateDriverWithPhoto } from '../api/drivers/driverApi';
import { DriverType, DriverFilter } from '../types/driver';
import { AxiosError } from 'axios';
export const useDrivers = () => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<DriverFilter>({
        page: 1,
        pageSize: 10,
        search: '',
        status: 'driver',
        sortBy: undefined,
        sortOrder: undefined
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['drivers', filters],
        queryFn: () => getAllDrivers(filters),
        staleTime: 5 * 60 * 1000, 
        // keepPreviousData: true
    });
    const drivers = Array.isArray(data?.results) ? data.results : [];
    const total = data?.count || 0;
    const createMutation = useMutation({
        mutationFn: createDriver,
        onSuccess: (_newDriver) => {
            message.success("Haydovchi muvaffaqiyatli qo'shildi");
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
        },
        onError: (error: AxiosError) => {
            console.error('Create error:', error);
            let errorMessage = "Haydovchi qo'shishda xatolik yuz berdi";
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data) {
                try {
                    const errorData = error.response.data;
                    if (typeof errorData === 'object') {
                        errorMessage = Object.entries(errorData)
                            .map(([key, value]) => {
                                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                                return `${key}: ${displayValue}`;
                            })
                            .join('\n');
                    } else if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    }
                } catch (e) {
                    console.error('Error parsing API error:', e);
                }
            }
            
            throw new Error(errorMessage);
        }
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<DriverType> }) =>
            updateDriver(id, data),
        onSuccess: (updatedDriver) => {
            message.success("Haydovchi ma'lumotlari yangilandi");
            queryClient.setQueryData(['drivers', filters], (oldData: any) => {
                if (!oldData || !oldData.results) return oldData;
                
                return {
                    ...oldData,
                    results: oldData.results.map((driver: DriverType) => 
                        driver.id === updatedDriver.id ? updatedDriver : driver
                    )
                };
            });
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
        },
        onError: (error: AxiosError) => {
            const errorData = error.response?.data as any;
            message.error(errorData?.message ? errorData.message : "Haydovchi ma'lumotlarini yangilashda xatolik yuz berdi");
        }
    });
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDriver(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
        },
        onError: (error) => {
            console.error('Delete mutation error:', error);
            throw error;
        }
    });

    const createWithPhotoMutation = useMutation({
        mutationFn: createDriverWithPhoto,
        onSuccess: (_newDriver) => {
            message.success("Haydovchi muvaffaqiyatli qo'shildi");
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
        },
        onError: (error: AxiosError) => {
            console.error('Create with photo error:', error);
            let errorMessage = "Haydovchi qo'shishda xatolik yuz berdi";
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data) {
                try {
                    const errorData = error.response.data;
                    if (typeof errorData === 'object') {
                        errorMessage = Object.entries(errorData)
                            .map(([key, value]) => {
                                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                                return `${key}: ${displayValue}`;
                            })
                            .join('\n');
                    } else if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    }
                } catch (e) {
                    console.error('Error parsing API error:', e);
                }
            }
            
            throw new Error(errorMessage);
        }
    });

    const updateWithPhotoMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: FormData }) =>
            updateDriverWithPhoto(id, data),
        onSuccess: (updatedDriver) => {
            message.success("Haydovchi ma'lumotlari yangilandi");
            queryClient.setQueryData(['drivers', filters], (oldData: any) => {
                if (!oldData || !oldData.results) return oldData;
                
                return {
                    ...oldData,
                    results: oldData.results.map((driver: DriverType) => 
                        driver.id === updatedDriver.id ? updatedDriver : driver
                    )
                };
            });
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
        },
        onError: (error: AxiosError) => {
            const errorData = error.response?.data as any;
            message.error(errorData?.message ? errorData.message : "Haydovchi ma'lumotlarini yangilashda xatolik yuz berdi");
        }
    });

    const handleSearch = useCallback((search: string) => {
        setFilters(prev => ({ 
            ...prev, 
            search: search.trim(),
            page: 1 
        }));
    }, []);

    const handleStatusFilter = useCallback((status: string) => {
        setFilters(prev => ({ 
            ...prev, 
            status: status === 'all' ? 'all' : status,
            page: 1 
        }));
    }, []);

    const handleTableChange = useCallback((
        pagination: { current?: number; pageSize?: number },
        filters: any,
        sorter: { field?: string; order?: 'ascend' | 'descend' }
    ) => {
        setFilters(prev => ({
            ...prev,
            page: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            sortBy: sorter.field,
            sortOrder: sorter.order,
            ...(filters.status && filters.status.length > 0 && { status: filters.status[0] })
        }));
    }, []);

    return {
        drivers,
        total,
        loading: isLoading,
        error,
        filters,
        setFilters,
        handleSearch,
        handleStatusFilter,
        handleTableChange,
        createDriver: async (data: Partial<DriverType>) => {
            try {
                if (!data.username && data.phone_number) {
                    data.username = data.phone_number.replace(/\D/g, '');
                }
                
                if (!data.password && data.phone_number) {
                    data.password = data.phone_number.replace(/\D/g, '');
                }
                
                return await createMutation.mutateAsync(data);
            } catch (error) {
                console.error('Driver creation error:', error);
                throw error;
            }
        },
        createDriverWithPhoto: (formData: FormData) => createWithPhotoMutation.mutateAsync(formData),
        updateDriver: (id: number, data: Partial<DriverType>) => updateMutation.mutateAsync({ id, data }),
        updateDriverWithPhoto: (id: number, formData: FormData) => {
            console.log('Calling updateWithPhotoMutation with:', { id, formData });
            return updateWithPhotoMutation.mutateAsync({ id, data: formData });
        },
        deleteDriver: (id: number) => deleteMutation.mutateAsync(id)
    };
};
export const useDriver = (id: number) => {
    return useQuery({
        queryKey: ["driver", id],
        queryFn: () => getDriver(id),
        enabled: !!id,
    });
};