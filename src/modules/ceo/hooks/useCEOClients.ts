// import { useState, useCallback } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { message } from 'antd';
// import { getAllClients, getClient, createClient, updateClient, deleteClient } from '../../accounting/api/client/clientApi';
// import { ClientType, ClientFilter } from '../../accounting/types/client';
// import { AxiosError } from 'axios';

// export const useCEOClients = () => {
//   const queryClient = useQueryClient();
//   const [filters, setFilters] = useState<ClientFilter>({
//     page: 1,
//     pageSize: 10,
//     search: '',
//     sortBy: undefined,
//     sortOrder: undefined
//   });

//   // Use the same API as accounting module
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['ceo-clients', filters],
//     queryFn: () => getAllClients(filters),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Process data
//   const clients = Array.isArray(data?.results) ? data.results : [];
//   const total = data?.count || 0;

//   const createMutation = useMutation({
//     mutationFn: createClient,
//     onSuccess: () => {
//       message.success("Mijoz muvaffaqiyatli qo'shildi");
//       queryClient.invalidateQueries({ queryKey: ['ceo-clients'] });
//     },
//     onError: (error: AxiosError) => {
//       console.error('Create error:', error);
//       message.error("Mijoz qo'shishda xatolik yuz berdi");
//     }
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }: { id: number; data: Partial<ClientType> }) =>
//       updateClient(id, data),
//     onSuccess: () => {
//       message.success("Mijoz ma'lumotlari yangilandi");
//       queryClient.invalidateQueries({ queryKey: ['ceo-clients'] });
//     },
//     onError: (error: AxiosError) => {
//       message.error("Mijoz ma'lumotlarini yangilashda xatolik yuz berdi");
//     }
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: number) => deleteClient(id),
//     onSuccess: () => {
//       message.success("Mijoz o'chirildi");
//       queryClient.invalidateQueries({ queryKey: ['ceo-clients'] });
//     },
//     onError: (error) => {
//       console.error('Delete mutation error:', error);
//       message.error("Mijozni o'chirishda xatolik yuz berdi");
//     }
//   });

//   const handleSearch = useCallback((search: string) => {
//     setFilters(prev => ({ 
//       ...prev, 
//       search: search.trim(),
//       page: 1 
//     }));
//   }, []);

//   const handleTableChange = useCallback((
//     pagination: { current?: number; pageSize?: number },
//     filters: any,
//     sorter: { field?: string; order?: 'ascend' | 'descend' }
//   ) => {
//     setFilters(prev => ({
//       ...prev,
//       page: pagination.current || 1,
//       pageSize: pagination.pageSize || 10,
//       sortBy: sorter.field as string,
//       sortOrder: sorter.order as 'ascend' | 'descend' | undefined
//     }));
//   }, []);

//   return {
//     clients,
//     total,
//     loading: isLoading,
//     error,
//     filters,
//     setFilters,
//     handleSearch,
//     handleTableChange,
//     createClient: (data: Partial<ClientType>) => createMutation.mutateAsync(data),
//     updateClient: (id: number, data: Partial<ClientType>) => updateMutation.mutate({ id, data }),
//     deleteClient: (id: number) => deleteMutation.mutateAsync(id)
//   };
// };

// export const useCEOClient = (id: number) => {
//   return useQuery({
//     queryKey: ["ceo-client", id],
//     queryFn: () => getClient(id),
//     enabled: !!id,
//   });
// }; 