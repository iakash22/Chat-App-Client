import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'; // Material UI components for Avatar, Avatar Group, Box, and Stack
import React from 'react'; // React library
import { transformImage } from '../../libs/features'; // Utility function to transform image URLs

const AvatarCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={"row"} spacing={"0.5"}> {/* Stack layout for arranging avatars horizontally */}
            <AvatarGroup max={max} sx={{ position: "relative" }}> {/* AvatarGroup to group avatars with a limit on visible avatars */}
                <Box width={"5rem"} height={"3rem"}> {/* Box to contain avatars, set specific width and height */}
                    {
                        avatar.map((src, index) => (
                            <Avatar
                                src={transformImage(src)} // Apply transformation to avatar image URL
                                alt={`Avatar ${index}`} // Alt text for the avatar image
                                key={Math.random() * 100} // Unique key based on random number for each avatar
                                sx={{
                                    width: "3rem", // Set avatar width
                                    height: "3rem", // Set avatar height
                                    position: "absolute", // Use absolute positioning to overlap avatars
                                    left: {
                                        xs: `${0.5 + index}rem`, // Dynamic positioning for small screens
                                        sm: `${index}rem`, // Dynamic positioning for larger screens
                                    }
                                }}
                            />
                        ))
                    }
                </Box>
            </AvatarGroup>
        </Stack>
    )
}

export default AvatarCard; // Export AvatarCard component
