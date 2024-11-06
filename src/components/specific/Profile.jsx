import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {
    Face as FaceIcon, // Import icons from Material UI
    AlternateEmail as UserNameIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import moment from 'moment'; // For formatting dates
import { useSelector } from 'react-redux'; // To access the Redux store for user data
import { transformImage } from '../../libs/features'; // Helper function to transform image URLs

// Profile component that displays user profile information
const Profile = () => {
    // Access the user data from the Redux store using useSelector
    const { user } = useSelector(state => state.auth);

    return (
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
            {/* Display user avatar with custom styling */}
            <Avatar
                sx={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain", // Ensures the image fits the container without being stretched
                    marginBottom: "1rem",
                    border: "5px solid white" // Border around the avatar
                }}
                src={transformImage(user?.avatar?.url)} // Transform the avatar URL using transformImage function
                alt='Avatar'
            />
            {/* ProfileCard component to display the user's bio */}
            <ProfileCard
                text={user?.bio}
                heading={"Bio"}
            />
            {/* ProfileCard for username */}
            <ProfileCard
                text={user?.username}
                heading={"Username"}
                Icon={<UserNameIcon />} // Displaying username icon
            />
            {/* ProfileCard for name */}
            <ProfileCard
                text={user?.name}
                heading={"Name"}
                Icon={<FaceIcon />} // Displaying name icon
            />
            {/* ProfileCard for the user's join date */}
            <ProfileCard
                text={moment(user?.createdAt).fromNow()} // Format the date using moment.js
                heading={"Joined"}
                Icon={<CalendarIcon />} // Displaying calendar icon for the join date
            />
        </Stack>
    )
}

export default Profile;

// ProfileCard component to display user information in a structured way
const ProfileCard = ({ text, Icon, heading }) => {
    return (
        <Stack
            direction={"row"} // Aligning items in a row (icon and text)
            alignItems={"center"} // Center the items vertically
            spacing={"1rem"} // Spacing between the icon and text
            color={"white"} // Text color set to white
            textAlign={"center"} // Center the text horizontally
        >
            {Icon && Icon} {/* Conditionally render the icon if provided */}
            <Stack>
                <Typography variant='body1'>
                    {text} {/* Display the main text (e.g., username, bio, etc.) */}
                </Typography>
                <Typography variant='caption' color={"gray"}>
                    {heading} {/* Display the heading (e.g., Bio, Username) */}
                </Typography>
            </Stack>
        </Stack>
    )
}
