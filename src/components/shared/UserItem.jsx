import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { transformImage } from '../../libs/features';

// UserItem component displays individual user information with options to add or remove them
const UserItem = ({ user, handler, handlerIsLoading, isAdded, styling }) => {
    const { name, _id, avatar } = user; // Extracting user details (name, id, avatar)

    return (
        <ListItem> {/* List item to display user info */}
            <Stack
                direction={"row"} // Items are aligned in a row
                alignItems={"center"} // Aligns items vertically in the center
                spacing={"1rem"} // Adds space between items
                width={"100%"} // Full width of the parent container
                {...styling} // Applying custom styling passed as prop
            >
                <Avatar src={transformImage(avatar)} /> {/* Displays user's avatar */}

                <Typography
                    variant='body1' // Defines the typography style
                    sx={{
                        flexGrow: 1, // Allows text to take up available space
                        display: "-webkit-box", // Creates a flex container for text
                        WebkitLineClamp: 1, // Limits the text to one line
                        WebkitBoxOrient: "vertical", // Allows the text to be ellipsed
                        overflow: "hidden", // Ensures text doesn't overflow
                        textOverflow : "ellipsis" // Shows ellipsis when text overflows
                    }}
                >
                    {name} {/* Display the user's name */}
                </Typography>

                {/* Icon button for adding/removing user */}
                <IconButton
                    onClick={() => handler(_id, name)} // Calls handler function with user id and name
                    disabled={handlerIsLoading} // Disables the button when the handler is loading
                    size='small' // Small size for the icon button
                    sx={{
                        bgcolor: isAdded ? "error.main" : "primary.main", // Changes background color based on 'isAdded' status
                        color: "white", // White icon color
                        "&:hover": {
                            bgcolor: isAdded ? "error.dark" : "primary.dark", // Changes color on hover
                        },
                    }}
                >
                    {isAdded ? <RemoveIcon /> : <AddIcon />} {/* Display appropriate icon based on 'isAdded' status */}
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem);
