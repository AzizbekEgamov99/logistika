import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Admin, AdminFormValues } from '../types/admin';
import axiosInstance from '@/api/axiosInstance';

export const useAdmin = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/customusers/');
      
      // Map the API response to our Admin type
      const adminData = response.data.map((user: any) => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        phone_number: user.phone_number,
        status: user.status,
        created_at: user.date
      }));
      
      setAdmins(adminData);
    } catch (error) {
      console.error('Error fetching admins:', error);
      message.error('Administratorlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const addAdmin = useCallback(async (values: AdminFormValues): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
    try {
      setLoading(true);
      setErrors({});
      await axiosInstance.post('/customusers/', values);
      message.success("Administrator muvaffaqiyatli qo'shildi");
      
      // Refresh admin list
      await fetchAdmins();
      return { success: true };
    } catch (error: any) {
      console.error('Error adding admin:', error);
      
      // Check if the error is a validation error with field details
      if (error.response?.data && typeof error.response.data === 'object') {
        setErrors(error.response.data);
        return { success: false, errors: error.response.data };
      }
      
      message.error("Administrator qo'shishda xatolik yuz berdi");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchAdmins]);

  const editAdmin = useCallback(async (id: number, values: Partial<AdminFormValues>): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
    try {
      setLoading(true);
      setErrors({});
      await axiosInstance.patch(`/customusers/${id}/`, values);
      message.success("Administrator muvaffaqiyatli tahrirlandi");
      
      // Refresh admin list
      await fetchAdmins();
      return { success: true };
    } catch (error: any) {
      console.error('Error editing admin:', error);
      
      // Check if the error is a validation error with field details
      if (error.response?.data && typeof error.response.data === 'object') {
        setErrors(error.response.data);
        return { success: false, errors: error.response.data };
      }
      
      message.error("Administratorni tahrirlashda xatolik yuz berdi");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchAdmins]);

  const removeAdmin = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/customusers/${id}/`);
      message.success("Administrator muvaffaqiyatli o'chirildi");
      
      // Refresh admin list
      await fetchAdmins();
      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      message.error("Administratorni o'chirishda xatolik yuz berdi");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAdmins]);

  return {
    admins,
    loading,
    errors,
    addAdmin,
    editAdmin,
    removeAdmin,
    refreshAdmins: fetchAdmins
  };
}; 