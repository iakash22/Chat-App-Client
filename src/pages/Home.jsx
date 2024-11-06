import React from 'react'
import AppLayout from '../components/layouts/AppLayout'
import { Box, Typography } from '@mui/material';

// Home component displaying a simple message and applying styling
const Home = () => {
    return (
        <Box height={"100%"} bgcolor={"rgba(247,247,247,1)"}> {/* Box with full height and background color */}
            <Typography
                p={"2rem"}           
                variant='h5'         
                textAlign={"center"} 
            >
                Select a friend to chat
            </Typography>
        </Box>
    )
}

// Wrap the Home component with the AppLayout HOC (Higher Order Component)
export default AppLayout()(Home);
