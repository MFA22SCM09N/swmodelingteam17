import axios from 'axios';


export async function fetchPopularEvents(eventType, latitude, longitude, postal, city, radius, unit, size) {
   
    try {
        const response = await axios.get('http://localhost:5009/getPopularEvents', {
            params: { eventType, latitude, longitude, postal, city, radius, unit, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function fetchNearbyPlaces(query) {
   
    try {
        const response = await axios.get('http://localhost:5009/getNearbyPlacesInfo', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching places:', error);
        return [];
    }
}


export async function fetchImage(query) {
    try {
        const response = await axios.get('http://localhost:5009/serpAPI', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        return [];
    }
}
