import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OpenAI from "openai";
import { CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import SportsIcon from '@mui/icons-material/Sports';
import { fetchImage } from '../../../components/GetPopularEventsInfo';
import emailjs from 'emailjs-com';


const OPENAI_API_KEY='OPEN-AI-KEY';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});



const messages = [
  {
    role: "system",
    content: `You are a helpful assistant. Only use the functions you have been provided with.`,
  },
];
 


const AskAI = ({ open, onClose, submittedDetails }) => {
  const [generatedItinerary, setGeneratedItinerary] = useState('');
  const [formattedItinerary, setFormattedItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeImage, setPlaceImage] = useState('');

  useEffect(() => {
    if (open) {
      generateItinerary();
      fetchPlaceImage(submittedDetails.destination);
    }
  }, [open]);

  const fetchPlaceImage = async (destination) => {
    try {
      const response = await fetchImage(destination); // Use fetchImage function to fetch image
      const imageUrl = response.images_results[0].original;
      if (imageUrl) {
        setPlaceImage(imageUrl);
      } else {
        console.error('No image found for the destination:', destination);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const formatItinerary = (tripDetails, itinerary) => {
    const { destination, budget, numberOfDays, sportPreferences } = tripDetails;
  
    // Split the itinerary into days
    console.log(itinerary);
    const days = itinerary.split('Day');
    return (
      <div>
        {days.map((day, index) => {
          if (index === 0) return null; // Skip the first empty element
          const activities = day.split('-').filter(activity => activity.trim() !== '');
          const limitedActivities = activities.slice(1, 5); // Display only the first  activities
          return (
            <div key={index}>
              <Typography variant="h6" component="h3" gutterBottom>
                Day {index}
              </Typography>
              <ul>
                {limitedActivities.map((activity, idx) => (
                  <li key={idx}>{activity.trim()}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };
  


  const generateItinerary = async () => {
    setLoading(true);
    try {
      const response = await createPlanItinerary(submittedDetails);
      if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
        const formattedResponse = formatItinerary(submittedDetails, response.choices[0].message.content);
        setGeneratedItinerary(formattedResponse);
        setFormattedItinerary(response.choices[0].message.content);
        console.log(formattedResponse);
        
      } else {
        console.error('Invalid response format:', response); // Log invalid response format
        setGeneratedItinerary("");
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };
  
  
  

  const createPlanItinerary = async (details) => {
    const queryString = constructQueryString(details);
    let messages = [{
      role: "user",
      content: queryString,
    }];
    try {
      let response;
      for (let i = 0; i < 5; i++) {
        response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-16k",
          messages: messages,
        });
      }
      return response;
  
    } catch (error) {
      console.error('Error:', error); // Log error
      throw error;
    }
  };
  

  const constructQueryString = (details) => {
    // Constructing the query string based on user input
    let queryString = `Plan a trip to ${details.destination} for ${details.numberOfDays} days,`;
    queryString += ` with preferences for ${details.sportPreferences.join(', ')},`;
    queryString += ` and a budget of $${details.budget}.`;
    queryString += ` Accommodation type: ${details.accommodationType},`;
    queryString += ` Transportation: ${details.transportation},`;
    queryString += ` Additional preferences: ${details.additionalPreferences}.`;
    queryString += ` Avoid links`;
  
    return queryString;
  };

  const stripHtmlTags = (htmlString) => {
    const regex = /(<([^>]+)>)/gi;
    return htmlString.replace(regex, '');
  };


   const sendEmail = () => {
    // Use emailjs to send email
    const userEmailAddress = sessionStorage.getItem('loggedUser');
    emailjs.init('rYVZ2AYOsKmxkU7-_');
    emailjs.send('service_qgn9duc', 'template_92ue9ai', {
      destination: submittedDetails.destination,
      image: placeImage,
      budget: submittedDetails.budget,
      numberOfDays: submittedDetails.numberOfDays,
      sportPreferences: submittedDetails.sportPreferences.join(', '), // Join sport preferences into a string
      generatedItineraryMessage: formattedItinerary,
      userEmail: userEmailAddress,
    })
    .then((response) => {
      console.log('Email sent successfully:', response);
      alert('Email sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
  };
  



  
  

  return (
    <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="ask-ai-modal"
    aria-describedby="ask-ai-modal-description"
  >
    <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 700,
            bgcolor: 'grey.800',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
            borderRadius: '10px',
          }}
        >
      <Typography variant="h5" component="h4" marginLeft={16} marginBottom={2} display="flex" alignItems="center">
    <LocationOnIcon /> Plan Itinerary for Trip to {submittedDetails.destination}
  </Typography>
  {placeImage && (
        

          <img
            src={placeImage}
            alt="Place"
            style={{
              width: '100%',
              height: '50%',
              boxShadow: '0 0 20px 5px rgba(51, 136, 255, 0.3)',
              borderRadius: '10px',
            }}
          />  )}



<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' , marginLeft: '35px'}}>
  
  <Typography variant="body1" gutterBottom display="flex" alignItems="center" marginLeft={2}>
    <AttachMoneyIcon /> Budget: ${submittedDetails.budget}
  </Typography>
  <Typography variant="body1" gutterBottom display="flex" alignItems="center" marginLeft={2}>
    <EventIcon /> Number of days: {submittedDetails.numberOfDays}
  </Typography>
  <Typography variant="body1" gutterBottom display="flex" alignItems="center" marginLeft={2}>
    <SportsIcon /> Sport preferences: {submittedDetails.sportPreferences.join(', ')}
  </Typography>
</Box>


      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
          {generatedItinerary}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
  <Button
    onClick={onClose}
    variant="contained"
    color="primary"
    style={{ marginRight: '10px' }}
  >
    Close
  </Button>

  <Button
    onClick={sendEmail}
    variant="contained"
    color="primary"
  >
    Send Email
  </Button>
</div>


        </div>
      )}
    </Box>
  </Modal>
  );
};

export default AskAI;