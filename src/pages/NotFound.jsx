import React from 'react';
import { Container, Stack, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container maxWidth="lg" sx={{ height: "100vh" }}>
            <Stack alignItems={"center"} spacing={"2rem"} justifyContent={"center"} height={"100%"}>
                <ErrorIcon sx={{ fontSize: '10rem', color: 'rgba(255,0,0,0.7)' }} />
                <Typography variant='h1' fontWeight={700} color="text.secondary">404</Typography>
                <Typography variant='h3' fontWeight={500} color="text.primary">Not Found</Typography>
                {/* Styled Button for better appearance */}
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                        Go Back to Home
                    </Button>
                </Link>
            </Stack>
        </Container>
    );
}

export default NotFound;
