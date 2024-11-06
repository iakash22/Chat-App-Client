import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField, Typography } from '@mui/material'
import { useInputValidation } from '6pp'; // Custom hook for input validation
import { Search as SearchIcon } from '@mui/icons-material' // Search icon from Material UI
import React, { useEffect, useState } from 'react'
import UserItem from '../shared/UserItem'; // Component to display each user in the search results
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon for adding a friend
import { useLazySearchUsercQuery, useSendFriendRequestMutation } from '../../redux/api'; // Redux API hooks
import toast from 'react-hot-toast'; // For showing toast notifications
import { green, pink, red } from '@mui/material/colors'; // Colors for toast icon
import { useAsyncMutation } from '../../hooks'; // Custom hook for async mutations

// Search component that allows the user to search for people and send friend requests
const Search = ({ open, setClose }) => {
    const search = useInputValidation(""); // Input validation hook for search query

    const [users, setUser] = useState([]); // State to hold search results (users)
    const [searchUser] = useLazySearchUsercQuery(); // Lazy query for searching users
    const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation); // Mutation for sending a friend request

    // Handler for sending a friend request to a selected user
    const addFriendHandler = async (id) => {
        const toastIcon = <PersonAddIcon sx={{ color: "#FA7070" }} />; // Toast icon for sending a friend request
        await sendFriendRequest("Sending friend request...", toastIcon, { userId: id }); // Send the friend request using the mutation
    };

    // Search for users whenever the search input changes
    useEffect(() => {
        const timeOutId = setTimeout(() => {
            if (search.value !== "" && search.value !== " ") {
                // Perform the search only if there's a valid query
                searchUser(search.value) // Call the search API with the query
                    .then(({ data }) => {
                        setUser(data?.data); // Set the users in the state if the search is successful
                    })
                    .catch((error) => console.log(error)); // Log any errors that occur
            }
        }, 1000); // Delay the search to avoid making API calls for every keystroke

        return () => {
            clearTimeout(timeOutId); // Cleanup the timeout if the component unmounts or the search input changes
        };
    }, [search.value]); // Re-run the effect when the search value changes

    return (
        <Dialog open={open} onClose={setClose}>
            <Stack
                p={"2rem"}
                direction={"column"}
                width={"25rem"}
            >
                {/* Dialog Title */}
                <DialogTitle textAlign={"center"}>
                    Find People
                </DialogTitle>
                {/* Search input field */}
                <TextField
                    label=""
                    value={search.value} // Bind the value of the text field to the search state
                    onChange={search.changeHandler} // Update the search value when the input changes
                    variant='outlined'
                    size='small'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon /> {/* Display search icon */}
                            </InputAdornment>
                        )
                    }}
                />
                {
                    users && users.length > 0 ? (
                        <List>
                            {/* Display the list of users */}
                            {users.map((user, index) => (
                                <UserItem
                                    user={user} // Pass user data to UserItem component
                                    key={user._id} // Unique key for each user item
                                    handler={addFriendHandler} // Handler to add the user as a friend
                                    handlerIsLoading={isLoadingSendFriendRequest} // Pass loading state for the handler
                                />
                            ))}
                        </List>
                    ) : (
                        <Typography
                            variant='body2'
                            sx={{
                                marginTop: "0.5rem",
                                padding: "0.4rem",
                                color: "#888888",
                                fontWeight: "100",
                            }}
                        >
                            Find someone new! Start your search above to make connections.
                        </Typography>
                    )
                }
            </Stack>
        </Dialog >
    )
}

export default Search;
