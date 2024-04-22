import OpenAI from "openai";
import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';


const OPENAI_API_KEY='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';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


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
  const url = `http://localhost:5006/api?latitude=${latitude}&longitude=${longitude}&q=${q}`;
  console.log(url);
  
  try {
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log( typeof data);
    const data_ = JSON.parse(data);
    const sliced = data_._embedded.events.slice(0, 3); // Return top 3 
    // console.log(data_._embedded.events[0].name);
    return sliced;
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

// // Example usage
async function fetchRecommendations(currLoc) {
  const sportsEvents = await apiCall(currLoc.latitude, currLoc.longitude, "Sports Events");
  // const sportsEvents = 0;
  console.log("Sports Events:");
  console.log(sportsEvents);
  return {sportsEvents};
}

// Modal To display Google Map and Recommendation based on location and weather
const RecommendationModal = () => {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Fetch current location and weather data
    const fetchData = async () => {
      const locationData = await getLocation();
      setCurrentLocation(locationData);
      const weatherData = await getCurrentWeather(locationData.latitude, locationData.longitude);
      setCurrentWeather(weatherData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (open && map === null) {
      // If modal is open and map is not initialized yet
      const timeout = setTimeout(() => {
        initializeMap();
      }, 100);
      
      // Clean up function
      return () => clearTimeout(timeout);
    }
  }, [open, map]);

  const initializeMap = () => {

    console.log("Current location:", currentLocation);
  
  if (!currentLocation) {
    console.log("Current location is not available yet.");
    return;
  }

    if (typeof google === 'undefined') {
      // Google Maps API is not loaded yet, wait for it
      return;
    }
   
  
    const mapCenter = { lat: currentLocation.latitude, lng: currentLocation.longitude };
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
    const displayMap = new window.google.maps.Map(mapElement, mapOptions);
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

   const handleClick = async () => {
    setOpen(true);
    console.log(currentLocation);
    
    const openAIresponse = await agent(
      // "Please suggest some activities based on my location and the weather."
      "Please suggest 3 real-time sports events based on my current location. Include longitude, latitude, and name"
    );
    let {sportsEvents} = await fetchRecommendations(currentLocation);

    let stringList = []
    stringList.push("Recommendations mention here\n");
    stringList.push("Sports Events \n");

    // addCategoryResponse(stringList, sportsEvents, 3);
    const response = stringList.join(openAIresponse);
    setResponse(response);
    // console.log(response);
  };

  const handleClose = () => {
    setOpen(false);
    setMap(null);
    setResponse('');
  };

  const convertCelsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  return (
    <>
      <Button variant="outlined" size="small" color="primary" onClick={handleClick}>
        Recommended For You
      </Button>
      <Modal open={open} onClose={handleClose} >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, height: 700, bgcolor: 'background.paper', boxShadow: 24, p: 4, overflow: 'auto' }}>
          <Typography id="modal-modal-title" variant="h6" component= "h2">Recommended For You</Typography>
          {/* Google Maps div */}
          <div
            id="google-map"
            style={{ width: '100%', height: '500px' }} // Adjust height as needed
          ></div>
          {/* Display current location and weather */}
          <Typography variant="body1" gutterBottom>
            Current Location: {currentLocation ? `${currentLocation.city}, ${currentLocation.country_name}` : 'Loading...'}
          </Typography>
          <Typography variant="body1" gutterBottom>
          Current Weather: {currentWeather ? `${convertCelsiusToFahrenheit(currentWeather.hourly.apparent_temperature[0])}°F` : 'Loading...'}
          </Typography>
          {/* Display response */}
          <TextField
            fullWidth
            multiline
            rows={10}
            value={response ? response : "Loading Recommendation..."}
            disabled
            variant="outlined"
            sx={{ mt: 2}} 
          />
        </Box>
      </Modal>
    </>
  );
};

export default RecommendationModal;

