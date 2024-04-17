import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment, IconButton } from '@mui/material';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        // Get isLoggedIn from Session Storage
        let isLoggedIn = sessionStorage.getItem('isLoggedIn');

        // If isLoggedIn is true, redirect to /dashboard
        if (isLoggedIn === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === "") {
            alert("user already logged in.")
            return
        }
        const users = JSON.parse(localStorage.getItem('userDetails')) || [];

        const user = users.find(user => user.email === email);
        if (user) {
            var pass = (CryptoJS.AES.decrypt(user.password, 'secret_key_here_lol').toString(CryptoJS.enc.Utf8));
            if (pass === password) {
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('loggedUser', user.email);
                window.location.href = "/dashboard";
            }
            else {
                alert("Wrong Password!");
            }
        }
        else {
            alert("No User Found with provided Email ID.");
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {/* Email address */}

                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            helperText="Valid hawk or gmail id"
                            inputProps={{ pattern: "^[a-zA-Z0-9]+@(hawk.iit.edu|gmail.com)$" }}
                            onChange={(event, data) => { setEmail(event.target.value) }}
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            inputProps={{ pattern: "^(?=.*[@#$])(.{8,})$" }} // Allow alphanumeric characters and spaces only
                            helperText="Must be at least 8 characters long containing atleast one out of @ ,# and $ symbol."
                            onChange={(event, data) => { setPassword(event.target.value) }}
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePasswordVisibility}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}