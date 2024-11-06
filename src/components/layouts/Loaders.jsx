import { Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'
import { BouncingSkeleton } from '../styles/StyleComponents'; // Assuming custom styled component for bouncing skeleton

// LayoutLoader component for displaying loading skeletons in the layout
const LayoutLoaders = () => {
    return (
        <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
            {/* Left sidebar skeleton for large screens */}
            <Grid
                item
                sm={4}
                md={3}
                height={"100%"}
                sx={{ display: { xs: "none", sm: "block" } }} // Hidden on small screens, shown on medium and larger
            >
                <Skeleton variant='reactangular' height={"100vh"} />
            </Grid>
            {/* Main content area skeleton */}
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                lg={6}
                height={"100%"}
            >
                <Stack spacing={"0.8rem"}>
                    {/* List of skeleton items */}
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} variant='rounded' height={"5rem"} />
                    ))}
                </Stack>
            </Grid>
            {/* Right sidebar skeleton for large screens */}
            <Grid
                item
                md={4}
                lg={3}
                sx={{
                    display: { xs: "none", md: "block" } // Hidden on small screens, shown on medium and larger
                }}
                height={"100%"}
            >
                <Skeleton variant='reactangular' height={"100vh"} />
            </Grid>
        </Grid>
    )
}

// TypingLoader component for simulating the typing indicator
const TypingLoader = () => {
    return (
        <Stack
            spacing={"0.5rem"}
            direction={"row"}  // Stack the skeletons horizontally
            padding={"0.5rem"}
            justifyContent={"center"}  // Center the skeletons
            // position={"fixed"}  // You can enable fixed position by uncommenting this
            // bottom={userType ? "13.5%" : "10.5%"}  // Dynamic positioning based on user type (optional)
            // left={"38%"}  // Adjust horizontal positioning if needed
        >
            {/* Animated Bouncing Skeletons simulating typing effect */}
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay: "0.1s",  // Delay for each skeleton to create a bouncing effect
                    backgroundColor : "#B6BBC4"  // Light gray background color
                }}
            />
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay: "0.2s",  // Delays animation for staggered effect
                    backgroundColor : "#B6BBC4",                    
                }}
            />
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay: "0.4s",  // Delays animation for staggered effect
                    backgroundColor : "#B6BBC4",
                }}
            />
            <BouncingSkeleton 
                variant='circular' 
                width={15} 
                height={15} 
                style={{
                    animationDelay: "0.6s",  // Delays animation for staggered effect
                    backgroundColor : "#B6BBC4",
                }}
            />
        </Stack>
    );
}

export { LayoutLoaders, TypingLoader }

