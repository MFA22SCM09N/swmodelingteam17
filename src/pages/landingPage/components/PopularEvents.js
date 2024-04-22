import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { fetchPopularEvents } from '../../../components/GetPopularEventsInfo';

const Events = () => {
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();
        setLocation(locationData);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      if (location) {
        try {
          const { latitude, longitude, postal, city } = location;
          const sportEventResponse = await fetchPopularEvents(
            'Sports',
            latitude,
            longitude,
            postal,
            city,
            '100',
            'miles'
          );
          const formattedSportEvents = sportEventResponse._embedded.events.reduce(
            (accumulator, event) => {
              if (!event.name.toLowerCase().includes('tour')) {
              accumulator.push({
                name: event.name,
                place: event._embedded.venues[0].name,
                date: event.dates.start.localDate,
                time: event.dates.start.localTime,
                ticketLink: event.url,
                photo: event.images[0].url,
                externalLinks: {
                  twitter: 'https://twitter.com/whitesox',
                  wiki: 'https://en.wikipedia.org/wiki/Chicago_White_Sox',
                  facebook: 'https://www.facebook.com/WhiteSox',
                  instagram: 'https://www.instagram.com/whitesox',
                  homepage: 'https://www.mlb.com/whitesox',
                },
                parkingDetail: 'Parking in lots located adjacent to the stadium both to the north and to the south. Parking can be purchased at the park or in advance for $20. Please note - all cash parking day of game is located in the south lots.',
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
          setEvents(formattedSportEvents.slice(0, 9));
        } catch (error) {
          console.error('Error fetching Sports information:', error);
        }
      }
    };
  
    getEvents();
  }, [location]);
  
  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
    setSelectedEvent(events[index]);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleBuyTickets = () => {
    const selectedEvent = events[selectedItemIndex];
    if (selectedEvent && selectedEvent.ticketLink) {
      window.open(selectedEvent.ticketLink, '_blank');
    }
  };

  return (
    <Container
      id="events"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          borderRadius: '10px',
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary">
          Popular events near you
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the buzz around town with our selection of popular events happening near you.
          Dive into the excitement of local happenings, where every event promises an unforgettable experience.
          Join us in exploring the best that your area has to offer!
        </Typography>
      </Box>
      <Grid container spacing={2}>
  {events.map((event, index) => (
    <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
      <Card
        variant="outlined"
        sx={{
          p: 3,
          height: '100%',
          width: '100%',
          background: 'none',
          backgroundColor: selectedItemIndex === index ? 'action.selected' : undefined,
          borderColor: 'primary.dark',
          boxShadow: selectedItemIndex === index
            ? '0 0 10px 3px rgba(0, 0, 0, 0.2), 0 0 40px 3px rgba(0, 0, 0, 0.1)'
            : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
        onClick={() => handleItemClick(index)}
      >
        <img src={event.photo} alt={event.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <CardContent>
          <Typography variant="h6" color="text.primary">
            {event.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <LocationOnIcon sx={{ marginRight: 1, marginBottom: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {event.place}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ marginRight: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {event.date}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>




      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
          <img
            src={selectedEvent && selectedEvent.photo}
            alt={selectedEvent && selectedEvent.name}
            style={{
              width: '100%',
              height: '50%',
              boxShadow: '0 0 20px 5px rgba(51, 136, 255, 0.3)',
              borderRadius: '10px',
            }}
          />
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mt: 2 }}>
            {selectedEvent && selectedEvent.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            {selectedEvent && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedEvent.place
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedEvent.place}
                  </Link>
                  <Box sx={{ ml: 1, mr: 1 }}> </Box>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Link
                    href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      selectedEvent.name
                    )}&dates=${encodeURIComponent(selectedEvent.date)}&details=${encodeURIComponent(
                      selectedEvent.place
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedEvent.date}
                  </Link>
                  <Box sx={{ ml: 1, mr: 1 }}> </Box>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Link
                    href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      selectedEvent.name
                    )}&dates=${encodeURIComponent(selectedEvent.date + 'T' + selectedEvent.time)}&details=${encodeURIComponent(
                      selectedEvent.place
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedEvent.time}
                  </Link>
                </Box>
              </>
            )}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <DirectionsCarIcon sx={{ marginRight: 1 }} />
            <Typography variant="h6" color="text.primary">
              Parking Details:
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, display: 'inline-flex' }}>
            {selectedEvent && selectedEvent.parkingDetail}
          </Typography>

          <Box sx={{ display: 'flex', mt: 2, ml: 23 }}>
            {selectedEvent &&
              selectedEvent.externalLinks &&
              Object.entries(selectedEvent.externalLinks).map(([key, url]) => (
                <Link key={key} href={url} target="_blank" rel="noopener noreferrer" sx={{ mr: 2 }}>
                  {key === 'twitter' && <TwitterIcon />}
                  {key === 'wiki' && <InsertLinkIcon/> }
                  {key === 'facebook' && <FacebookIcon />}
                  {key === 'instagram' && <InstagramIcon />}
                  {key === 'homepage' && <WebIcon />}
                </Link>
              ))}
          </Box>

          <Button variant="contained" color="primary" onClick={handleBuyTickets} sx={{ mt: 3, ml: 30 }}>
            Buy Tickets
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Events;
