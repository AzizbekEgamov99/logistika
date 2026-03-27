import axios from 'axios';
export const testBackendConnection = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ''}health`);
        console.log('Backend connection successful:', response.data);
        return true;
    } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
    }
}; 