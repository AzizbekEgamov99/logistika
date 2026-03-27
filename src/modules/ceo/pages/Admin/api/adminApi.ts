import axiosInstance from '../../../../../api/axiosInstance';
import { Admin, AdminFormValues } from '../types/admin';

// Get all admins
export const getAdmins = async (): Promise<Admin[]> => {
  try {
    console.log('Fetching admins from API...');
    const response = await axiosInstance.get('/customusers/');
    
    // Handle different response formats
    if (response.data.results) {
      console.log('Got paginated admins response:', response.data);
      return response.data.results;
    } else if (Array.isArray(response.data)) {
      console.log('Got direct array admins response:', response.data);
      return response.data;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getAdmins:', error);
    throw error;
  }
};

// Create a new admin
export const createAdmin = async (adminData: AdminFormValues): Promise<Admin> => {
  try {
    console.log('Creating admin with data:', { ...adminData, password: '[HIDDEN]' });
    
    if (!adminData.username || !adminData.password || !adminData.fullname) {
      throw new Error('Missing required fields');
    }

    const response = await axiosInstance.post('/customusers/', adminData);
    console.log('Admin created successfully:', { ...response.data, password: '[HIDDEN]' });
    return response.data;
  } catch (error: any) {
    console.error('Error in createAdmin:', error);
    
    if (error.response?.status === 400) {
      console.error('Validation errors:', error.response.data);
    }
    
    throw error;
  }
};

// Update an existing admin
export const updateAdmin = async (id: number, adminData: Partial<AdminFormValues>): Promise<Admin> => {
  try {
    console.log('Updating admin:', { id, data: { ...adminData, password: adminData.password ? '[HIDDEN]' : undefined } });
    
    if (!id) {
      throw new Error('Admin ID is required');
    }

    const response = await axiosInstance.patch(`/customusers/${id}/`, adminData);
    console.log('Admin updated successfully:', { ...response.data, password: '[HIDDEN]' });
    return response.data;
  } catch (error: any) {
    console.error('Error in updateAdmin:', error);
    
    if (error.response?.status === 404) {
      console.error('Admin not found with ID:', id);
    } else if (error.response?.status === 400) {
      console.error('Validation errors:', error.response.data);
    }
    
    throw error;
  }
};

// Delete an admin
export const deleteAdmin = async (id: number): Promise<void> => {
  try {
    console.log('Deleting admin with ID:', id);
    
    if (!id) {
      throw new Error('Admin ID is required');
    }

    const response = await axiosInstance.delete(`/customusers/${id}/`);
    console.log('Admin deleted successfully, status:', response.status);
  } catch (error: any) {
    console.error('Error in deleteAdmin:', error);
    
    if (error.response?.status === 404) {
      console.error('Admin not found with ID:', id);
    } else if (error.response?.status === 403) {
      console.error('Forbidden to delete admin with ID:', id);
    }
    
    throw error;
  }
};

// Get a single admin by ID
export const getAdmin = async (id: number): Promise<Admin> => {
  try {
    console.log('Fetching admin with ID:', id);
    
    if (!id) {
      throw new Error('Admin ID is required');
    }

    const response = await axiosInstance.get(`/customusers/${id}/`);
    console.log('Admin fetched successfully:', { ...response.data, password: '[HIDDEN]' });
    return response.data;
  } catch (error) {
    console.error('Error in getAdmin:', error);
    throw error;
  }
};

// Test API connection
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing API connection...');
    const response = await axiosInstance.get('/customusers/');
    console.log('API connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default axiosInstance;