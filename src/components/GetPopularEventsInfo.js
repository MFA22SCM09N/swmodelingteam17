import axios from 'axios';

export async function indexEventsToServer(events) {
    try {
        for (const event of events) {
            const response = await axios.post('http://localhost:5021/indexEvents', {event});
        }
    } catch (error) {
        console.error('Error indexing events:', error);
    }
}

export async function searchEvent(title) {
    try {

        const response = await axios.get('http://localhost:5021/search', {
            params: { title }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching for events:', error);
        return [];
    }
}



export async function fetchPopularEvents(eventType, latitude, longitude, postal, city, radius, unit, size) {
   
    try {
        const response = await axios.get('http://localhost:5021/getPopularEvents', {
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
        const response = await axios.get('http://localhost:5021/getNearbyPlacesInfo', {
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
        const response = await axios.get('http://localhost:5021/ImageFromSerpAPI', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        return [];
    }
}
