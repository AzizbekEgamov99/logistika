import axiosInstance from "../../../../api/axiosInstance";
import { API_URLS } from "../../../../api/apiConfig";
import { DriverType, DriverFilter, DriversResponse } from '../../types/driver';

export const getAllDrivers = async (params: DriverFilter): Promise<DriversResponse> => {
    try {
        console.log('API request params:', params);
        let fullname = params.search ? params.search.trim() : undefined;
        if (fullname) {
            const lowerCaseSearch = fullname.toLowerCase();
            if (lowerCaseSearch === 'kutishda' || lowerCaseSearch === 'kutish' || 
                lowerCaseSearch === 'yo\'lda' || lowerCaseSearch === 'yolda') {
                fullname = undefined;
            }
        }
        
        const apiParams = {
            page: params.page,
            page_size: params.pageSize,
            fullname: fullname,
            status: params.status === 'all' ? 'driver' : params.status,
            ordering: params.sortBy ? `${params.sortOrder === 'descend' ? '-' : ''}${params.sortBy}` : undefined,
            is_busy: typeof params.is_busy === 'boolean' ? params.is_busy : undefined
        };
        
        console.log('Transformed API params:', apiParams);
        
        const cleanParams: Record<string, string | number | boolean> = {};
        Object.entries(apiParams).forEach(([key, value]) => {
            if (value !== undefined) {
                cleanParams[key] = value as string | number | boolean;
            }
        });
        
        const queryString = new URLSearchParams(cleanParams as Record<string, string>).toString();
        const url = `${API_URLS.drivers}${queryString ? `?${queryString}` : ''}`;
        
        console.log('Final API URL:', url);
        
        const response = await axiosInstance.get(url);
        const data = Array.isArray(response.data) ? {
            count: response.data.length,
            next: null,
            previous: null,
            results: response.data
        } : response.data;

        console.log('Formatted Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
    }
};

export const getDriver = async (id: number): Promise<DriverType> => {
    try {
        const response = await axiosInstance.get(`${API_URLS.drivers}${id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching driver ${id}:`, error);
        throw error;
    }
};

export const createDriver = async (data: Partial<DriverType>): Promise<DriverType> => {
    try {
        console.log('Creating driver with data:', data);

        // Define required fields
        if (!data.fullname) {
            throw new Error('Haydovchi F.I.O kiritilishi shart');
        }
        if (!data.phone_number) {
            throw new Error('Telefon raqami kiritilishi shart');
        }

        const cleanPhone = data.phone_number.replace(/\D/g, '');
        const username = data.username || cleanPhone;
        const password = data.password || cleanPhone;
        const statusValue = data.status || 'driver';
        const driverData = {
            fullname: data.fullname,
            username: username,
            password: password,
            phone_number: data.phone_number,
            status: statusValue
        };
        console.log('Sending driver data to API:', driverData);
        try {
            const response = await axiosInstance.post(API_URLS.drivers, driverData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.status) {
                console.log('Status error, trying without status field');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { status: _unusedStatus, ...dataWithoutStatus } = driverData;
                const newResponse = await axiosInstance.post(API_URLS.drivers, dataWithoutStatus);
                return newResponse.data;
            }
            throw error;
        }
    } catch (error) {
        console.error('Error creating driver:', error);
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            let errorMessage = '';

            if (typeof errorData === 'object') {
                Object.entries(errorData).forEach(([field, message]) => {
                    errorMessage += `${field}: ${Array.isArray(message) ? message.join(', ') : message}\n`;
                });
                if (errorMessage.includes('status')) {
                    errorMessage += '\n\nBu ishlatilgan status qiymati: "' + data.status + '"';
                }
            } else {
                errorMessage = String(errorData);
            }
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const updateDriver = async (id: number, data: Partial<DriverType>): Promise<DriverType> => {
    try {
        console.log(`Updating driver ${id} with data:`, data);
        const driverId = Number(id);
        if (!id || isNaN(driverId)) {
            throw new Error(`Invalid driver ID: ${id}`);
        }
        // Use the correct API endpoint for drivers
        const updateUrl = `/customusers/${driverId}/`;
        
        // Include all relevant fields in the update
        const updateData = {
            username: data.username,
            fullname: data.fullname || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            status: data.status,
            address: data.address,
            passport: data.passport,
            passport_series: data.passport_series,
            passport_number: data.passport_number,
            passport_issued_by: data.passport_issued_by,
            passport_issued_date: data.passport_issued_date,
            passport_birth_date: data.passport_birth_date,
            license_number: data.license_number,
            license_expiry: data.license_expiry,
        };
        
        // Only include photo if it's a new upload (not a URL string)
        if (data.photo && !data.photo.startsWith('http') && !data.photo.startsWith('/media/')) {
            (updateData as any).photo = data.photo;
        }
        
        // Only include passport_photo if it's a new upload
        if (data.passport_photo && !data.passport_photo.startsWith('http') && !data.passport_photo.startsWith('/media/')) {
            (updateData as any).passport_photo = data.passport_photo;
        }
        
        // Filter out undefined values
        const cleanUpdateData = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(updateData).filter(([_key, v]) => v !== undefined)
        );
        
        console.log('Sending update data:', cleanUpdateData);
        // Use PATCH to update only the provided fields
        const response = await axiosInstance.patch(updateUrl, cleanUpdateData);
        console.log('Update driver response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating driver ${id}:`, error);
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            let errorMessage = '';

            if (typeof errorData === 'object') {
                Object.entries(errorData).forEach(([field, message]) => {
                    const fieldMsg = Array.isArray(message) ? message.join(', ') : message;
                    errorMessage += `${field}: ${fieldMsg}\n`;
                });
            } else {
                errorMessage = String(errorData);
            }
            throw new Error(errorMessage || "Haydovchini yangilashda xatolik yuz berdi");
        }
        throw error;
    }
};

export const deleteDriver = async (id: number): Promise<void> => {
    if (!id) {
        throw new Error('ID is required');
    }

    try {
        console.log(`Deleting driver with ID: ${id}`);
        
        // First check if driver is associated with trips
        try {
            const checkResponse = await axiosInstance.get(`/rays/driver/${id}/`);
            const trips = checkResponse.data;
            
            if (Array.isArray(trips) && trips.length > 0) {
                // Driver has associated trips - cannot be deleted
                const message = `Haydovchi o'chirilmadi. Haydovchi ${trips.length} ta reys bilan bog'langan.`;
                console.error(message);
                throw new Error(message);
            }
        } catch (checkError) {
            // If error is not related to finding trips, ignore and continue with deletion
            if (checkError.response && checkError.response.status !== 404) {
                console.warn('Error checking driver trips:', checkError);
            }
        }
        
        // Use the correct API endpoint for driver deletion
        const response = await axiosInstance({
            method: 'DELETE',
            url: `/customusers/${id}/`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`Driver ${id} successfully deleted`);
        return response.data;
    } catch (error) {
        console.error('Delete API error:', error);
        
        // Handle specific error cases
        if (error.response) {
            const { status, data } = error.response;
            
            if (status === 400 || status === 409) {
                // Driver cannot be deleted due to constraints
                const errorMessage = data.detail || data.message || 
                    "Haydovchini o'chirib bo'lmaydi, chunki u boshqa ma'lumotlar bilan bog'langan.";
                throw new Error(errorMessage);
            } else if (status === 403) {
                throw new Error("Haydovchini o'chirishga ruxsat yo'q.");
            } else if (status === 404) {
                throw new Error("Haydovchi topilmadi.");
            }
        }
        
        if (error.message && error.message.includes("bog'langan")) {
            // This is our custom error from the trip check above
            throw error;
        }
        
        // Default error
        throw new Error("Haydovchini o'chirishda xatolik yuz berdi. Server javob bermayapti.");
    }
};

export const createDriverWithPhoto = async (formData: FormData): Promise<DriverType> => {
    try {
        console.log('Creating driver with FormData');
        
        // Create a new clean FormData to ensure correct structure
        const cleanFormData = new FormData();
        
        // Log and transfer all entries to the clean FormData
        console.log('FormData entries:');
        for (const pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
                // Preserve the filename when adding to FormData
                cleanFormData.append(pair[0], pair[1], pair[1].name);
            } else {
                console.log(`${pair[0]}: ${pair[1]}`);
                cleanFormData.append(pair[0], pair[1]);
            }
        }
        
        // Check if photo is in FormData
        const hasPhoto = cleanFormData.has('photo');
        console.log('Photo file present in FormData:', hasPhoto);
        
        if (hasPhoto) {
            const photo = cleanFormData.get('photo');
            if (photo instanceof File) {
                console.log(`Photo file details: Name: ${photo.name}, Size: ${photo.size} bytes, Type: ${photo.type}`);
            }
        }

        const response = await axiosInstance.post(API_URLS.drivers, cleanFormData);
        
        console.log('Driver creation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating driver with photo:', error);
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            let errorMessage = '';

            if (typeof errorData === 'object') {
                Object.entries(errorData).forEach(([field, message]) => {
                    errorMessage += `${field}: ${Array.isArray(message) ? message.join(', ') : message}\n`;
                });
            } else {
                errorMessage = String(errorData);
            }
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const updateDriverWithPhoto = async (id: any, formData?: FormData): Promise<DriverType> => {
    try {
        console.log(`Updating driver ${id} with FormData`);
        
        if (id && typeof id === 'object' && 'id' in id && 'data' in id) {
            formData = id.data;
            id = id.id;
            console.log('Extracted id and formData from object parameter:', { id, formDataEntries: formData instanceof FormData });
        }
        
        const driverId = Number(id);
        if (!id || isNaN(driverId)) {
            throw new Error(`Invalid driver ID: ${id}`);
        }
        
        if (!formData || !(formData instanceof FormData)) {
            throw new Error('FormData is required for updateDriverWithPhoto');
        }
        const cleanFormData = new FormData();
        console.log('FormData entries:');
        for (const pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log(`${pair[0]}: File object - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
                cleanFormData.append(pair[0], pair[1], pair[1].name);
            } else {
                console.log(`${pair[0]}: ${pair[1]}`);
                cleanFormData.append(pair[0], pair[1]);
            }
        }
        const hasPhoto = cleanFormData.has('photo');
        if (hasPhoto) {
            const photo = cleanFormData.get('photo');
            if (photo instanceof File) {
                console.log(`Photo file details: Name: ${photo.name}, Size: ${photo.size} bytes, Type: ${photo.type}`);
            }
        }
        
        const updateUrl = `/customusers/${driverId}/`;
        const response = await axiosInstance.patch(updateUrl, cleanFormData);
        return response.data;
    } catch (error) {
        console.error(`Error updating driver ${id} with photo:`, error);
        throw error;
    }
};