import { Button, Dialog, DialogActions, DialogTitle, Skeleton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useAsyncMutation, useErrors } from '../../hooks';
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/slice/misc';

const AddMemberDialog = ({ chatId }) => {
    // State to store the IDs of selected members
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Retrieve UI state for the dialog from Redux
    const { isAddMember } = useSelector(state => state.misc);
    const dispatch = useDispatch();

    // Set up the mutation for adding members with loading state
    const [addMembers, isLoadingAddMember] = useAsyncMutation(useAddGroupMemberMutation);

    // Fetch available friends for adding to the group
    const { isLoading, data, error, isError } = useAvailableFriendsQuery(chatId);

    // Error handling array
    const errors = [
        { error, isError },
    ];

    // Toggle selection of a member by ID
    const selectedMemberHandler = (id) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]);
    };

    // Close the dialog and reset selected members
    const closeHandler = () => {
        dispatch(setIsAddMember(false));
        setSelectedMembers([]);
    };

    // Submit selected members to the group
    const addMemberSubmitHandler = () => {
        if (selectedMembers.length < 1) { // Ensures at least one member is selected
            return toast.error("Please add members");
        }
        addMembers("Members Adding...", null, { chatId, members: selectedMembers });
        closeHandler();
    };

    // Handle any errors in the dialog
    useErrors(errors);

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>
                    Add Member
                </DialogTitle>

                <Stack spacing={"1rem"}>
                    {isLoading ?
                        <Skeleton /> : // Display loader if data is still loading
                        data?.data?.length > 0 ? (
                            data.data.map((user) => (
                                <UserItem
                                    key={user._id}
                                    user={user}
                                    handler={selectedMemberHandler} // Handler for selecting a member
                                    isAdded={selectedMembers.includes(user._id)} // Check if the user is selected
                                />
                            ))
                        ) : (
                            <Typography textAlign={"center"}>
                                No friend
                            </Typography> // Show message if no friends are available
                        )
                    }
                </Stack>

                <Stack justifyContent={"space-evenly"} direction={"row"} alignItems={"center"}>
                    <Button color='error' onClick={closeHandler}>Cancel</Button>
                    <Button
                        variant='contained'
                        disabled={isLoadingAddMember} // Disable button while mutation is in progress
                        onClick={addMemberSubmitHandler}
                    >
                        Submit changes
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
}

export default AddMemberDialog;
