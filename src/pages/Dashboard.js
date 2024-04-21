import React, { useState, useEffect } from 'react';
import { Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [loggedOut, setLoggedOut] = useState(false);
    const [userRole, setUserRole] = useState("");

    console.log(userRole);

    let navigate = useNavigate();

    useEffect(() => {
        // If isLoggedIn is false, redirect to /signin
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/signin');
        }

        // Get user role
        const userRole = sessionStorage.getItem('userRole');
        setUserRole(userRole);
    }, [navigate]);

    const handleLogout = (event) => {
        event.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('loggedUser');
        sessionStorage.removeItem('userRole');
        setLoggedOut(true);
        navigate('/signin');
    };

    const handleManageUsers = () => {
        
    };

    return (
        <Container>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
                <Typography variant="h4">Dashboard</Typography>
                <Box sx={{ display: 'flex', gap: '10px' }}> 
                    {userRole === "System Admin" && (
                        <Button variant="contained" onClick={handleManageUsers}>
                            Manage Users
                        </Button>
                    )}
                    <Button variant="contained" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Body */}
            <Box my={2}>
                <Typography variant="body1">Welcome to the dashboard!</Typography>
                {/* Add more content here */}
            </Box>

            {/* Footer */}
            <Box py={2} mt={2} style={{ backgroundColor: '#f0f0f0' }}>
                <Typography variant="body2" align="center">© 2024 My Website</Typography>
            </Box>
        </Container>
    );
}

export default Dashboard;
