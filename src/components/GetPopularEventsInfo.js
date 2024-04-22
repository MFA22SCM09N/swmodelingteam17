import axios from 'axios';


export async function fetchPopularEvents(eventType, latitude, longitude, postal, city, radius, unit) {
    try {
        const response = await axios.get('http://localhost:5006/getPopularEvents', {
            params: { eventType, latitude, longitude, postal, city, radius, unit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching places:', error);
        return [];
    }
}
