import { clientApi as accountingClientApi } from "../../../accounting/api/client/clientApi";
const getClientAnalytics = async (id: number) => {
  try {
    const clientDetails = await accountingClientApi.getClientById(id);
    return {
      ...clientDetails,
      totalRevenue: 0,
      recentTrips: 0,
      averageTripsPerMonth: 0
    };
  } catch (error) {
    console.error('Error fetching client analytics:', error);
    throw error;
  }
};

// Export the client API with our additions
export const clientApi = {
  // Include all base functions from accounting
  ...accountingClientApi,
  // Add CEO-specific functions
  getClientAnalytics
};

// Export CEO-specific functions separately
export { getClientAnalytics };

// Also export individual functions for convenience
export const { 
  getAllClients, 
  getClientById, 
  createClient, 
  updateClient, 
  deleteClient 
} = clientApi; 