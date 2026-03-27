import axiosInstance from '../../../../api/axiosInstance';

export interface Country {
  id: number;
  name: string;
}
export const getAllCountries = async (): Promise<Country[]> => {
  try {
    const response = await axiosInstance.get('/country/');
    console.log('Country API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return default countries as fallback in case of API failure
    return [
      { id: 1, name: 'Uzb' },
      { id: 2, name: 'Chet' },
    ];
  }
};

export const countryApi = {
  getAllCountries
};