import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { driverSalaryApi } from '../api/driverSalary/driverSalaryApi';
import { DriverSalary, DriverSalaryCreate } from '../types/driverSalary';

export const useDriverSalaries = (initialFilters: any = {}) => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState(initialFilters);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['driverSalaries', filters],
        queryFn: () => driverSalaryApi.getAllDriverSalaries(filters),
    });

    const driverSalaries = Array.isArray(data) ? data : (data?.results || []);
    const total = data?.count || driverSalaries.length;

    const createMutation = useMutation({
        mutationFn: (newSalary: DriverSalaryCreate) => driverSalaryApi.createDriverSalary(newSalary),
        onSuccess: () => {
            message.success('To`lov muvaffaqiyatli qo`shildi');
            queryClient.invalidateQueries({ queryKey: ['driverSalaries'] });
        },
        onError: (error: any) => {
            message.error('To`lov qo`shishda xatolik yuz berdi');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<DriverSalaryCreate> }) =>
            driverSalaryApi.updateDriverSalary(id, data),
        onSuccess: () => {
            message.success('To`lov muvaffaqiyatli yangilandi');
            queryClient.invalidateQueries({ queryKey: ['driverSalaries'] });
        },
        onError: (error: any) => {
            message.error('To`lovni yangilashda xatolik yuz berdi');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => driverSalaryApi.deleteDriverSalary(id),
        onSuccess: () => {
            message.success('To`lov muvaffaqiyatli o`chirildi');
            queryClient.invalidateQueries({ queryKey: ['driverSalaries'] });
        },
        onError: (error: any) => {
            message.error('To`lovni o`chirishda xatolik yuz berdi');
        }
    });

    return {
        driverSalaries,
        total,
        loading: isLoading,
        error,
        filters,
        setFilters,
        refetch,
        createDriverSalary: createMutation.mutate,
        updateDriverSalary: updateMutation.mutate,
        deleteDriverSalary: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};

export const useDriverSalary = (id: number) => {
    return useQuery({
        queryKey: ['driverSalary', id],
        queryFn: () => driverSalaryApi.getDriverSalary(id),
        enabled: !!id,
        retry: 1,
        refetchOnWindowFocus: false
    });
}; 