import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import {fetchPopularEvents} from './GetPopularEventsInfo';

const purpleMarkerIcon = { //For Concerts
    url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    scaledSize: {
      width: 40,
      height: 40
    }
  };

const customMarkerIcon = { url: '/mapsMarker.png',
  scaledSize: {
    width: 40,
    height: 40
  }}

async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  const locationData = await response.json();
  return locationData;
}

async function getSportEventsCoordinates(currentLocation) {
    try {
        if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
            console.error("Error fetching sport events: Current location data is invalid.");
            return [];
        }

        const sportEventResponse = await fetchPopularEvents("Sports", currentLocation.latitude, currentLocation.longitude, currentLocation.postal, currentLocation.city, "100", "miles", "100");
        const formattedSportEvents = sportEventResponse._embedded.events.reduce(
            (accumulator, event) => {
                if (!event.name.toLowerCase().includes('tour')) {
                    accumulator.push({
                        name: event.name,
                        coordinates: {
                            latitude: parseFloat(event._embedded.venues[0].location.latitude),
                            longitude: parseFloat(event._embedded.venues[0].location.longitude),
                        },
                    });
                }
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

  


// Modal To display Google Map and Recommendation based on location and weather
const DisplayHeatMap = (props) => {
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [sportEventsCoordinates, setSportEventsCoordinates] = useState("");

  useEffect(() => {
    return () => {
      // Remove the existing map when the component is unmounted
      setMap(null);
    };
  }, []);



  useEffect(() => {
    if (!props.showHeatMap) {
      // Remove the existing map when showHeatMap is set to false
      setMap(null);
    }
  }, [props.showHeatMap]);

  useEffect(() => {
    console.log(props.showHeatMap);
    if(props.showHeatMap){
      console.log('Heat map')
      handleClick();
    }}, [props.showHeatMap]);

  

  useEffect(() => {
    // Fetch current location and weather data
    const fetchData = async () => {
      const locationData = await getLocation();
      setCurrentLocation(locationData);
    };
    fetchData();
  }, []);


  useEffect(() => {
      // If current location is available, fetch sport events coordinates
      const fetchSportEvents = async () => {
        const events = await getSportEventsCoordinates(currentLocation);
        console.log("Events:", events);
        setSportEventsCoordinates(events);
      };
      fetchSportEvents();
  }, []);

  useEffect(() => {
    if (open && map === null && currentLocation !== null && sportEventsCoordinates !== "") {
      // If modal is open, map is not initialized yet, current location is available, and sport events coordinates are set
      const timeout = setTimeout(() => {
        initializeMap();
      }, 100);
      
      // Clean up function
      return () => clearTimeout(timeout);
    }
  }, [open, map, currentLocation, sportEventsCoordinates]);
  
  
  
  const initializeMap = () => {

    console.log("Current location:", currentLocation);
  
    if (!currentLocation) {
    console.log("Current location is not available yet.");
    return;
    }
    console.log(sportEventsCoordinates);
    if (!sportEventsCoordinates) {
        console.log("Sport event coordinates are not available yet.");
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
  
   

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
      }
  

    
    // Add marker
    const marker = new window.google.maps.Marker({
      position: mapCenter,
      map: displayMap,
      icon: customMarkerIcon,
      label: {
        text: 'You are Here',
        color: 'darkblue'
      }
    });
    marker.addListener("click", toggleBounce);


    console.log(sportEventsCoordinates);

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
    var heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.setMap(displayMap);
  };

   const handleClick = async () => {
    setOpen(true);
    console.log(currentLocation);
  };

  const handleClose = () => {
    setOpen(false);
    setMap(null);
  };


  return (
    <>
      
        
          <div
            id="google-map"
            style={{ width: '520', height: '600px' }} // Adjust height as needed
          ></div>


    </>
  );
};

export default DisplayHeatMap;

