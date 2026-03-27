import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} from '../../accounting/api/cars/carsApi'
import { CarType, CarFilter } from '../../accounting/types/car'
import { AxiosError } from 'axios'

export const useCEOCars = () => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<CarFilter>({
    page: 1,
    pageSize: 100,
    search: '',
    sortBy: undefined,
    sortOrder: undefined,
  })

  // Use the same API as accounting module
  const { data, isLoading, error } = useQuery({
    queryKey: ['ceo-cars', filters],
    queryFn: () => getAllCars(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Process data
  const cars = useMemo(
    () => (Array.isArray(data?.results) ? data.results : []),
    [data],
  )
  const total = useMemo(() => data?.count || cars.length, [data, cars])

  // Get vehicle counts by status
  const inRaysCars = useMemo(
    () => cars.filter((car) => car.holat === 'foal'),
    [cars],
  )
  const inRaysCount = inRaysCars.length

  const availableCars = useMemo(
    () => cars.filter((car) => car.holat === 'kutmoqda'),
    [cars],
  )
  const availableCount = availableCars.length

  const carsInMaintenance = useMemo(
    () => cars.filter((car) => car.holat === 'tamirlash'),
    [cars],
  )
  const maintenanceCount = carsInMaintenance.length

  // Calculate utilization rate
  const carsInUsePercentage = useMemo(() => {
    if (cars.length === 0) return 0
    return (inRaysCount / cars.length) * 100
  }, [cars, inRaysCount])

  const createMutation = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      message.success("Avtomobil muvaffaqiyatli qo'shildi")
      queryClient.invalidateQueries({ queryKey: ['ceo-cars'] })
    },
    onError: (error: AxiosError) => {
      console.error('Create error:', error)
      message.error("Avtomobil qo'shishda xatolik yuz berdi")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CarType> }) =>
      updateCar(id, data),
    onSuccess: () => {
      message.success("Avtomobil ma'lumotlari yangilandi")
      queryClient.invalidateQueries({ queryKey: ['ceo-cars'] })
    },
    onError: (error: AxiosError) => {
      message.error("Avtomobil ma'lumotlarini yangilashda xatolik yuz berdi")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCar(id),
    onSuccess: () => {
      message.success("Avtomobil o'chirildi")
      queryClient.invalidateQueries({ queryKey: ['ceo-cars'] })
    },
    onError: (error) => {
      console.error('Delete mutation error:', error)
      message.error("Avtomobilni o'chirishda xatolik yuz berdi")
    },
  })

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search.trim(),
      page: 1,
    }))
  }, [])

  const handleTableChange = useCallback(
    (
      pagination: { current?: number; pageSize?: number },
      filters: any,
      sorter: { field?: string; order?: 'ascend' | 'descend' },
    ) => {
      setFilters((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
        sortBy: sorter.field as string,
        sortOrder: sorter.order as 'ascend' | 'descend' | undefined,
      }))
    },
    [],
  )

  return {
    cars,
    total,
    loading: isLoading,
    error,
    filters,
    setFilters,
    handleSearch,
    handleTableChange,
    inRaysCars,
    inRaysCount,
    availableCars,
    availableCount,
    carsInMaintenance,
    maintenanceCount,
    carsInUsePercentage,
    createCar: (data: Partial<CarType>) => createMutation.mutateAsync(data),
    updateCar: (id: number, data: Partial<CarType>) =>
      updateMutation.mutate({ id, data }),
    deleteCar: (id: number) => deleteMutation.mutateAsync(id),
  }
}

export const useCEOCar = (id: number) => {
  return useQuery({
    queryKey: ['ceo-car', id],
    queryFn: () => getCar(id),
    enabled: !!id,
  })
}
