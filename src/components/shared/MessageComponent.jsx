import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react'
import { fileformat } from '../../libs/features';
import RenderAttachment from './RenderAttachment';
import { motion } from 'framer-motion';

// MessageComponent renders an individual message with its content, sender details, and attachments
const MessageComponent = ({ message, user }) => {
    const { sender, attachments = [], createdAt, content } = message;
    const timeAgo = moment(createdAt).fromNow(); // Converts createdAt timestamp to a human-readable time format (e.g., "2 minutes ago")

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }} // Initial state of message: off-screen and invisible
            whileInView={{ opacity: 1, x: "0" }} // When the message is in view, animate it to full opacity and position
            style={{
                alignSelf: sender?._id === user?._id ? "flex-end" : "flex-start", // Align message to the right if the sender is the current user
                backgroundColor: "#fff", // White background for the message
                color: "#000", // Black text color for the message
                borderRadius: "5px", // Rounded corners for the message bubble
                padding: "0.5rem", // Padding around the message content
                width: "fit-content" // Adjust the width based on the message content
            }}
        >
            {/* Display sender's name if the message is not from the current user */}
            {sender?._id !== user?._id && (
                <Typography color={"#2694ab"} fontWeight={600} variant='caption'>
                    {sender?.name}
                </Typography>
            )}

            {/* Render the content of the message if available */}
            {content && <Typography>{content}</Typography>}

            {/* If there are attachments, render them */}
            {attachments.length > 0 && attachments.map((attach, index) => {
                const url = attach.url; // Get the attachment URL
                const file = fileformat(url); // Determine the file format (e.g., image, document) using the utility function

                return (
                    <Box key={index}> {/* Wrap each attachment in a Box */}
                        <a
                            href={url} // Link to open the attachment
                            target='_blank' // Open in a new tab
                            download // Allow users to download the attachment
                            style={{
                                color: "#000", // Set the link color to black
                            }}
                        >
                            {/* Render the attachment using the RenderAttachment component */}
                            <RenderAttachment
                                file={file} // Pass the file format
                                url={url}  // Pass the attachment URL
                            />
                        </a>
                    </Box>
                );
            })}

            {/* Display the relative time when the message was created (e.g., "5 minutes ago") */}
            <Typography variant='caption' color={"text.secondary"}>{timeAgo}</Typography>
        </motion.div>
    );
}

// Memoize the component to prevent unnecessary re-renders if the message props haven't changed
export default memo(MessageComponent);
