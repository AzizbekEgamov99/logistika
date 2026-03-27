import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { message } from 'antd';
import { getAllClients, createClient, updateClient, deleteClient } from '../api/client/clientApi';
import { Client, ClientFilter } from '../types/client';

export const useClients = (params?: ClientFilter) => {
    const queryClient = useQueryClient();
    const normalizedParams = {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        search: params?.search?.trim() || undefined,
    };

    const { data: rawData, isLoading, isError, refetch } = useQuery({
        queryKey: ['clients', { ...normalizedParams, search: undefined }],
        queryFn: () => getAllClients({ ...normalizedParams, search: undefined }),
        staleTime: 1000 * 60, 
    });

    const filteredData = useMemo(() => {
        const clients = Array.isArray(rawData?.data) ? rawData.data : [];
        
        if (!normalizedParams.search) {
            return {
                data: clients,
                total: clients.length
            };
        }
        const searchTerm = normalizedParams.search.toLowerCase();
        const filteredClients = clients.filter(client => 
            (client.first_name?.toLowerCase().includes(searchTerm) || 
             client.last_name?.toLowerCase().includes(searchTerm) || 
             client.city?.toLowerCase().includes(searchTerm) || 
             client.number?.includes(searchTerm))
        );
        return {
            data: filteredClients,
            total: filteredClients.length
        };
    }, [rawData, normalizedParams.search]);

    const createMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            message.success("Mijoz muvaffaqiyatli qo'shildi");
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: () => message.error("Mijoz qo'shishda xatolik yuz berdi"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Client> }) => updateClient(id, data),
        onSuccess: () => {
            message.success("Mijoz muvaffaqiyatli yangilandi");
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: () => message.error("Mijozni yangilashda xatolik yuz berdi"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            message.success("Mijoz muvaffaqiyatli o'chirildi");
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: () => message.error("Mijozni o'chirishda xatolik yuz berdi"),
    });

    return {
        data: filteredData,
        isLoading,
        isError,
        refetch,
        createClient: createMutation.mutateAsync,
        updateClient: updateMutation.mutateAsync,
        deleteClient: deleteMutation.mutateAsync,
    };
};
