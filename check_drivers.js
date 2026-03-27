import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://logistika.api.ardentsoft.uz/';
const apiURL = (baseURL.endsWith('/') ? baseURL : baseURL + '/') + 'customusers/';

async function checkDrivers() {
    try {
        console.log(`Fetching from ${apiURL}...`);
        const response = await axios.get(apiURL);
        const data = response.data.results || response.data;
        
        console.log(`Found ${data.length} drivers.`);
        data.forEach(driver => {
            console.log(`ID: ${driver.id}, Name: ${driver.fullname}, Photo: ${JSON.stringify(driver.photo)}`);
        });
    } catch (error) {
        console.error('Error fetching drivers:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

checkDrivers();
