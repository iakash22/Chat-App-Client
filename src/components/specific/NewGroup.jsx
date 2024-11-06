import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material' // Importing Material UI components for the UI
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData' // Importing sample users data for testing
import UserItem from '../shared/UserItem' // Importing UserItem component for displaying users
import { useInputValidation } from '6pp' // Custom hook for input validation
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api' // Redux hooks for fetching available friends and creating a group
import { useAsyncMutation, useErrors } from '../../hooks' // Custom hooks for handling async mutation and errors
import { setIsNewGroup } from '../../redux/reducers/slice/misc' // Action to toggle the visibility of the new group dialog
import { useDispatch, useSelector } from 'react-redux' // Redux hooks for dispatching actions and accessing state
import toast from 'react-hot-toast' // For displaying toast notifications

const NewGroup = () => {
    const groupName = useInputValidation(""); // Hook for managing group name input
    const [members, setMembers] = useState(sampleUsers); // State for storing all available users (using sample data for now)
    const [selectedMembers, setSelectedMembers] = useState([]); // State for storing selected members for the group
    const dispatch = useDispatch(); // Dispatching actions to Redux
    const { isNewGroup } = useSelector(state => state.misc) // Getting the state if the new group dialog should be open
    const { isError, isLoading, error, data } = useAvailableFriendsQuery(); // Fetching available friends for the group
    const [newGroup, isGroupLoading] = useAsyncMutation(useNewGroupMutation); // Mutation hook for creating the group
    const errors = [
        { isError, error }
    ];

    useErrors(errors); // Hook to handle errors from API calls

    // Handler to select or deselect a member for the group
    const selectMemberHandler = (id) => {
        setSelectedMembers(prev => (
            prev.includes(id) ? // If the user is already selected, remove them from selected members
                (prev.filter((selectId) => selectId !== id))
                :
                ([...prev, id]) // Else add the user to selected members
        ));
    }

    // Handler to create the group
    const createGroupHandler = async (e) => {
        const toastId = toast.loading('Group Creating...'); // Displaying a loading toast
        if (!groupName.value || !groupName.value.trim()) { // Check if group name is provided
            return toast.error("Group name is required", { id: toastId });
        }

        if (selectedMembers.length < 2) { // Check if at least 3 members are selected (excluding the admin)
            return toast.error("Please select atleast 3 members", { id: toastId });
        }
        // Calling the newGroup mutation to create the group
        await newGroup(
            "Group created",
            null,
            { name: groupName.value, members: selectedMembers },
        );
        toast.dismiss(toastId); // Dismissing the loading toast
        closehandler(); // Closing the dialog after group is created
    }

    // Handler to close the dialog
    const closehandler = () => dispatch(setIsNewGroup(false)); // Dispatching action to close the dialog

    return (
        <Dialog open={isNewGroup} onClose={closehandler}> {/* Dialog for creating a new group */}
            <Stack
                p={{ xs: "1rem", sm: "3rem" }}
                width={"25rem"}
                spacing={"2rem"}
            >
                <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle> {/* Title of the dialog */}
                <TextField
                    value={groupName.value}
                    onChange={groupName.changeHandler} // Handling changes to the group name input
                    label={"Group Name"} // Label for the group name input
                />
                <Typography variant='body1'>Members</Typography> {/* Text displaying "Members" */}
                <Stack >
                    {
                        isLoading ? // Displaying loading skeleton while data is being fetched
                            <Skeleton />
                            :
                            data?.data?.map((user, index) => (
                                <UserItem
                                    user={user}
                                    key={user._id}
                                    handler={selectMemberHandler} // Passing the handler to select/deselect members
                                    isAdded={selectedMembers.includes(user._id)} // Check if user is already selected
                                />
                            ))
                    }
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Button variant='text' color='error' onClick={closehandler}>Cancel</Button> {/* Cancel button to close the dialog */}
                    <Button variant='contained' onClick={createGroupHandler} disabled={isGroupLoading} >{isGroupLoading ? "Creating.." : "Create"}</Button> {/* Button to create the group */}
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default NewGroup;
