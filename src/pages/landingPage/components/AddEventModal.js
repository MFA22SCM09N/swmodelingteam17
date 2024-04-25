import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';


const AddEventModal = ({ open, onClose, onAddEvent }) => {
  const [name, setEventName] = useState('');
  const [date, setEventDate] = useState(null);
  const [place, setAddress] = useState('');
  const [parkingDetail, setParkingInfo] = useState('');
  const [photo, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  

  const handleAddEvent = () => {
    const imageUrl = URL.createObjectURL(photo);
    const newEvent = {
        name,
        date,
        place,
        parkingDetail,
        photo,
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

         <TextField
          fullWidth
          label="Event Date"
          value={date}
          onChange={(e) => setEventDate(e.target.value)}
          margin="normal"
        /> 
       
        <TextField
          fullWidth
          label="Address"
          value={place}
          onChange={(e) => setAddress(e.target.value)}
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
