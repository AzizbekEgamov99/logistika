import { useState, useEffect, useMemo, useCallback } from 'react';
import { message } from 'antd';
import axiosInstance from '../../../api/axiosInstance';

// Import the required hooks
import { useCars, useCarStatus } from '../../accounting/hooks/useCars';
import { useFurgons, useFurgonStatus } from '../../accounting/hooks/useFurgon';
import type { Vehicle, VehicleStatusSummary } from '../pages/Fleet/types';

export const useFleetData = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data using hooks
  const { 
    cars = [], 
    isLoading: isLoadingCars,
    createCar,
    updateCar,
    deleteCar 
  } = useCars();
  
  const { 
    furgons = [], 
    isLoading: isLoadingFurgons,
    createFurgon,
    updateFurgon,
    deleteFurgon
  } = useFurgons();
  
  const { inRaysCount: activeCars = 0, availableCount: availableCars = 0 } = useCarStatus();
  const { inRaysCount: activeFurgons = 0, availableCount: availableFurgons = 0 } = useFurgonStatus();

  // Status summary calculation - memoized to prevent unnecessary recalculations
  const statusSummary: VehicleStatusSummary = useMemo(() => {
    const totalVehicles = cars.length + furgons.length;
    const activeVehicles = activeCars + activeFurgons;
    const activePercent = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
    const availableVehicles = availableCars + availableFurgons;
    const availablePercent = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0;

    return {
      totalVehicles,
      cars,
      furgons,
      activeCars,
      activeFurgons,
      availableCars,
      availableFurgons,
      activePercent,
      availablePercent
    };
  }, [cars, furgons, activeCars, activeFurgons, availableCars, availableFurgons]);

  // Filtered vehicles - only compute when necessary
  const filteredCars = useMemo(() => {
    return cars.filter(car => 
      car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.car_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.number?.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(car => ({...car, key: `car-${car.id}`}));
  }, [cars, searchQuery]);

  const filteredFurgons = useMemo(() => {
    return furgons.filter(furgon => 
      furgon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      furgon.number?.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(furgon => ({...furgon, key: `furgon-${furgon.id}`}));
  }, [furgons, searchQuery]);

  // Handlers for vehicle operations
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleAddCar = useCallback(async (formData: FormData) => {
    try {
      // Log FormData for debugging
      console.log('FormData in handleAddCar:');
      let hasValidPhoto = false;
      
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
          if (pair[0] === 'photo') {
            hasValidPhoto = true;
          }
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Ensure required fields are present
      const requiredFields = ['name', 'number'];
      for (const field of requiredFields) {
        if (!formData.has(field) || formData.get(field) === '') {
          throw new Error(`${field} is required and cannot be empty`);
        }
      }

      // Check if photo is included (required for new cars)
      if (!hasValidPhoto && !formData.has('keep_existing_photo')) {
        throw new Error('Avtomobil rasmi yuklanishi shart');
      }

      // Ensure kilometer field is present
      if (!formData.has('kilometer')) {
        formData.append('kilometer', '0');
      }

      // Add status if not present
      if (!formData.has('status') && !formData.has('holat')) {
        formData.append('holat', 'foal');
      }

      // Create a clean FormData to ensure proper data format
      const cleanFormData = new FormData();
      
      // Copy all entries to the clean form data
      for (const [key, value] of formData.entries()) {
        if (key === 'photo' && value instanceof File) {
          cleanFormData.append('photo', value, value.name);
          console.log(`Added car photo file: ${value.name} (${value.size} bytes)`);
        } else {
          cleanFormData.append(key, value);
          console.log(`Added ${key}: ${value}`);
        }
      }

      // Send the clean form data
      console.log('Sending car create request with FormData:');
      for (const pair of cleanFormData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Call the API
      const response = await createCar(cleanFormData);
      message.success("Yangi avtomobil qo'shildi");
      
      console.log('Car created successfully:', response);
      
      // Reload page to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Add car error:', error);
      
      // Log full error details
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      if (error.response?.data) {
        // Format and display validation errors
        const errors = error.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${(messages).join(', ')}`)
          .join('\n');
        
        message.error(`Xatoliklar mavjud:\n${errorMessages}`);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Avtomobil qo\'shishda xatolik yuz berdi');
      }
      return false;
    }
  }, [createCar]);

  const handleUpdateCar = useCallback(async (id: number, formData: FormData) => {
    try {
      // Log FormData for debugging
      console.log(`Updating car with ID ${id}`);
      console.log('FormData in handleUpdateCar:');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Ensure required fields are present
      const requiredFields = ['name', 'number', 'car_number', 'year'];
      for (const field of requiredFields) {
        if (!formData.has(field) || formData.get(field) === '') {
          throw new Error(`${field} is required and cannot be empty`);
        }
      }

      // Ensure kilometer field is present
      if (!formData.has('kilometer')) {
        formData.append('kilometer', '0');
      }

      // Extract values to an object
      const values: any = {};
      for (let [key, value] of formData.entries()) {
        values[key] = value;
      }
      
      // Call the API
      await updateCar({
        ...values,
        id,
        photo: formData.get('photo') instanceof File ? formData.get('photo') : undefined
      });
      
      message.success("Avtomobil muvaffaqiyatli yangilandi");
      
      // Reload page to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Update car error:', error);
      if (error.response?.data) {
        // Format and display validation errors
        const errors = error.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${(messages).join(', ')}`)
          .join('\n');
        
        message.error(`Xatoliklar mavjud:\n${errorMessages}`);
      } else {
        message.error('Amaliyot bajarilmadi: ' + (error.message || 'Xatolik yuz berdi'));
      }
      return false;
    }
  }, [updateCar]);

  const handleDeleteCar = useCallback(async (id: number) => {
    try {
      console.log('useFleetData: Deleting car with ID:', id);
      if (!id || isNaN(id)) {
        throw new Error('Invalid car ID for deletion: ' + id);
      }
      
      try {
        // Call the API to delete the car through the hook
        const result = await deleteCar(id);
        message.success("Avtomobil muvaffaqiyatli o'chirildi");
        return true;
      } catch (hookError) {
        console.error('Hook delete failed, trying direct axios call:', hookError);
        
        // If hook method fails, try direct axios call
        const response = await axiosInstance.delete(`/cars/${id}/`);
        message.success("Avtomobil muvaffaqiyatli o'chirildi");
        return true;
      }
    } catch (error) {
      console.error('Delete car error:', error);
      
      // Display specific error message
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('O\'chirishda xatolik yuz berdi: Iltimos, avtomobil boshqa ma\'lumotlarga bog\'liq emasligiga ishonch hosil qiling.');
      }
      return false;
    }
  }, [deleteCar]);

  const handleAddFurgon = useCallback(async (formData: FormData) => {
    try {
      // Log FormData for debugging
      console.log('FormData in handleAddFurgon:');
      let hasValidPhoto = false;
      
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
          if (pair[0] === 'photo') {
            hasValidPhoto = true;
          }
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Ensure kilometer is present and is a number
      if (!formData.has('kilometer')) {
        formData.append('kilometer', '0');
      }

      // Add status if not present
      if (!formData.has('status')) {
        formData.append('status', 'foal');
      }

      // Ensure required fields are present
      const requiredFields = ['name', 'number', 'kilometer'];
      for (const field of requiredFields) {
        if (!formData.has(field) || formData.get(field) === '') {
          throw new Error(`${field} is required and cannot be empty`);
        }
      }

      // Check if photo is included (required for new furgons)
      if (!hasValidPhoto && !formData.has('keep_existing_photo')) {
        throw new Error('Furgon rasmi yuklanishi shart');
      }

      // Create a new clean form data
      const cleanFormData = new FormData();
      
      // Copy all entries to the clean form data
      for (const [key, value] of formData.entries()) {
        if (key === 'photo' && value instanceof File) {
          cleanFormData.append('photo', value, value.name);
          console.log(`Added photo file: ${value.name} (${value.size} bytes)`);
        } else {
          cleanFormData.append(key, value);
          console.log(`Added ${key}: ${value}`);
        }
      }

      // Send the clean form data
      console.log('Sending furgon create request with FormData:');
      for (const pair of cleanFormData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      const response = await createFurgon(cleanFormData);
      message.success("Yangi furgon qo'shildi");
      
      console.log('Furgon created successfully:', response);
      
      // Reload page to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Add furgon error:', error);
      
      // Log full error details
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      if (error.response?.data) {
        // Format and display validation errors
        const errors = error.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${(messages).join(', ')}`)
          .join('\n');
        
        message.error(`Xatoliklar mavjud:\n${errorMessages}`);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Furgon qo\'shishda xatolik yuz berdi');
      }
      return false;
    }
  }, [createFurgon]);

  const handleUpdateFurgon = useCallback(async (id: number, formData: FormData) => {
    try {
      // Log FormData for debugging
      console.log(`Updating furgon with ID ${id}`);
      console.log('FormData in handleUpdateFurgon:');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Ensure kilometer field is present
      if (!formData.has('kilometer')) {
        formData.append('kilometer', '0');
      }

      // Add status if not present
      if (!formData.has('status')) {
        formData.append('status', 'foal');
      }

      // Ensure required fields are present
      const requiredFields = ['name', 'number', 'kilometer'];
      for (const field of requiredFields) {
        if (!formData.has(field) || formData.get(field) === '') {
          throw new Error(`${field} is required and cannot be empty`);
        }
      }

      // Extract values to an object for use with updateFurgon
      const values: any = {};
      for (let [key, value] of formData.entries()) {
        values[key] = value;
      }
      
      // Create a clean form data object
      const cleanFormData = new FormData();
      
      // Copy all entries to the clean form data
      for (const [key, value] of formData.entries()) {
        if (key === 'photo' && value instanceof File) {
          cleanFormData.append('photo', value, value.name);
        } else if (key !== 'id') { // Don't include id in form data
          cleanFormData.append(key, value);
        }
      }
      
      // Call the API using an object that includes id and the form data
      await updateFurgon({
        id,
        furgon: cleanFormData
      });
      
      message.success("Furgon muvaffaqiyatli yangilandi");
      
      // Reload page to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Update furgon error:', error);
      if (error.response?.data) {
        // Format and display validation errors
        const errors = error.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${(messages).join(', ')}`)
          .join('\n');
        
        message.error(`Xatoliklar mavjud:\n${errorMessages}`);
      } else {
        message.error('Amaliyot bajarilmadi: ' + (error.message || 'Xatolik yuz berdi'));
      }
      return false;
    }
  }, [updateFurgon]);

  const handleDeleteFurgon = useCallback(async (id: number) => {
    try {
      console.log('useFleetData: Deleting furgon with ID:', id);
      if (!id || isNaN(id)) {
        throw new Error('Invalid furgon ID for deletion: ' + id);
      }
      
      try {
        // Call the API to delete the furgon through the hook
        const result = await deleteFurgon(id);
        message.success("Furgon muvaffaqiyatli o'chirildi");
        return true;
      } catch (hookError) {
        console.error('Hook delete failed, trying direct axios call:', hookError);
        
        // If hook method fails, try direct axios call
        const response = await axiosInstance.delete(`/furgon/${id}/`);
        message.success("Furgon muvaffaqiyatli o'chirildi");
        return true;
      }
    } catch (error) {
      console.error('Delete furgon error:', error);
      
      // Display specific error message
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Furgonni o\'chirishda xatolik yuz berdi. Iltimos, furgon boshqa ma\'lumotlarga bog\'liq emasligiga ishonch hosil qiling.');
      }
      return false;
    }
  }, [deleteFurgon]);

  return {
    // Data
    cars,
    furgons,
    filteredCars,
    filteredFurgons,
    statusSummary,
    
    // Loading states
    isLoading: isLoadingCars || isLoadingFurgons,
    
    // Search
    searchQuery,
    handleSearch,
    
    // Car operations
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    
    // Furgon operations
    handleAddFurgon,
    handleUpdateFurgon,
    handleDeleteFurgon
  };
}; 