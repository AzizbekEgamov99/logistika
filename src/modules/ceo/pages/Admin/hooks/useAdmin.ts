import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { 
  getAdmins,
  createAdmin, 
  updateAdmin, 
  deleteAdmin
} from '../api/adminApi';
import { Admin, AdminFormValues } from '../types/admin';

export const useAdmin = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors(null);
  }, []);

  // Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
      console.log('Fetching admins...');
      setLoading(true);
      clearErrors();
      
      try {
        const data = await getAdmins();
        console.log('Admins fetched successfully:', data);
        
        // Make sure data is an array
        if (Array.isArray(data)) {
          setAdmins(data);
        } else if (data && data.results && Array.isArray(data.results)) {
          // Handle paginated response
          setAdmins(data.results);
        } else {
          console.error('Unexpected data format:', data);
          setAdmins([]);
          message.error('Ma\'lumotlar formati noto\'g\'ri');
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        
        // Detailed error handling
        if (error.response) {
          console.error('Response error:', error.response.data);
          console.error('Response status:', error.response.status);
          
          if (error.response.status === 401) {
            message.error('Avtorizatsiya xatosi. Iltimos, qayta kiring.');
          } else if (error.response.status === 403) {
            message.error('Ruxsat berilmagan. Sizda bu amalni bajarish huquqi yo\'q.');
          } else if (error.response.status >= 500) {
            message.error('Server xatosi. Iltimos, keyinroq urinib ko\'ring.');
          } else {
            message.error('Administratorlarni yuklashda xatolik yuz berdi');
          }
        } else if (error.request) {
          console.error('Request error:', error.request);
          message.error('Tarmoq xatosi. Internetga ulanishni tekshiring.');
        } else {
          console.error('Unknown error:', error.message);
          message.error('Noma\'lum xatolik yuz berdi');
        }
        
        setAdmins([]);
        setErrors(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [refreshTrigger, clearErrors]);

  // Force refresh of data
  const refreshData = useCallback(() => {
    console.log('Refreshing data...');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Add a new admin
  const addAdmin = useCallback(async (values: AdminFormValues): Promise<boolean> => {
    console.log('Adding admin with values:', values);
    setLoading(true);
    clearErrors();
    
    try {
      // Validate required fields
      if (!values.username || !values.password || !values.fullname) {
        message.error('Barcha majburiy maydonlarni to\'ldiring');
        setLoading(false);
        return false;
      }

      const response = await createAdmin(values);
      console.log('Admin created successfully:', response);
      
      message.success('Administrator muvaffaqiyatli qo\'shildi');
      refreshData();
      return true;
    } catch (error) {
      console.error('Error adding admin:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        console.error('Server validation errors:', errorData);
        
        // Handle specific validation errors
        if (errorData.username) {
          message.error(`Foydalanuvchi nomi xatosi: ${Array.isArray(errorData.username) ? errorData.username.join(', ') : errorData.username}`);
        } else if (errorData.phone_number) {
          message.error(`Telefon raqami xatosi: ${Array.isArray(errorData.phone_number) ? errorData.phone_number.join(', ') : errorData.phone_number}`);
        } else if (errorData.detail) {
          message.error(errorData.detail);
        } else if (errorData.non_field_errors) {
          message.error(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors.join(', ') : errorData.non_field_errors);
        } else {
          message.error('Administrator qo\'shishda xatolik yuz berdi');
        }
        
        setErrors(errorData);
      } else {
        message.error('Administrator qo\'shishda xatolik yuz berdi');
        setErrors(error);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, clearErrors]);

  // Update an existing admin
  const editAdmin = useCallback(async (id: number, values: Partial<AdminFormValues>): Promise<boolean> => {
    console.log('Editing admin:', { id, values });
    
    if (!id) {
      console.error('Admin ID is required for editing');
      message.error('Administrator ID topilmadi');
      return false;
    }
    
    setLoading(true);
    clearErrors();
    
    try {
      // Remove empty values for patch request
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      console.log('Filtered values for update:', filteredValues);
      
      if (Object.keys(filteredValues).length === 0) {
        message.warning('Hech qanday o\'zgarish kiritilmadi');
        setLoading(false);
        return true;
      }

      const response = await updateAdmin(id, filteredValues);
      console.log('Admin updated successfully:', response);
      
      message.success('Administrator muvaffaqiyatli yangilandi');
      refreshData();
      return true;
    } catch (error) {
      console.error('Error updating admin:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        console.error('Server validation errors:', errorData);
        
        if (errorData.detail) {
          message.error(errorData.detail);
        } else if (errorData.username) {
          message.error(`Foydalanuvchi nomi xatosi: ${Array.isArray(errorData.username) ? errorData.username.join(', ') : errorData.username}`);
        } else {
          message.error('Administratorni yangilashda xatolik yuz berdi');
        }
        
        setErrors(errorData);
      } else {
        message.error('Administratorni yangilashda xatolik yuz berdi');
        setErrors(error);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, clearErrors]);

  // Delete an admin
  const removeAdmin = useCallback(async (id: number): Promise<boolean> => {
    console.log('Deleting admin with ID:', id);
    
    if (!id) {
      console.error('Admin ID is required for deletion');
      message.error('Administrator ID topilmadi');
      return false;
    }
    
    setLoading(true);
    clearErrors();
    
    try {
      await deleteAdmin(id);
      console.log('Admin deleted successfully');
      
      message.success('Administrator muvaffaqiyatli o\'chirildi');
      refreshData();
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      
      if (error.response?.status === 404) {
        message.error('Administrator topilmadi');
      } else if (error.response?.status === 403) {
        message.error('Bu administratorni o\'chirish uchun ruxsatingiz yo\'q');
      } else if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else {
        message.error('Administratorni o\'chirishda xatolik yuz berdi');
      }
      
      setErrors(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, clearErrors]);

  // Debug current state
  console.log('useAdmin state:', {
    adminsCount: admins.length,
    loading,
    hasErrors: !!errors,
    refreshTrigger
  });

  return {
    admins,
    loading,
    errors,
    addAdmin,
    editAdmin,
    removeAdmin,
    refreshData,
    clearErrors
  };
};