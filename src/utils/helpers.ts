import { baseURL } from '../api/axiosInstance';

export const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return '/no-image.png'; 
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
        return `${baseURL}${imageUrl}`;
    }
    return `${baseURL}/${imageUrl}`;
}; 