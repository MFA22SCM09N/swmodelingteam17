import React, { useState } from 'react';
import { Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import RecommendationButton from '../components/FetchRecommendation';

function Dashboard() {
    const [loggedOut, setLoggedOut] = useState(false);
    const HandleLogout = (event) => {
        event.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('loggedUser');
        setLoggedOut(true);
    };

    let navigate = useNavigate();
    useEffect(() => {
        // If isLoggedIn is true, redirect to /
        if (loggedOut === true) {
            navigate('/');
        }
    }, [navigate, loggedOut]);

    return (
        <Container>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
                <Typography variant="h4">Dashboard</Typography>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={HandleLogout}
                >
                    Logout
                </Button>
            </Box>

            {/* Body */}
            <Box my={2}>
                <Typography variant="body1">Welcome to the dashboard!</Typography>
                {/* Add more content here */}
                <RecommendationButton />
            </Box>

            {/* Footer */}
            <Box py={2} mt={2} style={{ backgroundColor: '#f0f0f0' }}>
                <Typography variant="body2" align="center">© 2024 My Website</Typography>
            </Box>
        </Container>
    );
}

export default Dashboard;
