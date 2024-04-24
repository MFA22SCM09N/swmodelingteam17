import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AskAI from './AskAI'; // Import the modal component

export default function PlanYourTrip() {
  const [destination, setDestination] = React.useState('');
  const [numberOfDays, setNumberOfDays] = React.useState('');
  const [sportPreferences, setSportPreferences] = React.useState([]);
  const [budget, setBudget] = React.useState('');
  const [accommodationType, setAccommodationType] = React.useState('');
  const [transportation, setTransportation] = React.useState('');
  const [additionalPreferences, setAdditionalPreferences] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const submittedDetails = {
      destination,
      numberOfDays,
      sportPreferences,
      budget,
      accommodationType,
      transportation,
      additionalPreferences,
    };
    setIsModalOpen(true);
  };

  const handleClearFields = () => {
    setDestination('');
    setNumberOfDays('');
    setSportPreferences([]);
    setBudget('');
    setAccommodationType('');
    setTransportation('');
    setAdditionalPreferences('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#06090a',
      }}
    >
      <Container
        sx={{
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
          }}
        >
          <Typography component="h2" variant="h4">
            Plan Your Trip!
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400', mb: 1 }}>
            Embark on an exhilarating sports adventure with ease! Share your destination, number of days, and sporting interests, 
            and watch as our platform crafts a tailored itinerary brimming with thrilling events and activities, 
            ensuring an unforgettable journey for every sports enthusiast.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} marginTop={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Destination"
                  variant="outlined"
                  fullWidth
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Days"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="sport-preference-label">Sport Preferences</InputLabel>
                  <Select
                    labelId="sport-preference-label"
                    multiple
                    value={sportPreferences}
                    onChange={(e) => setSportPreferences(e.target.value)}
                    label="Sport Preferences"
                  >
                    <MenuItem value="Football">Football</MenuItem>
                    <MenuItem value="Basketball">Basketball</MenuItem>
                    <MenuItem value="Tennis">Tennis</MenuItem>
                    <MenuItem value="Golf">Golf</MenuItem>
                    <MenuItem value="Swimming">Swimming</MenuItem>
                    {/* Add more sports as needed */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Transportation"
                  variant="outlined"
                  fullWidth
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'transparent' } }}
                >
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Bus">Bus</MenuItem>
                  <MenuItem value="Train">Train</MenuItem>
                  <MenuItem value="Flight">Flight</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Accommodation Type"
                  variant="outlined"
                  fullWidth
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'transparent' } }}
                >
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Hostel">Hostel</MenuItem>
                  <MenuItem value="Airbnb">Airbnb</MenuItem>
                  <MenuItem value="Resort">Resort</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Budget"
                  variant="outlined"
                  fullWidth
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Additional Preferences"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={additionalPreferences}
                  onChange={(e) => setAdditionalPreferences(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button onClick={handleClearFields} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
                  Clear Fields
                </Button>
              </Grid>
            </Grid>
          </form>
          <AskAI
            open={isModalOpen}
            onClose={handleCloseModal}
            submittedDetails={{
              destination,
              numberOfDays,
              sportPreferences,
              budget,
              accommodationType,
              transportation,
              additionalPreferences,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
