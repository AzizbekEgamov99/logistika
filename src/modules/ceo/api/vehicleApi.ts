import axiosInstance from '../../../api/axiosInstance';

export const vehicleApi = {
  // Car operations
  getCars: async () => {
    try {
      const response = await axiosInstance.get('/cars/');
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },
  
  deleteCar: async (id: number) => {
    try {
      console.log('API: Deleting car with ID:', id);
      const response = await axiosInstance.delete(`/cars/${id}/`);
      return response.data;
    } catch (error) {
      console.error('API: Error deleting car:', error);
      throw error;
    }
  },
  
  // Furgon operations
  getFurgons: async () => {
    try {
      const response = await axiosInstance.get('/furgon/');
      return response.data;
    } catch (error) {
      console.error('Error fetching furgons:', error);
      throw error;
    }
  },
  
  deleteFurgon: async (id: number) => {
    try {
      console.log('API: Deleting furgon with ID:', id);
      const response = await axiosInstance.delete(`/furgon/${id}/`);
      return response.data;
    } catch (error) {
      console.error('API: Error deleting furgon:', error);
      throw error;
    }
  }
}; 