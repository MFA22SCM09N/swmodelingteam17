import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const AddEventModal = ({ open, onClose, onAddEvent }) => {
  const [name, setEventName] = useState('');
  const [date, setEventDate] = useState(null);
  const [place, setAddress] = useState('');
  const [parkingDetail, setParkingInfo] = useState('');
  const [photo, setImage] = useState(null);
  const [time, setEventTime] = useState(null);

  const [ticketLink, setTicketLink] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddEvent = () => {
    const imageUrl = URL.createObjectURL(photo);
    
    // Format date to display only the date
    const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : String(date);
    
    // Format time to display only the time
    let formattedTime = '';
    if (time instanceof Date) {
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        formattedTime = `${hours}:${minutes}`;
    } else {
        formattedTime = String(time);
    }

    const newEvent = {
        name,
        date: formattedDate,
        place,
        parkingDetail,
        photo,
        time: formattedTime,
        ticketLink,
        externalLinks: {
            twitter: 'https://twitter.com/whitesox',
            wiki: 'https://en.wikipedia.org/wiki/Chicago_White_Sox',
            facebook: 'https://www.facebook.com/WhiteSox',
            instagram: 'https://www.instagram.com/whitesox',
            homepage: 'https://www.mlb.com/whitesox',
        },
    };
    onAddEvent(newEvent);
    alert('Event added successfully!');
};




  const handleClearEvent = () => {
    setEventName('');
    setEventDate(null);
    setAddress('');
    setParkingInfo('');
    setImage(null);
  };

  const handleCloseModal = () => {
    // Clear all fields when the modal is closed
    handleClearEvent();
    onClose();
  };
  
  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '10px',
        }}
      >
        <Typography variant="h5" component="h2" sx={{textAlign: 'center'}}>
          Add New Event
        </Typography>
        <TextField
          fullWidth
          label="Event Name"
          value={name}
          onChange={(e) => setEventName(e.target.value)}
          margin="normal"
        />



        <Box marginTop="16px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Event Date"
                value={date}
                onChange={(newValue) => setEventDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>

        <Box marginTop="16px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Event Time"
              value={time}
              onChange={(newValue) => setEventTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>


        <TextField
          fullWidth
          label="Address"
          value={place}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Ticket link"
          value={ticketLink}
          onChange={(e) => setTicketLink(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Parking Info"
          value={parkingDetail}
          onChange={(e) => setParkingInfo(e.target.value)}
          margin="normal"
        />
        <input type="file" marginTop="4px" marginLeft="80px" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />

        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEvent}
          >
            Add Event
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClearEvent}
          >
            Clear all
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEventModal;
