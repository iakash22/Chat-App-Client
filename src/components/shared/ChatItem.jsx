import React, { memo } from 'react'; // memo for optimization, React for component functionality
import { Link } from '../styles/StyleComponents'; // Custom Link component
import { Box, Stack, Typography } from '@mui/material'; // Material UI components for layout
import AvatarCard from './AvatarCard'; // Custom AvatarCard component
import { useSelector } from 'react-redux'; // useSelector to access Redux state
import { motion } from 'framer-motion'; // Framer Motion for animations

// ChatItem component to display each individual chat
const ChatItem = (
    {
        avatar = [], // Array of avatar images
        name, // Name of the chat or user
        _id, // Unique ID for the chat
        groupChat = false, // Whether the chat is a group chat
        sameSender, // Indicates if the message sender is the same as the previous one
        isOnline, // Whether the user is online
        newMessageAlert, // Alert indicating new messages
        index = 0, // Index to determine animation delay
        handleDeleteChat, // Function to handle chat deletion on right-click
    }
) => {
    // Accessing mobile state and user typing state from Redux store
    const { isMobile } = useSelector(state => state.misc);
    const { userTyping } = useSelector(state => state.chat);

    return (
        <Link
            sx={{ padding: "0", width: "100%" }} // Styling for the link to chat
            to={`/chat/${_id}`} // Navigate to chat with the given _id
            onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)} // Handle right-click context menu for delete option
        >
            {/* Animation for the chat item with Framer Motion */}
            <motion.div
                initial={{ opacity: 0, y: "-100%" }} // Initial state: invisible and positioned off-screen
                whileInView={{ opacity: 1, y: "0" }} // When in view: visible and at original position
                transition={{ delay: index * 0.1 }} // Staggered animation with delay based on index
                style={{
                    display: "flex", // Flex layout for alignment
                    alignItems: "center", // Vertically center the items
                    padding: "1rem", // Padding around the item
                    backgroundColor: sameSender ? "black" : "unset", // Conditional background color based on sender
                    color: sameSender ? "white" : "unset", // Conditional text color based on sender
                    gap: "1rem", // Space between avatar and text
                    position: "relative", // To position the online status indicator
                    width: "100%" // Full width
                }}
            >
                {/* AvatarCard component displaying the avatars */}
                <AvatarCard avatar={avatar} />

                <Stack> {/* Stack layout for the text */}
                    <Typography sx={{ textTransform: "capitalize" }}>{name}</Typography> {/* Display the name */}
                    
                    {/* Display new message alert if available */}
                    {newMessageAlert && (
                        <Typography>{newMessageAlert.count} New Message</Typography>
                    )}

                    {/* Display typing indicator for mobile */}
                    {(isMobile && userTyping.includes(_id)) && (
                        <span style={{ fontSize: "14px", marginTop: "-0.1rem" }}>typing...</span>
                    )}
                </Stack>

                {/* Online status indicator */}
                {isOnline && (
                    <Box
                        sx={{
                            width: "10px", // Small circle size
                            height: "10px", // Small circle size
                            borderRadius: "50%", // Make the box circular
                            backgroundColor: "green", // Green for online status
                            position: "absolute", // Positioned absolutely within the parent
                            top: "50%", // Vertically centered
                            right: "1rem", // Right side of the container
                            transform: "translateY(-50%)" // Adjust for exact centering
                        }}
                    />
                )}
            </motion.div>
        </Link>
    )
}

export default memo(ChatItem); // memo to optimize rendering by preventing unnecessary re-renders
