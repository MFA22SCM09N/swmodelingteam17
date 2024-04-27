import OpenAI from "openai";
import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import {fetchPopularEvents} from './GetPopularEventsInfo';

const OPENAI_API_KEY='API_KEY';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

let markers=[];
let heapMap;

let displayMap;
async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  const locationData = await response.json();
  console.log(locationData);
  return locationData;
}
 
async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}
 
const tools = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "string",
          },
          longitude: {
            type: "string",
          },
        },
        required: ["longitude", "latitude"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get the user's location based on their IP address",
      parameters: {
        type: "object",
        properties: {},
      },
    }
  },
];
 
const availableTools = {
  getCurrentWeather,
  getLocation,
};
 
const messages = [
  {
    role: "system",
    content: `You are a helpful assistant. Only use the functions you have been provided with.`,
  },
];
 
async function agent(userInput) {
  messages.push({
    role: "user",
    content: userInput,
  });
 
  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: messages,
      tools: tools,
    });
 
    const { finish_reason, message } = response.choices[0];
 
    if (finish_reason === "tool_calls" && message.tool_calls) {
      const functionName = message.tool_calls[0].function.name;
      const functionToCall = availableTools[functionName];
      const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
      const functionArgsArr = Object.values(functionArgs);
      const functionResponse = await functionToCall.apply(
        null,
        functionArgsArr
      );
 
      messages.push({
        role: "function",
        name: functionName,
        content: `
                The result of the last function was this: ${JSON.stringify(
                  functionResponse
                )}
                `,
      });
    } else if (finish_reason === "stop") {
      messages.push(message);
      return message.content;
    }
  }
  return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

// const SERP_API_KEY = "e2d189aa1592d44a31509420c9975876592327fa5f3ed161d8f8bef08628b3c5";

// Function to fetch events
async function apiCall(latitude, longitude, q) {
  // call server here
  const url = `http://localhost:5021/api?latitude=${latitude}&longitude=${longitude}&q=${q}`;
  console.log(url);
  
  try {
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log( typeof data);
    const data_ = JSON.parse(data);
    const sliced = data_._embedded.events.slice(0, 90); // Return top 9
    return sliced;
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

async function getSportEventsCoordinates(currentLocation) {
  try {
      if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
          console.error("Error fetching sport events: Current location data is invalid.");
          return [];
      }

      const sportEventResponse = JSON.parse(await fetchPopularEvents("Sports", currentLocation.latitude, currentLocation.longitude, currentLocation.postal, currentLocation.city, "100", "miles", "100"));
      const formattedSportEvents = sportEventResponse._embedded.events.reduce(
          (accumulator, event) => {
              // if (!event.name.toLowerCase().includes('tour')) {
                  accumulator.push({
                      name: event.name,
                      coordinates: {
                          latitude: parseFloat(event._embedded.venues[0].location.latitude),
                          longitude: parseFloat(event._embedded.venues[0].location.longitude),
                      },
                  });
              // }
              return accumulator;
          },
          []
      );
      console.log("Formatted sport events:", formattedSportEvents);
      return formattedSportEvents;
  } catch (error) {
      console.error("Error fetching sport events:", error);
      return [];
  }
}

// // Example usage
async function fetchRecommendations(currentLocation) {
  const sportsEvents = await apiCall(currentLocation.latitude, currentLocation.longitude, "Sports Events");
  console.log("Sports Events:");
  console.log(sportsEvents);
  return {sportsEvents};
}

// Modal To display Google Map and Recommendation based on location and weather
const RecommendationModal = (props) => {
  // const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [map, setMap] = useState(null);
  const [sportEventsCoordinates, setSportEventsCoordinates] = useState([]);


  
  useEffect(() => {
    // Fetch current location and weather data
    const fetchData = async () => {
      const locationData = await getLocation();
      setCurrentLocation(locationData);
      const weatherData = await getCurrentWeather(locationData.latitude, locationData.longitude);
      setCurrentWeather(weatherData);
    };
    fetchData();
    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  useEffect(() => {
    if (map === null) {
      // If modal is open and map is not initialized yet
      const timeout = setTimeout(() => {
        initializeMap();
      }, 100);
      
      // Clean up function
      return () => clearTimeout(timeout);
    }
  }, [map]);

  useEffect(() => {
    console.log(props.showRecommendations);
    if(props.showRecommendations){
      console.log('value changed!')
      setSportEventsCoordinates([]);
      handleClick();
    } else{
      setResponse("");
      markers.forEach(marker => marker.setMap(null));
        markers = []
    }}, [props.showRecommendations]);

    useEffect(() => {
      console.log(sportEventsCoordinates);
      if(sportEventsCoordinates.length> 0){
        var heatmapData = [];
        
        sportEventsCoordinates.forEach(event => {
            try {
    
                // Fetch coordinates for event location
                const latitude = event.coordinates.latitude;
                const longitude = event.coordinates.longitude;
    
                const latLng = new window.google.maps.LatLng(latitude, longitude);
                latLng.weight = 2.0;
    
                // Push the LatLng object into the heatmapData array
                heatmapData.push(latLng);
    
                // heatmapData.push(new window.google.maps.LatLng(latitude,longitude));
    
            } catch (error) {
                console.error('Error adding marker:', error);
            }
        });
        console.log(heatmapData);
        heapMap = new window.google.maps.visualization.HeatmapLayer({
            data: heatmapData
          });
          heapMap.setMap(displayMap);
      } else {
        if(heapMap)
          heapMap.setMap(null);
      }}, [sportEventsCoordinates]);

    useEffect(() => {
      console.log(props.showHeatMap);
      if(props.showHeatMap){
        const fetchSportEvents = async () => {
          const events = await getSportEventsCoordinates(currentLocation);
          console.log("Events:", events);
          setSportEventsCoordinates(events);
          return events;
        };
        fetchSportEvents();
        console.log(sportEventsCoordinates);
        
      } else{
        setSportEventsCoordinates([]);
      }}, [props.showHeatMap]);

  const initializeMap = async () => {

    const currLocation = await getLocation();
  
    if (!currLocation) {
      console.log("Current location is not available yet.");
      return;
    }

    if (typeof google === 'undefined') {
      // Google Maps API is not loaded yet, wait for it
      return;
    }
   
    console.log("my location", typeof currLocation.latitude);
    const mapCenter = { lat: currLocation.latitude, lng: currLocation.longitude };
    console.log("mapCenter :",mapCenter );
    const mapElement = document.getElementById('google-map');
    console.log("Map element:", mapElement);
    if (!mapElement) {
      console.log("Map element:", mapElement);
      return;
    }
  
    const mapOptions = {
      center: mapCenter,
      zoom: 10,
    };
    displayMap = new window.google.maps.Map(mapElement, mapOptions);
    setMap(displayMap);
  
    const customMarkerIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: {
      width: 40,
      height: 40
    }}

    
    // Add marker
    new window.google.maps.Marker({
      position: mapCenter,
      map: displayMap,
      icon: customMarkerIcon,
      label: {
        text: 'You are Here',
        color: 'darkblue'
      }
    });
  };
  const addCategoryResponse = (categoryType) => {
    let latitude = 0;
    let longitude = 0;
    let count =0;

    // set marker default for sports events
    let colorCfg = 'orange';
    let customMarkerIcon = { url: 'https://maps.gstatic.com/mapfiles/ms2/micons/sportvenue.png',
    scaledSize: {
      width: 40,
      height: 40
    }};

    for(let i=0; i< categoryType.length; i++){
      if(count==9){
        break;
      }
      let category = categoryType[i];
      if(category._embedded){
        if(category._embedded.venues[0].location){
          if (latitude == category._embedded.venues[0].location.latitude && longitude == category._embedded.venues[0].location.longitude){
            continue;
          }
          latitude = category._embedded.venues[0].location.latitude;
          longitude = category._embedded.venues[0].location.longitude;
          // console.log(count);
          console.log(parseFloat(latitude));
          console.log(parseFloat(longitude));
          console.log(category.name);
          const mapPosition = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

          // Add marker
          markers.push(
          new window.google.maps.Marker({
            position: mapPosition,
           
            icon: customMarkerIcon,
            label: {
              text: category.name,
              color: colorCfg
            }
          }));
        }
        
      }
      count = count + 1;

    }
    count = 0;
    markers.forEach(marker => marker.setMap(displayMap));
  }

   const handleClick = async () => {
    // setOpen(true);
    console.log(currentLocation);
    
    let {sportsEvents} = await fetchRecommendations(currentLocation);
    addCategoryResponse(sportsEvents);
  };

  const handleClose = () => {
    // setOpen(false);
    setMap(null);
    setResponse('');
  };

  const convertCelsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  return (
    <>
      {/* <Button variant="outlined" size="small" color="primary" onClick={handleClick}>
        Recommended For You
      </Button> */}
      {/* <Modal > */}
        <Box sx={{
              height: '100%',
              width: '100%',
              
            }}>
          {/* Google Maps div */}
          <div
            id="google-map"
            style={{ width: '100%', height: '100%' }} // Adjust height as needed
          ></div>
          {/* Display current location and weather */}
          <Typography variant="body1" gutterBottom>
            Current Location: {currentLocation ? `${currentLocation.city}, ${currentLocation.country_name}` : 'Loading...'}
          </Typography>
          <Typography variant="body1" gutterBottom>
          Current Weather: {currentWeather ? `${convertCelsiusToFahrenheit(currentWeather.hourly.apparent_temperature[0])}°F` : 'Loading...'}
          </Typography>
          {/* Display response */}
        </Box>
      {/* </Modal> */}
    </>
  );
};

export default RecommendationModal;

